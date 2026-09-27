import { BlastFormat, BlastResult } from '../../types/blast';
import { parseBlastJson } from './jsonParser';
import { parseBlastPairwise } from './pairwiseParser';
import { parseBlastTabular } from './tabularParser';
import { parseBlastXml } from './xmlParser';

export function detectBlastFormat(raw: string): BlastFormat {
  const trimmed = raw.trim();

  // XML check
  if (trimmed.startsWith('<?xml') || trimmed.includes('<BlastOutput>') || trimmed.includes('<BlastOutput_program>')) {
    return 'xml';
  }

  // JSON check
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed.BlastOutput2 || parsed.results || (parsed.hits && Array.isArray(parsed.hits))) {
        return 'json';
      }
    } catch {
      // not JSON
    }
  }

  // Tabular outfmt 7 with comments
  if (trimmed.includes('# BLAST') || trimmed.includes('# Fields:')) {
    return 'tabular_outfmt7';
  }

  // Classic Pairwise outfmt 0 check
  if (
    /^(BLAST[NPX]|TBLAST[NX])/im.test(trimmed) || 
    (trimmed.includes('Query=') && (trimmed.includes('Score =') || trimmed.includes('Sequences producing significant alignments'))) ||
    (trimmed.includes('Score =') && trimmed.includes('Expect =') && trimmed.includes('Query  '))
  ) {
    return 'pairwise_outfmt0';
  }

  // Default to tabular outfmt 6 if line has >= 10 columns
  const firstNonEmpty = trimmed.split('\n').find(l => !l.startsWith('#') && l.trim().length > 0);
  if (firstNonEmpty) {
    const tabs = firstNonEmpty.split('\t');
    if (tabs.length >= 10) {
      return 'tabular_outfmt6';
    }
  }

  // Fallback to tabular outfmt 6
  return 'tabular_outfmt6';
}

export function parseBlastOutput(raw: string): BlastResult {
  const format = detectBlastFormat(raw);

  switch (format) {
    case 'xml':
      return parseBlastXml(raw);
    case 'json':
      return parseBlastJson(raw);
    case 'pairwise_outfmt0':
      return parseBlastPairwise(raw);
    case 'tabular_outfmt7':
    case 'tabular_outfmt6':
    default:
      return parseBlastTabular(raw);
  }
}
