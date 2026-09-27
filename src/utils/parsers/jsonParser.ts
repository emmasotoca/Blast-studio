import { BlastHit, BlastProgram, BlastResult, Hsp } from '../../types/blast';
import { computeTotalQueryCoverage, extractAccession, extractOrganism } from '../bioUtils';

export function parseBlastJson(raw: string): BlastResult {
  const data = JSON.parse(raw);

  let program: BlastProgram = 'BLASTN';
  let version = '2.14.0+';
  let queryId = 'Query_1';
  let queryTitle = 'Séquence Requête';
  let queryLength = 1000;
  let database = 'Database';
  let rawHits: any[] = [];

  // Check NCBI BLAST+ -outfmt 15 format
  if (data.BlastOutput2) {
    const report = Array.isArray(data.BlastOutput2) ? data.BlastOutput2[0]?.report : data.BlastOutput2.report;
    if (report) {
      if (report.program) program = report.program.toUpperCase() as BlastProgram;
      if (report.version) version = report.version;
      if (report.search_target?.db) database = report.search_target.db;

      const search = report.results?.search;
      if (search) {
        queryId = search.query_id || queryId;
        queryTitle = search.query_title || search.query_def || queryId;
        queryLength = search.query_len || queryLength;
        rawHits = search.hits || [];
      }
    }
  } else if (data.results?.search) {
    const search = data.results.search;
    queryId = search.query_id || queryId;
    queryTitle = search.query_title || search.query_def || queryId;
    queryLength = search.query_len || queryLength;
    rawHits = search.hits || [];
    if (data.program) program = data.program.toUpperCase() as BlastProgram;
  } else if (Array.isArray(data.hits)) {
    // Simplified custom JSON
    rawHits = data.hits;
    if (data.program) program = data.program.toUpperCase() as BlastProgram;
    if (data.queryId) queryId = data.queryId;
    if (data.queryTitle) queryTitle = data.queryTitle;
    if (data.queryLength) queryLength = data.queryLength;
    if (data.database) database = data.database;
  }

  const blastHits: BlastHit[] = [];

  rawHits.forEach((hitObj: any, index: number) => {
    // Hit description in NCBI BlastOutput2 is hitObj.description[0]
    const descObj = Array.isArray(hitObj.description) ? hitObj.description[0] : (hitObj.description || {});
    const hitId = descObj.id || hitObj.id || `Hit_${index + 1}`;
    const hitTitle = descObj.title || descObj.sciname || hitObj.title || hitId;
    const hitAcc = descObj.accession || hitObj.accession || extractAccession(hitId, hitTitle);
    const hitLen = hitObj.len || 0;
    const organism = extractOrganism(hitTitle, hitId);

    const hspsList = hitObj.hsps || [];
    const hsps: Hsp[] = [];

    hspsList.forEach((hspObj: any, hIdx: number) => {
      const bitScore = hspObj.bit_score ?? hspObj.bitScore ?? 0;
      const score = hspObj.score ?? 0;
      const evalue = hspObj.evalue ?? 0;
      const queryFrom = hspObj.query_from ?? hspObj.queryFrom ?? 1;
      const queryTo = hspObj.query_to ?? hspObj.queryTo ?? 1;
      const hitFrom = hspObj.hit_from ?? hspObj.hitFrom ?? 1;
      const hitTo = hspObj.hit_to ?? hspObj.hitTo ?? 1;
      const identity = hspObj.identity ?? 0;
      const positive = hspObj.positive;
      const gaps = hspObj.gaps ?? 0;
      const alignLen = hspObj.align_len ?? hspObj.alignLen ?? Math.abs(queryTo - queryFrom) + 1;
      const pident = alignLen > 0 ? Math.round((identity / alignLen) * 1000) / 10 : 0;
      const qcov = queryLength > 0 ? Math.round(((Math.abs(queryTo - queryFrom) + 1) / queryLength) * 1000) / 10 : undefined;

      hsps.push({
        hspNum: hIdx + 1,
        bitScore,
        score,
        evalue,
        queryFrom: Math.min(queryFrom, queryTo),
        queryTo: Math.max(queryFrom, queryTo),
        hitFrom: Math.min(hitFrom, hitTo),
        hitTo: Math.max(hitFrom, hitTo),
        identity,
        positive,
        gaps,
        alignLen,
        pident,
        qcov,
        qseq: hspObj.qseq,
        hseq: hspObj.hseq,
        midline: hspObj.midline,
        strand: hspObj.query_strand ? `${hspObj.query_strand}/${hspObj.hit_strand}` : 'Plus/Plus'
      });
    });

    if (hsps.length === 0) return;

    hsps.sort((a, b) => b.bitScore - a.bitScore);
    const bestBitScore = Math.max(...hsps.map(h => h.bitScore));
    const bestEvalue = Math.min(...hsps.map(h => h.evalue));
    const bestPident = Math.max(...hsps.map(h => h.pident));
    const totalAlignLen = hsps.reduce((acc, h) => acc + h.alignLen, 0);
    const totalQueryCoverage = computeTotalQueryCoverage(hsps, queryLength);

    blastHits.push({
      num: index + 1,
      id: hitId,
      accession: hitAcc,
      title: hitTitle,
      organism,
      len: hitLen,
      hsps,
      bestBitScore,
      bestEvalue,
      bestPident,
      totalQueryCoverage,
      totalAlignLen
    });
  });

  blastHits.sort((a, b) => b.bestBitScore - a.bestBitScore || a.bestEvalue - b.bestEvalue);
  blastHits.forEach((h, i) => { h.num = i + 1; });

  return {
    program,
    version,
    queryId,
    queryTitle,
    queryLength,
    database,
    format: 'json',
    hits: blastHits,
    stats: {
      hspCount: blastHits.reduce((acc, h) => acc + h.hsps.length, 0)
    }
  };
}
