import { BlastProgram } from '../types/blast';

export function extractAccession(rawId: string, title?: string): string {
  if (!rawId) return 'UNKNOWN';

  // Common FASTA / NCBI headers:
  // gi|123456|gb|AE005174.1|
  // ref|NC_000913.3|
  // sp|P00533|EGFR_HUMAN
  const parts = rawId.split('|');
  if (parts.length >= 4) {
    return parts[3].trim() || parts[1].trim() || rawId;
  }
  if (parts.length >= 2) {
    return parts[1].trim() || rawId;
  }

  // Look for accession-like tokens e.g. NR_123456.1, NC_000913.3, P00533, AE005174.1
  const accessionMatch = rawId.match(/([A-Z]{1,4}_?[0-9]{5,8}(\.[0-9]+)?|[A-Z][0-9]{5}(\.[0-9]+)?|[OPQ][0-9][A-Z0-9]{3}[0-9])/i);
  if (accessionMatch) {
    return accessionMatch[1];
  }

  // Fallback to first non-empty word in rawId
  return rawId.split(/\s+/)[0] || rawId;
}

export function extractOrganism(title: string, rawId: string): string {
  if (!title && !rawId) return 'Inconnu';
  const fullText = `${title || ''} ${rawId || ''}`;

  // 1. Check brackets standard NCBI [Genus species subsp. xxx]
  const bracketMatch = fullText.match(/\[([A-Z][a-z]+ [a-z0-9\.\-\s]+)\]/);
  if (bracketMatch && bracketMatch[1].length < 60) {
    return bracketMatch[1].trim();
  }

  // 2. Check UniProt OS=Genus species
  const osMatch = fullText.match(/OS=([^=]+?)(?=\s+[A-Z]{2}=|$)/);
  if (osMatch && osMatch[1].trim()) {
    return osMatch[1].trim();
  }

  // 3. Check parentheses (Genus species)
  const parenMatch = fullText.match(/\(([A-Z][a-z]+ [a-z0-9\.\-\s]+)\)/);
  if (parenMatch && parenMatch[1].length < 60 && !parenMatch[1].includes('Score')) {
    return parenMatch[1].trim();
  }

  // 4. Try to pick first 2 capitalized Latin words after accession
  const words = (title || rawId).replace(/^[^\s]+\s+/, '').split(/\s+/);
  if (words.length >= 2 && /^[A-Z][a-z]+$/.test(words[0]) && /^[a-z]+$/.test(words[1])) {
    return `${words[0]} ${words[1]}`;
  }

  return 'Organisme non spécifié';
}

export function formatEvalue(val: number): string {
  if (val === 0) return '0.0';
  if (val < 1e-4 || val > 1e4) {
    return val.toExponential(2).replace('e+', 'e');
  }
  return val.toFixed(4);
}

export function getNcbiBitScoreColor(bitScore: number): string {
  if (bitScore < 40) return '#334155'; // Slate 700 (Noir / gris foncé NCBI)
  if (bitScore < 50) return '#2563eb'; // Bleu NCBI
  if (bitScore < 80) return '#16a34a'; // Vert NCBI
  if (bitScore < 200) return '#c026d3'; // Magenta NCBI
  return '#dc2626'; // Rouge NCBI (>= 200)
}

export function getNcbiBitScoreCategory(bitScore: number): { label: string; color: string; bg: string } {
  if (bitScore < 40) return { label: '< 40 bits', color: '#64748b', bg: 'bg-slate-700' };
  if (bitScore < 50) return { label: '40 - 50 bits', color: '#2563eb', bg: 'bg-blue-600' };
  if (bitScore < 80) return { label: '50 - 80 bits', color: '#16a34a', bg: 'bg-green-600' };
  if (bitScore < 200) return { label: '80 - 200 bits', color: '#c026d3', bg: 'bg-fuchsia-600' };
  return { label: '≥ 200 bits', color: '#dc2626', bg: 'bg-red-600' };
}

export function getNcbiUrl(accession: string, program: BlastProgram): string {
  const isProtein = program === 'BLASTP' || program === 'BLASTX';
  const cleanAcc = accession.replace(/^gi\|\d+\|/i, '').replace(/\|.*/, '');
  if (isProtein) {
    return `https://www.ncbi.nlm.nih.gov/protein/${encodeURIComponent(cleanAcc)}`;
  }
  return `https://www.ncbi.nlm.nih.gov/nuccore/${encodeURIComponent(cleanAcc)}`;
}

// Amino acid physicochemical properties
export type AaCategory = 'hydrophobic' | 'polar' | 'basic' | 'acidic' | 'special' | 'gap';

export function getAminoAcidCategory(char: string): AaCategory {
  const c = char.toUpperCase();
  if (c === '-' || c === '.') return 'gap';
  // Aliphatic & Aromatic (Hydrophobic)
  if ('AVILMFWP'.includes(c)) return 'hydrophobic';
  // Polar uncharged
  if ('STNQYC'.includes(c)) return 'polar';
  // Basic (+)
  if ('KRH'.includes(c)) return 'basic';
  // Acidic (-)
  if ('DE'.includes(c)) return 'acidic';
  return 'special';
}

export function getAaColorClass(char: string): string {
  const cat = getAminoAcidCategory(char);
  switch (cat) {
    case 'hydrophobic':
      return 'text-emerald-400 bg-emerald-950/40 font-semibold';
    case 'polar':
      return 'text-cyan-400 bg-cyan-950/40';
    case 'basic':
      return 'text-blue-400 bg-blue-950/40 font-semibold';
    case 'acidic':
      return 'text-rose-400 bg-rose-950/40 font-semibold';
    case 'gap':
      return 'text-slate-500 font-normal';
    default:
      return 'text-amber-400 bg-amber-950/40';
  }
}

// Nucleotide color classification
export function getNtColorClass(char: string): string {
  const c = char.toUpperCase();
  switch (c) {
    case 'A':
      return 'text-emerald-400 bg-emerald-950/30';
    case 'T':
    case 'U':
      return 'text-rose-400 bg-rose-950/30';
    case 'G':
      return 'text-amber-400 bg-amber-950/30';
    case 'C':
      return 'text-blue-400 bg-blue-950/30';
    case '-':
    case '.':
      return 'text-slate-600';
    default:
      return 'text-purple-400 bg-purple-950/30';
  }
}

// Compute union query coverage from multiple HSPs
export function computeTotalQueryCoverage(hsps: { queryFrom: number; queryTo: number }[], queryLength: number): number {
  if (!queryLength || queryLength <= 0 || hsps.length === 0) return 0;
  
  // Sort intervals by start
  const intervals = hsps.map(h => [Math.min(h.queryFrom, h.queryTo), Math.max(h.queryFrom, h.queryTo)]).sort((a, b) => a[0] - b[0]);
  
  // Merge intervals
  const merged: [number, number][] = [];
  for (const interval of intervals) {
    if (merged.length === 0) {
      merged.push([interval[0], interval[1]]);
    } else {
      const last = merged[merged.length - 1];
      if (interval[0] <= last[1]) {
        last[1] = Math.max(last[1], interval[1]);
      } else {
        merged.push([interval[0], interval[1]]);
      }
    }
  }

  // Sum lengths
  const totalBps = merged.reduce((acc, [start, end]) => acc + (end - start + 1), 0);
  return Math.min(100, Math.round((totalBps / queryLength) * 1000) / 10);
}
