import { BlastHit, BlastProgram, BlastResult, Hsp } from '../../types/blast';
import { computeTotalQueryCoverage, extractAccession, extractOrganism } from '../bioUtils';

export function parseBlastPairwise(raw: string): BlastResult {
  const lines = raw.split(/\r?\n/);

  let program: BlastProgram = 'BLASTN';
  let version = '';
  let queryId = 'Query_1';
  let queryTitle = 'Séquence Requête';
  let queryLength = 0;
  let database = 'Database';

  // Find program
  for (let i = 0; i < Math.min(lines.length, 30); i++) {
    const line = lines[i];
    const progMatch = line.match(/^\s*(BLAST[NPX]|TBLAST[NX])\s*([\w\.\+\-]+)?/i);
    if (progMatch) {
      program = progMatch[1].toUpperCase() as BlastProgram;
      if (progMatch[2]) version = progMatch[2];
      break;
    }
  }

  // Parse Query info & length
  for (let i = 0; i < Math.min(lines.length, 100); i++) {
    const line = lines[i];
    const queryMatch = line.match(/^Query=\s*(.+)$/i);
    if (queryMatch) {
      let qFull = queryMatch[1].trim();
      // Look ahead for wrapped query lines before Length=
      let j = i + 1;
      while (j < lines.length && !lines[j].startsWith('Length=') && !lines[j].startsWith('(') && !lines[j].startsWith('Database:') && lines[j].trim().length > 0) {
        qFull += ' ' + lines[j].trim();
        j++;
      }
      queryTitle = qFull;
      queryId = qFull.split(/\s+/)[0];
    }

    const lenMatch = line.match(/Length=(\d+)/i) || line.match(/\((\d+)\s+letters\)/i);
    if (lenMatch && queryLength === 0) {
      queryLength = parseInt(lenMatch[1], 10);
    }

    const dbMatch = line.match(/^Database:\s*(.+)$/i);
    if (dbMatch) {
      database = dbMatch[1].trim();
    }
  }

  // Split into hit sections by lines starting with '>'
  const hitSections: string[][] = [];
  let currentSection: string[] = [];
  let foundFirstHit = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('>')) {
      foundFirstHit = true;
      if (currentSection.length > 0) {
        hitSections.push(currentSection);
      }
      currentSection = [line];
    } else if (foundFirstHit) {
      // Check if end of report (e.g. "Lambda     K      H")
      if (line.trim().startsWith('Lambda') && line.includes('K')) {
        break;
      }
      currentSection.push(line);
    }
  }
  if (currentSection.length > 0) {
    hitSections.push(currentSection);
  }

  const blastHits: BlastHit[] = [];

  hitSections.forEach((sectionLines, hitIndex) => {
    // First line is >ID and description
    let hitHeader = sectionLines[0].substring(1).trim();
    let hitLen = 0;
    let lineIdx = 1;

    // Continue multiline header until "Length = " or "Length="
    while (lineIdx < sectionLines.length) {
      const curLine = sectionLines[lineIdx];
      const lenMatch = curLine.match(/Length\s*=\s*(\d+)/i);
      if (lenMatch) {
        hitLen = parseInt(lenMatch[1], 10);
        lineIdx++;
        break;
      }
      if (curLine.trim().startsWith('Score =')) {
        break;
      }
      if (curLine.trim().length > 0) {
        hitHeader += ' ' + curLine.trim();
      }
      lineIdx++;
    }

    const hitId = hitHeader.split(/\s+/)[0] || `Hit_${hitIndex + 1}`;
    const hitTitle = hitHeader || hitId;
    const hitAcc = extractAccession(hitId, hitTitle);
    const organism = extractOrganism(hitTitle, hitId);

    // Group HSPs within this section
    const hsps: Hsp[] = [];
    let currentHspLines: string[] = [];

    while (lineIdx < sectionLines.length) {
      const line = sectionLines[lineIdx];
      if (line.trim().startsWith('Score =')) {
        if (currentHspLines.length > 0) {
          const parsed = parseHspBlock(currentHspLines, hsps.length + 1, queryLength);
          if (parsed) hsps.push(parsed);
        }
        currentHspLines = [line];
      } else if (currentHspLines.length > 0) {
        currentHspLines.push(line);
      }
      lineIdx++;
    }
    if (currentHspLines.length > 0) {
      const parsed = parseHspBlock(currentHspLines, hsps.length + 1, queryLength);
      if (parsed) hsps.push(parsed);
    }

    if (hsps.length === 0) return;

    hsps.sort((a, b) => b.bitScore - a.bitScore);
    const bestBitScore = Math.max(...hsps.map(h => h.bitScore));
    const bestEvalue = Math.min(...hsps.map(h => h.evalue));
    const bestPident = Math.max(...hsps.map(h => h.pident));
    const totalAlignLen = hsps.reduce((acc, h) => acc + h.alignLen, 0);
    const totalQueryCoverage = computeTotalQueryCoverage(hsps, queryLength);

    blastHits.push({
      num: hitIndex + 1,
      id: hitId,
      accession: hitAcc,
      title: hitTitle,
      organism,
      len: hitLen || totalAlignLen,
      hsps,
      bestBitScore,
      bestEvalue,
      bestPident,
      totalQueryCoverage,
      totalAlignLen
    });
  });

  // Calculate queryLength if still unknown
  if (queryLength === 0) {
    let maxQ = 0;
    blastHits.forEach(h => h.hsps.forEach(hsp => {
      if (hsp.queryTo > maxQ) maxQ = hsp.queryTo;
    }));
    queryLength = maxQ > 0 ? maxQ : 1000;
  }

  blastHits.sort((a, b) => b.bestBitScore - a.bestBitScore || a.bestEvalue - b.bestEvalue);
  blastHits.forEach((h, i) => { h.num = i + 1; });

  return {
    program,
    version,
    queryId,
    queryTitle,
    queryLength,
    database,
    format: 'pairwise_outfmt0',
    hits: blastHits,
    stats: {
      hspCount: blastHits.reduce((acc, h) => acc + h.hsps.length, 0)
    }
  };
}

