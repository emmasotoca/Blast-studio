export type BlastProgram = 'BLASTN' | 'BLASTP' | 'BLASTX' | 'TBLASTN' | 'TBLASTX';

export type BlastFormat = 
  | 'tabular_outfmt6' 
  | 'tabular_outfmt7' 
  | 'xml' 
  | 'json' 
  | 'pairwise_outfmt0';

export interface Hsp {
  hspNum: number;
  bitScore: number;
  score: number;
  evalue: number;
  queryFrom: number;
  queryTo: number;
  hitFrom: number;
  hitTo: number;
  queryFrame?: number;
  hitFrame?: number;
  identity: number;
  positive?: number;
  gaps: number;
  alignLen: number;
  pident: number; // percentage (0-100)
  qcov?: number; // query coverage percentage (0-100)
  qseq?: string; // query aligned sequence
  hseq?: string; // hit aligned sequence
  midline?: string; // midline match symbols
  strand?: string; // Plus/Plus, etc.
}

export interface BlastHit {
  num: number;
  id: string;
  accession: string;
  title: string;
  organism?: string;
  len: number;
  hsps: Hsp[];
  
  // Aggregate best values for quick filtering and sorting
  bestBitScore: number;
  bestEvalue: number;
  bestPident: number;
  totalQueryCoverage: number;
  totalAlignLen: number;
}

export interface BlastResult {
  program: BlastProgram;
  version?: string;
  queryId: string;
  queryTitle: string;
  queryLength: number;
  database?: string;
  format: BlastFormat;
  hits: BlastHit[];
  stats?: {
    dbNum?: number;
    dbLen?: number;
    hspCount?: number;
    date?: string;
  };
}

export interface FilterCriteria {
  maxEvalue: number;
  minIdentity: number;
  minBitScore: number;
  minCoverage: number;
  minAlignLength: number;
  deduplicateByTarget: boolean;
  searchQuery: string;
}
