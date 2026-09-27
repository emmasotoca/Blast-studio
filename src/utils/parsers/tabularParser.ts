import { BlastHit, BlastProgram, BlastResult, Hsp } from '../../types/blast';
import { computeTotalQueryCoverage, extractAccession, extractOrganism } from '../bioUtils';

export function parseBlastTabular(raw: string): BlastResult {
  const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

  let program: BlastProgram = 'BLASTN';
  let version = '';
  let queryId = 'Query_1';
  let queryTitle = 'Séquence Requête';
  let queryLength = 0;
  let database = 'Database';
  let fieldNames: string[] = [];

  // Temporary storage: group HSPs by subject ID
  const hitsMap = new Map<string, {
    id: string;
    title: string;
    accession: string;
    organism?: string;
    len: number;
    hsps: Hsp[];
  }>();

  for (const line of lines) {
    if (line.startsWith('#')) {
      // Check for program header e.g. # BLASTN 2.14.0+ or # BLASTP 2.12.0+
      const progMatch = line.match(/^#\s*(BLAST[NPX]|TBLAST[NX])\s*([\w\.\+\-]+)?/i);
      if (progMatch) {
        program = progMatch[1].toUpperCase() as BlastProgram;
        if (progMatch[2]) version = progMatch[2];
      }

      // Query comment
      const queryMatch = line.match(/^#\s*Query:\s*(.+)$/i);
      if (queryMatch) {
        const fullQ = queryMatch[1].trim();
        const parts = fullQ.split(/\s+/);
        queryId = parts[0] || queryId;
        queryTitle = fullQ;
      }

      // Query length if present
      const qlenMatch = line.match(/^#\s*Query\s+length:\s*(\d+)/i);
      if (qlenMatch) {
        queryLength = parseInt(qlenMatch[1], 10);
      }

      // Database
      const dbMatch = line.match(/^#\s*Database:\s*(.+)$/i);
      if (dbMatch) {
        database = dbMatch[1].trim();
      }

      // Custom fields definition: # Fields: qseqid, sseqid, pident, ...
      const fieldsMatch = line.match(/^#\s*Fields:\s*(.+)$/i);
      if (fieldsMatch) {
        fieldNames = fieldsMatch[1].split(/,\s*/).map(f => f.trim().toLowerCase());
      }
      continue;
    }

    // Split tabular columns
    const cols = line.split('\t');
    if (cols.length < 11) {
      // Might be whitespace separated if tabs got flattened
      const spaceCols = line.split(/\s+/);
      if (spaceCols.length >= 12 && !isNaN(Number(spaceCols[2]))) {
        // use spaceCols
        parseTabularRow(spaceCols, fieldNames, hitsMap, (len) => {
          if (len > queryLength) queryLength = len;
        }, (id, title) => {
          if (queryId === 'Query_1') queryId = id;
          if (queryTitle === 'Séquence Requête') queryTitle = title || id;
        });
      }
      continue;
    }

    parseTabularRow(cols, fieldNames, hitsMap, (len) => {
      if (len > queryLength) queryLength = len;
    }, (id, title) => {
      if (queryId === 'Query_1') queryId = id;
      if (queryTitle === 'Séquence Requête') queryTitle = title || id;
    });
  }

  // If query length was not explicitly stated in comments or qlen column, estimate from max qend
  let maxCoord = queryLength;
  hitsMap.forEach(h => {
    h.hsps.forEach(hsp => {
      if (hsp.queryTo > maxCoord) maxCoord = hsp.queryTo;
      if (hsp.queryFrom > maxCoord) maxCoord = hsp.queryFrom;
    });
  });
  if (queryLength <= 0) {
    queryLength = maxCoord > 0 ? maxCoord : 1000;
  }

  // Convert map to sorted BlastHit[]
  const rawHits = Array.from(hitsMap.values());
  const blastHits: BlastHit[] = rawHits.map((rawHit, index) => {
    // Sort HSPs by bitScore desc
    rawHit.hsps.sort((a, b) => b.bitScore - a.bitScore);

    const bestBitScore = Math.max(...rawHit.hsps.map(h => h.bitScore));
    const bestEvalue = Math.min(...rawHit.hsps.map(h => h.evalue));
    const bestPident = Math.max(...rawHit.hsps.map(h => h.pident));
    const totalAlignLen = rawHit.hsps.reduce((acc, h) => acc + h.alignLen, 0);
    const totalQueryCoverage = computeTotalQueryCoverage(rawHit.hsps, queryLength);

    return {
      num: index + 1,
      id: rawHit.id,
      accession: rawHit.accession,
      title: rawHit.title || rawHit.id,
      organism: rawHit.organism || extractOrganism(rawHit.title, rawHit.id),
      len: rawHit.len || totalAlignLen,
      hsps: rawHit.hsps,
      bestBitScore,
      bestEvalue,
      bestPident,
      totalQueryCoverage,
      totalAlignLen
    };
  });

  // Sort hits by best bitscore desc, then best evalue asc
  blastHits.sort((a, b) => b.bestBitScore - a.bestBitScore || a.bestEvalue - b.bestEvalue);

  // Re-number
  blastHits.forEach((h, i) => { h.num = i + 1; });

  return {
    program,
    version: version || '2.14.0+',
    queryId,
    queryTitle,
    queryLength,
    database,
    format: fieldNames.length > 0 || raw.includes('# BLAST') ? 'tabular_outfmt7' : 'tabular_outfmt6',
    hits: blastHits,
    stats: {
      hspCount: blastHits.reduce((acc, h) => acc + h.hsps.length, 0)
    }
  };
}

function parseTabularRow(
  cols: string[], 
  fields: string[], 
  hitsMap: Map<string, { id: string; title: string; accession: string; organism?: string; len: number; hsps: Hsp[] }>,
  onQueryLenCandidate: (len: number) => void,
  onQueryInfo: (id: string, title?: string) => void
) {
  // If fields were explicitly specified, map by index
  let qseqid = '';
  let sseqid = '';
  let pident = 0;
  let length = 0;
  let mismatch = 0;
  let gapopen = 0;
  let qstart = 0;
  let qend = 0;
  let sstart = 0;
  let send = 0;
  let evalue = 0;
  let bitscore = 0;
  let stitle = '';
  let qlen = 0;
  let slen = 0;
  let qcovs = 0;

  if (fields.length > 0) {
    fields.forEach((fieldName, idx) => {
      const val = cols[idx];
      if (val === undefined) return;
      switch (fieldName) {
        case 'qseqid': qseqid = val; break;
        case 'sseqid': sseqid = val; break;
        case 'pident': pident = parseFloat(val); break;
        case 'length': length = parseInt(val, 10); break;
        case 'mismatch': mismatch = parseInt(val, 10); break;
        case 'gapopen': gapopen = parseInt(val, 10); break;
        case 'qstart': qstart = parseInt(val, 10); break;
        case 'qend': qend = parseInt(val, 10); break;
        case 'sstart': sstart = parseInt(val, 10); break;
        case 'send': send = parseInt(val, 10); break;
        case 'evalue': evalue = parseFloat(val); break;
        case 'bitscore': bitscore = parseFloat(val); break;
        case 'stitle': stitle = val; break;
        case 'qlen': qlen = parseInt(val, 10); break;
        case 'slen': slen = parseInt(val, 10); break;
        case 'qcovs': qcovs = parseFloat(val); break;
      }
    });
  } else {
    // Standard 12 columns BLAST tabular:
    // 0: qseqid
    // 1: sseqid
    // 2: pident
    // 3: length
    // 4: mismatch
    // 5: gapopen
    // 6: qstart
    // 7: qend
    // 8: sstart
    // 9: send
    // 10: evalue
    // 11: bitscore
    qseqid = cols[0] || 'Query';
    sseqid = cols[1] || 'Subject';
    pident = parseFloat(cols[2]) || 0;
    length = parseInt(cols[3], 10) || 0;
    mismatch = parseInt(cols[4], 10) || 0;
    gapopen = parseInt(cols[5], 10) || 0;
    qstart = parseInt(cols[6], 10) || 1;
    qend = parseInt(cols[7], 10) || length;
    sstart = parseInt(cols[8], 10) || 1;
    send = parseInt(cols[9], 10) || length;
    evalue = parseFloat(cols[10]) || 0;
    bitscore = parseFloat(cols[11]) || 0;
    // If extra columns exist, column 12 is often stitle or qcovs
    if (cols.length > 12) {
      stitle = cols.slice(12).join('\t');
    }
  }

  if (qlen > 0) onQueryLenCandidate(qlen);
  onQueryInfo(qseqid);

  if (!sseqid) return;

  const accession = extractAccession(sseqid, stitle);
  const organism = extractOrganism(stitle, sseqid);

  const hsp: Hsp = {
    hspNum: 1,
    bitScore: isNaN(bitscore) ? 0 : bitscore,
    score: Math.round(bitscore * 2), // approximation if raw score missing
    evalue: isNaN(evalue) ? 0 : evalue,
    queryFrom: Math.min(qstart, qend),
    queryTo: Math.max(qstart, qend),
    hitFrom: Math.min(sstart, send),
    hitTo: Math.max(sstart, send),
    identity: Math.round((pident / 100) * length),
    gaps: gapopen,
    alignLen: length,
    pident: isNaN(pident) ? 0 : pident,
    qcov: qcovs || undefined,
    strand: sstart <= send ? 'Plus/Plus' : 'Plus/Minus'
  };

  if (!hitsMap.has(sseqid)) {
    hitsMap.set(sseqid, {
      id: sseqid,
      title: stitle || sseqid,
      accession,
      organism,
      len: slen || Math.max(sstart, send),
      hsps: [hsp]
    });
  } else {
    const existing = hitsMap.get(sseqid)!;
    hsp.hspNum = existing.hsps.length + 1;
    existing.hsps.push(hsp);
    if (!existing.title && stitle) existing.title = stitle;
    if (slen > existing.len) existing.len = slen;
  }
}