function parseHspBlock(lines: string[], hspNum: number, queryLength: number): Hsp | null {
  let bitScore = 0;
  let score = 0;
  let evalue = 0;
  let identity = 0;
  let alignLen = 0;
  let positive: number | undefined = undefined;
  let gaps = 0;
  let pident = 0;
  let strand = 'Plus/Plus';
  let queryFrom = 0;
  let queryTo = 0;
  let hitFrom = 0;
  let hitTo = 0;

  let qseqAcc = '';
  let hseqAcc = '';
  let midlineAcc = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Score = 2784 bits (1507),  Expect = 0.0
    // Score = 45.2 bits (106),  Expect(2) = 0.003
    const scoreMatch = line.match(/Score\s*=\s*([\d\.]+)\s+bits\s*(?:\((\d+)\))?,\s*Expect(?:\(\d+\))?\s*=\s*([0-9eE\.\-]+)/i);
    if (scoreMatch) {
      bitScore = parseFloat(scoreMatch[1]);
      score = scoreMatch[2] ? parseInt(scoreMatch[2], 10) : Math.round(bitScore * 2);
      let evRaw = scoreMatch[3];
      if (evRaw.startsWith('e') || evRaw.startsWith('E')) evRaw = '1' + evRaw;
      evalue = parseFloat(evRaw) || 0;
    }

    // Identities = 1533/1542 (99%), Positives = 1533/1542 (99%), Gaps = 3/1542 (0%)
    const idMatch = line.match(/Identities\s*=\s*(\d+)\/(\d+)\s*\(([\d\.]+)%\)/i);
    if (idMatch) {
      identity = parseInt(idMatch[1], 10);
      alignLen = parseInt(idMatch[2], 10);
      pident = parseFloat(idMatch[3]);
    }

    const posMatch = line.match(/Positives\s*=\s*(\d+)\/(\d+)/i);
    if (posMatch) {
      positive = parseInt(posMatch[1], 10);
    }

    const gapMatch = line.match(/Gaps\s*=\s*(\d+)\//i);
    if (gapMatch) {
      gaps = parseInt(gapMatch[1], 10);
    }

    // Strand=Plus/Plus or Frame = +1
    const strandMatch = line.match(/Strand\s*=\s*([A-Za-z]+)\/([A-Za-z]+)/i);
    if (strandMatch) {
      strand = `${strandMatch[1]}/${strandMatch[2]}`;
    }

    // Alignment lines:
    // Query  61    GTCGAACGGTAACAGGAAGCAGCTTGCTGCTTCGCTGACGAGTGGCGGACGGGTGAGTAA  120
    //              ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
    // Sbjct  61    GTCGAACGGTAACAGGAAGCAGCTTGCTGCTTCGCTGACGAGTGGCGGACGGGTGAGTAA  120
    if (line.trim().startsWith('Query')) {
      const qTokens = line.trim().split(/\s+/);
      if (qTokens.length >= 4) {
        const qStart = parseInt(qTokens[1], 10);
        const seqPart = qTokens[2];
        const qEnd = parseInt(qTokens[3], 10);

        if (queryFrom === 0) queryFrom = qStart;
        queryTo = qEnd;
        qseqAcc += seqPart;

        // The line directly below is midline
        // The line below that is Sbjct
        const midLineRaw = lines[i + 1] || '';
        const sbjctLineRaw = lines[i + 2] || '';

        if (sbjctLineRaw.trim().startsWith('Sbjct')) {
          const sTokens = sbjctLineRaw.trim().split(/\s+/);
          if (sTokens.length >= 4) {
            const sStart = parseInt(sTokens[1], 10);
            const sPart = sTokens[2];
            const sEnd = parseInt(sTokens[3], 10);

            if (hitFrom === 0) hitFrom = sStart;
            hitTo = sEnd;
            hseqAcc += sPart;

            // Extract midline matching the sequence column position
            const qSeqPos = line.indexOf(seqPart);
            let midPart = '';
            if (qSeqPos !== -1 && midLineRaw.length >= qSeqPos) {
              midPart = midLineRaw.substring(qSeqPos, qSeqPos + seqPart.length);
            }
            if (midPart.length < seqPart.length) {
              midPart = midPart.padEnd(seqPart.length, ' ');
            }
            midlineAcc += midPart;

            i += 2; // skip processed mid and sbjct lines
          }
        }
      }
    }
  }

  if (queryFrom === 0) return null;

  const minQ = Math.min(queryFrom, queryTo);
  const maxQ = Math.max(queryFrom, queryTo);
  const minH = Math.min(hitFrom, hitTo);
  const maxH = Math.max(hitFrom, hitTo);

  const qcov = queryLength > 0 ? Math.round(((maxQ - minQ + 1) / queryLength) * 1000) / 10 : undefined;

  return {
    hspNum,
    bitScore,
    score,
    evalue,
    queryFrom: minQ,
    queryTo: maxQ,
    hitFrom: minH,
    hitTo: maxH,
    identity,
    positive,
    gaps,
    alignLen: alignLen || qseqAcc.length,
    pident: pident || (alignLen > 0 ? Math.round((identity / alignLen) * 1000) / 10 : 100),
    qcov,
    qseq: qseqAcc || undefined,
    hseq: hseqAcc || undefined,
    midline: midlineAcc || undefined,
    strand
  };
}
