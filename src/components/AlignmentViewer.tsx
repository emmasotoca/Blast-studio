import React, { useState } from 'react';
import { 
  Dna, 
  ExternalLink, 
  Copy, 
  Check, 
  Layers, 
  Maximize2, 
  Sparkles,
  Info
} from 'lucide-react';
import { BlastHit, BlastProgram, Hsp } from '../types/blast';
import { 
  formatEvalue, 
  getNcbiBitScoreColor, 
  getNcbiUrl,
  getAaColorClass,
  getNtColorClass
} from '../utils/bioUtils';

interface AlignmentViewerProps {
  hit: BlastHit;
  program: BlastProgram;
  queryTitle: string;
}

export const AlignmentViewer: React.FC<AlignmentViewerProps> = ({
  hit,
  program,
  queryTitle
}) => {
  const [activeHspIdx, setActiveHspIdx] = useState(0);
  const [colorMode, setColorMode] = useState<'match' | 'biochemical'>('match');
  const [chunkSize, setChunkSize] = useState<number>(60);
  const [copied, setCopied] = useState(false);

  const activeHsp: Hsp | undefined = hit.hsps[activeHspIdx] || hit.hsps[0];
  const isProtein = program === 'BLASTP' || program === 'BLASTX';
  const unit = isProtein ? 'aa' : 'pb';

  const bitScoreColor = activeHsp ? getNcbiBitScoreColor(activeHsp.bitScore) : '#ffffff';
  const ncbiUrl = getNcbiUrl(hit.accession, program);

  // Copy alignment text
  const handleCopy = () => {
    if (!activeHsp) return;
    const text = [
      `>Hit: ${hit.title}`,
      `Score = ${activeHsp.bitScore} bits, Expect = ${formatEvalue(activeHsp.evalue)}`,
      `Identities = ${activeHsp.identity}/${activeHsp.alignLen} (${activeHsp.pident}%), Gaps = ${activeHsp.gaps}/${activeHsp.alignLen}`,
      activeHsp.strand ? `Strand = ${activeHsp.strand}` : '',
      '',
      `Query  ${activeHsp.queryFrom}  ${activeHsp.qseq || ''}  ${activeHsp.queryTo}`,
      `       ${' '.repeat(String(activeHsp.queryFrom).length)}  ${activeHsp.midline || ''}`,
      `Sbjct  ${activeHsp.hitFrom}  ${activeHsp.hseq || ''}  ${activeHsp.hitTo}`
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Chunk sequences into blocks (e.g. 60 chars per line)
  const renderAlignmentBlocks = () => {
    if (!activeHsp || !activeHsp.qseq || !activeHsp.hseq) {
      return (
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 text-center text-xs text-slate-400">
          <p className="font-semibold text-slate-300 mb-1">
            Visualisation tabulaire des coordonnées
          </p>
          <p className="text-slate-400">
            Ce fichier BLAST (format tabulaire sans colonnes de séquences) contient les coordonnées d'alignement mais pas les chaînes complètes de résidus.
          </p>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto font-mono text-left bg-slate-900/60 p-4 rounded-lg border border-slate-800">
            <div>
              <span className="text-slate-500 block text-[10px]">Requête début</span>
              <span className="text-cyan-400 font-bold">{activeHsp.queryFrom}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Requête fin</span>
              <span className="text-cyan-400 font-bold">{activeHsp.queryTo}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Cible début</span>
              <span className="text-emerald-400 font-bold">{activeHsp.hitFrom}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Cible fin</span>
              <span className="text-emerald-400 font-bold">{activeHsp.hitTo}</span>
            </div>
          </div>
        </div>
      );
    }

    const qseq = activeHsp.qseq;
    const hseq = activeHsp.hseq;
    const midline = activeHsp.midline || qseq.split('').map((q, i) => q === hseq[i] ? '|' : ' ').join('');

    const totalLen = qseq.length;
    const blocks: React.ReactNode[] = [];

    let currentQPos = activeHsp.queryFrom;
    let currentHPos = activeHsp.hitFrom;

    for (let offset = 0; offset < totalLen; offset += chunkSize) {
      const qChunk = qseq.substring(offset, offset + chunkSize);
      const hChunk = hseq.substring(offset, offset + chunkSize);
      const mChunk = midline.substring(offset, offset + chunkSize);

      // Calculate coordinates excluding gap dashes '-'
      const qGaps = (qChunk.match(/-/g) || []).length;
      const hGaps = (hChunk.match(/-/g) || []).length;

      const qChunkStart = currentQPos;
      const qChunkEnd = currentQPos + qChunk.length - qGaps - 1;

      const hChunkStart = currentHPos;
      const hChunkEnd = currentHPos + hChunk.length - hGaps - 1;

      currentQPos = qChunkEnd + 1;
      currentHPos = hChunkEnd + 1;

      blocks.push(
        <div key={offset} className="mb-6 rounded-lg bg-slate-950/70 p-3.5 border border-slate-800/80 font-mono-seq text-xs">
          {/* Query line */}
          <div className="flex items-center text-slate-300">
            <span className="w-16 font-sans font-bold text-cyan-400 select-none">
              Query
            </span>
            <span className="w-16 text-right pr-3 text-slate-400 select-none font-mono">
              {qChunkStart}
            </span>
            <div className="flex-1 tracking-widest font-mono text-[13px] leading-relaxed break-all">
              {qChunk.split('').map((char, cIdx) => {
                const isMatch = mChunk[cIdx] === '|' || (!isProtein && char.toUpperCase() === hChunk[cIdx]?.toUpperCase());
                const isPositive = mChunk[cIdx] === '+';
                const isGap = char === '-';

                let colorStyle = 'text-slate-200';
                if (colorMode === 'biochemical') {
                  colorStyle = isProtein ? getAaColorClass(char) : getNtColorClass(char);
                } else {
                  if (isMatch) colorStyle = 'text-cyan-300 font-bold';
                  else if (isPositive) colorStyle = 'text-blue-300';
                  else if (isGap) colorStyle = 'text-slate-600';
                  else colorStyle = 'text-rose-400 font-bold';
                }

                return (
                  <span key={cIdx} className={`${colorStyle} inline-block px-[1px]`}>
                    {char}
                  </span>
                );
              })}
            </div>
            <span className="w-16 text-left pl-3 text-slate-400 select-none font-mono">
              {qChunkEnd}
            </span>
          </div>

          {/* Midline */}
          <div className="flex items-center my-0.5 text-slate-400 select-none">
            <span className="w-16 select-none" />
            <span className="w-16 pr-3 select-none" />
            <div className="flex-1 tracking-widest font-mono text-[13px] leading-none text-slate-400 select-none">
              {mChunk.split('').map((char, cIdx) => (
                <span 
                  key={cIdx} 
                  className={`inline-block px-[1px] ${
                    char === '|' ? 'text-cyan-400 font-bold' : 
                    char === '+' ? 'text-blue-400' : 'text-slate-700'
                  }`}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </div>
            <span className="w-16 pl-3 select-none" />
          </div>

          {/* Sbjct line */}
          <div className="flex items-center text-slate-300">
            <span className="w-16 font-sans font-bold text-emerald-400 select-none">
              Sbjct
            </span>
            <span className="w-16 text-right pr-3 text-slate-400 select-none font-mono">
              {hChunkStart}
            </span>
            <div className="flex-1 tracking-widest font-mono text-[13px] leading-relaxed break-all">
              {hChunk.split('').map((char, cIdx) => {
                const isMatch = mChunk[cIdx] === '|' || (!isProtein && char.toUpperCase() === qChunk[cIdx]?.toUpperCase());
                const isPositive = mChunk[cIdx] === '+';
                const isGap = char === '-';

                let colorStyle = 'text-slate-200';
                if (colorMode === 'biochemical') {
                  colorStyle = isProtein ? getAaColorClass(char) : getNtColorClass(char);
                } else {
                  if (isMatch) colorStyle = 'text-emerald-300 font-bold';
                  else if (isPositive) colorStyle = 'text-blue-300';
                  else if (isGap) colorStyle = 'text-slate-600';
                  else colorStyle = 'text-rose-400 font-bold';
                }

                return (
                  <span key={cIdx} className={`${colorStyle} inline-block px-[1px]`}>
                    {char}
                  </span>
                );
              })}
            </div>
            <span className="w-16 text-left pl-3 text-slate-400 select-none font-mono">
              {hChunkEnd}
            </span>
          </div>
        </div>
      );
    }

    return blocks;
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 shadow-lg shadow-black/20">
      {/* Header bar */}
      <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-cyan-950 px-2 py-0.5 font-mono text-xs font-bold text-cyan-400 ring-1 ring-cyan-800">
              Hit #{hit.num}
            </span>
            <span className="font-mono text-sm font-bold text-white">
              {hit.accession}
            </span>
            <a
              href={ncbiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded bg-slate-800 hover:bg-slate-700 px-2 py-0.5 text-xs text-cyan-300 transition"
              title="Consulter sur NCBI"
            >
              <span>NCBI</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <h3 className="font-heading text-sm font-semibold text-slate-200 max-w-3xl">
            {hit.title}
          </h3>
          {hit.organism && (
            <p className="text-xs text-slate-400 italic">
              {hit.organism}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 transition border border-slate-700"
            title="Copier l'alignement textuel"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copié !</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-400" />
                <span>Copier</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* HSP Tabs if multiple HSPs */}
      {hit.hsps.length > 1 && (
        <div className="my-3 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
            <Layers className="h-3.5 w-3.5" />
            HSPs ({hit.hsps.length}) :
          </span>
          {hit.hsps.map((h, idx) => (
            <button
              key={idx}
              onClick={() => setActiveHspIdx(idx)}
              className={`rounded-lg px-3 py-1 text-xs font-mono transition ${
                activeHspIdx === idx
                  ? 'bg-cyan-600 text-white font-bold shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              HSP #{idx + 1} ({Math.round(h.bitScore)}b, {h.pident}%)
            </button>
          ))}
        </div>
      )}

      {/* Statistics badges for active HSP */}
      {activeHsp && (
        <div className="my-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 rounded-xl bg-slate-950/80 p-3 border border-slate-800 font-mono text-xs">
          <div>
            <span className="text-slate-500 block text-[10px]">Score de Bit</span>
            <span className="font-bold text-sm" style={{ color: bitScoreColor }}>
              {activeHsp.bitScore} bits
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">E-value</span>
            <span className="font-bold text-emerald-400 text-sm">
              {formatEvalue(activeHsp.evalue)}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Identités</span>
            <span className="text-slate-200">
              {activeHsp.identity} / {activeHsp.alignLen} ({activeHsp.pident}%)
            </span>
          </div>
          {activeHsp.positive !== undefined && (
            <div>
              <span className="text-slate-500 block text-[10px]">Positifs / Similarités</span>
              <span className="text-blue-400">
                {activeHsp.positive} / {activeHsp.alignLen} ({Math.round((activeHsp.positive / activeHsp.alignLen) * 100)}%)
              </span>
            </div>
          )}
          <div>
            <span className="text-slate-500 block text-[10px]">Gaps</span>
            <span className="text-slate-300">
              {activeHsp.gaps} / {activeHsp.alignLen} ({activeHsp.alignLen > 0 ? Math.round((activeHsp.gaps / activeHsp.alignLen) * 100) : 0}%)
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Brin / Cadre</span>
            <span className="text-purple-400">
              {activeHsp.strand || (activeHsp.queryFrame ? `Cadre ${activeHsp.queryFrame}` : 'Plus/Plus')}
            </span>
          </div>
        </div>
      )}

      {/* Alignment Display Controls */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Mode de coloration :</span>
          <div className="flex items-center rounded-lg bg-slate-950 p-1 border border-slate-800">
            <button
              onClick={() => setColorMode('match')}
              className={`rounded px-2.5 py-1 transition ${
                colorMode === 'match'
                  ? 'bg-cyan-600 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Correspondance / Mismatch
            </button>
            <button
              onClick={() => setColorMode('biochemical')}
              className={`rounded px-2.5 py-1 transition ${
                colorMode === 'biochemical'
                  ? 'bg-cyan-600 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isProtein ? 'Propriétés Acides Aminés' : 'Bases Nucléotidiques (A, T, G, C)'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Résidus par bloc :</span>
          <div className="flex items-center rounded-lg bg-slate-950 p-1 border border-slate-800 font-mono">
            {[60, 80, 100].map((size) => (
              <button
                key={size}
                onClick={() => setChunkSize(size)}
                className={`rounded px-2 py-0.5 transition ${
                  chunkSize === size
                    ? 'bg-slate-800 text-cyan-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Visual Color Legend for biochemical mode */}
      {colorMode === 'biochemical' && (
        <div className="mb-3 flex flex-wrap items-center gap-3 rounded-lg bg-slate-950/60 px-3 py-1.5 border border-slate-800 text-[11px]">
          <span className="text-slate-400 font-medium">Légende physico-chimique :</span>
          {isProtein ? (
            <>
              <span className="text-emerald-400">● Hydrophobe (A, V, I, L, M, F, W, P)</span>
              <span className="text-cyan-400">● Polaire (S, T, N, Q, Y, C)</span>
              <span className="text-blue-400">● Basique (+) (K, R, H)</span>
              <span className="text-rose-400">● Acide (-) (D, E)</span>
            </>
          ) : (
            <>
              <span className="text-emerald-400">● A (Adénine)</span>
              <span className="text-rose-400">● T/U (Thymine/Uracile)</span>
              <span className="text-amber-400">● G (Guanine)</span>
              <span className="text-blue-400">● C (Cytosine)</span>
            </>
          )}
        </div>
      )}

      {/* Alignment Sequence Blocks */}
      <div className="overflow-x-auto rounded-xl bg-slate-950/50 p-3 border border-slate-800/80">
        {renderAlignmentBlocks()}
      </div>
    </div>
  );
};
