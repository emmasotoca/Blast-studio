import { BlastHit, BlastProgram, BlastResult, Hsp } from '../../types/blast';
import { computeTotalQueryCoverage, extractAccession, extractOrganism } from '../bioUtils';

export function parseBlastXml(raw: string): BlastResult {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(raw, 'text/xml');

  // Check parser errors
  const parseError = xmlDoc.getElementsByTagName('parsererror');
  if (parseError.length > 0) {
    throw new Error('Erreur de parsing XML: Le fichier ne respecte pas la syntaxe XML valide.');
  }

  const blastOutput = xmlDoc.getElementsByTagName('BlastOutput')[0];
  if (!blastOutput) {
    throw new Error('Balise racine <BlastOutput> introuvable dans le document XML.');
  }

  const getTagText = (parent: Element | null, tagName: string): string => {
    if (!parent) return '';
    const el = parent.getElementsByTagName(tagName)[0];
    return el?.textContent?.trim() || '';
  };

  const rawProgram = getTagText(blastOutput, 'BlastOutput_program');
  const program: BlastProgram = (['BLASTN', 'BLASTP', 'BLASTX', 'TBLASTN', 'TBLASTX'].includes(rawProgram.toUpperCase())
    ? rawProgram.toUpperCase()
    : 'BLASTN') as BlastProgram;

  const version = getTagText(blastOutput, 'BlastOutput_version');
  const database = getTagText(blastOutput, 'BlastOutput_db');

  // Typically under BlastOutput_iterations > Iteration
  const iteration = xmlDoc.getElementsByTagName('Iteration')[0];
  
  const queryId = getTagText(iteration, 'Iteration_query-ID') || getTagText(blastOutput, 'BlastOutput_query-ID') || 'Query_1';
  const queryTitle = getTagText(iteration, 'Iteration_query-def') || getTagText(blastOutput, 'BlastOutput_query-def') || queryId;
  const rawQueryLen = getTagText(iteration, 'Iteration_query-len') || getTagText(blastOutput, 'BlastOutput_query-len');
  const queryLength = parseInt(rawQueryLen, 10) || 1000;

  const hitElements = xmlDoc.getElementsByTagName('Hit');
  const blastHits: BlastHit[] = [];

  for (let i = 0; i < hitElements.length; i++) {
    const hitEl = hitElements[i];
    const hitId = getTagText(hitEl, 'Hit_id') || `Hit_${i + 1}`;
    const hitDef = getTagText(hitEl, 'Hit_def') || hitId;
    const hitAcc = getTagText(hitEl, 'Hit_accession') || extractAccession(hitId, hitDef);
    const hitLen = parseInt(getTagText(hitEl, 'Hit_len'), 10) || 0;
    const organism = extractOrganism(hitDef, hitId);

    const hspElements = hitEl.getElementsByTagName('Hsp');
    const hsps: Hsp[] = [];

    for (let j = 0; j < hspElements.length; j++) {
      const hspEl = hspElements[j];
      const bitScore = parseFloat(getTagText(hspEl, 'Hsp_bit-score')) || 0;
      const score = parseInt(getTagText(hspEl, 'Hsp_score'), 10) || 0;
      const evalue = parseFloat(getTagText(hspEl, 'Hsp_evalue')) || 0;
      const queryFrom = parseInt(getTagText(hspEl, 'Hsp_query-from'), 10) || 1;
      const queryTo = parseInt(getTagText(hspEl, 'Hsp_query-to'), 10) || 1;
      const hitFrom = parseInt(getTagText(hspEl, 'Hsp_hit-from'), 10) || 1;
      const hitTo = parseInt(getTagText(hspEl, 'Hsp_hit-to'), 10) || 1;
      const identity = parseInt(getTagText(hspEl, 'Hsp_identity'), 10) || 0;
      const positiveStr = getTagText(hspEl, 'Hsp_positive');
      const positive = positiveStr ? parseInt(positiveStr, 10) : undefined;
      const gaps = parseInt(getTagText(hspEl, 'Hsp_gaps'), 10) || 0;
      const alignLen = parseInt(getTagText(hspEl, 'Hsp_align-len'), 10) || Math.abs(queryTo - queryFrom) + 1;

      const qseq = getTagText(hspEl, 'Hsp_qseq');
      const hseq = getTagText(hspEl, 'Hsp_hseq');
      const midline = getTagText(hspEl, 'Hsp_midline');

      const queryFrame = parseInt(getTagText(hspEl, 'Hsp_query-frame'), 10) || undefined;
      const hitFrame = parseInt(getTagText(hspEl, 'Hsp_hit-frame'), 10) || undefined;

      const pident = alignLen > 0 ? Math.round((identity / alignLen) * 1000) / 10 : 0;
      const qcov = queryLength > 0 ? Math.round(((Math.abs(queryTo - queryFrom) + 1) / queryLength) * 1000) / 10 : undefined;

      hsps.push({
        hspNum: j + 1,
        bitScore,
        score,
        evalue,
        queryFrom: Math.min(queryFrom, queryTo),
        queryTo: Math.max(queryFrom, queryTo),
        hitFrom: Math.min(hitFrom, hitTo),
        hitTo: Math.max(hitFrom, hitTo),
        queryFrame,
        hitFrame,
        identity,
        positive,
        gaps,
        alignLen,
        pident,
        qcov,
        qseq,
        hseq,
        midline,
        strand: (hitFrame && hitFrame < 0) || hitFrom > hitTo ? 'Plus/Minus' : 'Plus/Plus'
      });
    }

    if (hsps.length === 0) continue;

    hsps.sort((a, b) => b.bitScore - a.bitScore);
    const bestBitScore = Math.max(...hsps.map(h => h.bitScore));
    const bestEvalue = Math.min(...hsps.map(h => h.evalue));
    const bestPident = Math.max(...hsps.map(h => h.pident));
    const totalAlignLen = hsps.reduce((acc, h) => acc + h.alignLen, 0);
    const totalQueryCoverage = computeTotalQueryCoverage(hsps, queryLength);

    blastHits.push({
      num: i + 1,
      id: hitId,
      accession: hitAcc,
      title: hitDef,
      organism,
      len: hitLen,
      hsps,
      bestBitScore,
      bestEvalue,
      bestPident,
      totalQueryCoverage,
      totalAlignLen
    });
  }

  // Sort hits by best score
  blastHits.sort((a, b) => b.bestBitScore - a.bestBitScore || a.bestEvalue - b.bestEvalue);
  blastHits.forEach((h, i) => { h.num = i + 1; });

  return {
    program,
    version,
    queryId,
    queryTitle,
    queryLength,
    database,
    format: 'xml',
    hits: blastHits,
    stats: {
      hspCount: blastHits.reduce((acc, h) => acc + h.hsps.length, 0)
    }
  };
}
