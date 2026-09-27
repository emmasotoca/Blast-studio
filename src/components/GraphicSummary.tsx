import React, { useState, useRef } from 'react';
import { Eye, Download, Info, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { BlastHit, BlastProgram } from '../types/blast';
import { formatEvalue, getNcbiBitScoreColor } from '../utils/bioUtils';

interface GraphicSummaryProps {
  hits: BlastHit[];
  queryLength: number;
  queryId: string;
  program: BlastProgram;
  selectedHitId: string | null;
  onSelectHit: (hit: BlastHit) => void;
}

export const GraphicSummary: React.FC<GraphicSummaryProps> = ({
  hits,
  queryLength,
  queryId,
  program,
  selectedHitId,
  onSelectHit
}) => {
  const [hoveredHit, setHoveredHit] = useState<{ hit: BlastHit; hspIdx: number; x: number; y: number } | null>(null);
  const [colorMode, setColorMode] = useState<'bitscore' | 'identity'>('bitscore');
  const svgRef = useRef<SVGSVGElement>(null);

  const unit = program === 'BLASTP' || program === 'BLASTX' ? 'aa' : 'pb';

  // SVG dimensions
  const svgWidth = 920;
  const paddingLeft = 50;
  const paddingRight = 40;
  const usableWidth = svgWidth - paddingLeft - paddingRight;

  const coordToX = (coord: number) => {
    if (!queryLength || queryLength <= 0) return paddingLeft;
    const ratio = Math.max(0, Math.min(1, coord / queryLength));
    return paddingLeft + ratio * usableWidth;
  };

  // Generate tick marks
  const tickCount = 10;
  const tickInterval = Math.ceil(queryLength / tickCount);
  const ticks: number[] = [];
  for (let c = 0; c <= queryLength; c += tickInterval) {
    ticks.push(c);
  }
  if (ticks[ticks.length - 1] < queryLength) {
    ticks.push(queryLength);
  }

  // Row packing for hits so they don't overlap awkwardly
  // or simple 1 row per hit up to max visible (e.g. top 50 hits)
  const displayHits = hits.slice(0, 45); // top 45 hits for clean visualization
  const barHeight = 7;
  const barSpacing = 4;
  const rulerHeight = 36;
  const totalSvgHeight = rulerHeight + displayHits.length * (barHeight + barSpacing) + 30;

  const getColor = (bitScore: number, pident: number) => {
    if (colorMode === 'identity') {
      if (pident >= 95) return '#10b981'; // Emerald 500
      if (pident >= 85) return '#06b6d4'; // Cyan 500
      if (pident >= 70) return '#3b82f6'; // Blue 500
      if (pident >= 50) return '#f59e0b'; // Amber 500
      return '#ef4444'; // Red 500
    }
    return getNcbiBitScoreColor(bitScore);
  };

  const handleDownloadSvg = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `blast_graphic_summary_${queryId}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 shadow-lg shadow-black/20">
      {/* Title & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-sm font-semibold text-white">
              Résumé Graphique des Alignements
            </h3>
            <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-cyan-300 font-mono">
              NCBI Graphic Summary
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Cartographie linéaire de la séquence requête avec projection des hits significatifs
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Color mode selector */}
          <div className="flex items-center rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setColorMode('bitscore')}
              className={`rounded-md px-2.5 py-1 transition ${
                colorMode === 'bitscore'
                  ? 'bg-cyan-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Score de Bit (NCBI)
            </button>
            <button
              onClick={() => setColorMode('identity')}
              className={`rounded-md px-2.5 py-1 transition ${
                colorMode === 'identity'
                  ? 'bg-cyan-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              % Identité
            </button>
          </div>

          <button
            onClick={handleDownloadSvg}
            className="flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 text-xs text-slate-200 transition border border-slate-700"
            title="Télécharger la vue vectorielle SVG haute résolution"
          >
            <Download className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Exporter SVG</span>
          </button>
        </div>
      </div>

      {/* NCBI Color legend bar */}
      <div className="my-3 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-950/80 px-3 py-2 border border-slate-800/80 text-xs">
        <span className="text-[11px] font-semibold text-slate-400">
          Code couleur :
        </span>
        {colorMode === 'bitscore' ? (
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-5 rounded-xs" style={{ backgroundColor: '#334155' }} />
              <span className="text-slate-300">&lt; 40 bits</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-5 rounded-xs" style={{ backgroundColor: '#2563eb' }} />
              <span className="text-slate-300">40 - 50</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-5 rounded-xs" style={{ backgroundColor: '#16a34a' }} />
              <span className="text-slate-300">50 - 80</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-5 rounded-xs" style={{ backgroundColor: '#c026d3' }} />
              <span className="text-slate-300">80 - 200</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-5 rounded-xs" style={{ backgroundColor: '#dc2626' }} />
              <span className="text-slate-300 font-bold">≥ 200 bits</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-5 rounded-xs bg-emerald-500" />
              <span className="text-slate-300">≥ 95%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-5 rounded-xs bg-cyan-500" />
              <span className="text-slate-300">85 - 94%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-5 rounded-xs bg-blue-500" />
              <span className="text-slate-300">70 - 84%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-5 rounded-xs bg-amber-500" />
              <span className="text-slate-300">50 - 69%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-5 rounded-xs bg-rose-500" />
              <span className="text-slate-300">&lt; 50%</span>
            </div>
          </div>
        )}
      </div>

      {/* SVG Canvas Container */}
      <div className="relative overflow-x-auto rounded-xl bg-slate-950 p-2 border border-slate-800/80">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgWidth} ${Math.max(160, totalSvgHeight)}`}
          className="w-full h-auto min-w-[700px] select-none"
        >
          {/* Background styling for SVG export */}
          <rect width={svgWidth} height={Math.max(160, totalSvgHeight)} fill="#090d16" />

          {/* Query Bar */}
          <g>
            {/* Query background track */}
            <rect
              x={paddingLeft}
              y={10}
              width={usableWidth}
              height={14}
              rx={3}
              fill="#1e293b"
              stroke="#334155"
              strokeWidth={1}
            />
            {/* Query label */}
            <text
              x={paddingLeft - 8}
              y={21}
              fill="#94a3b8"
              fontSize={10}
              fontFamily="Space Grotesk, sans-serif"
              fontWeight="600"
              textAnchor="end"
            >
              Requête
            </text>

            {/* Graduated scale ticks and labels */}
            {ticks.map((tickVal, i) => {
              const xPos = coordToX(tickVal);
              return (
                <g key={i}>
                  <line
                    x1={xPos}
                    y1={24}
                    x2={xPos}
                    y2={30}
                    stroke="#475569"
                    strokeWidth={1}
                  />
                  <text
                    x={xPos}
                    y={39}
                    fill="#64748b"
                    fontSize={9}
                    fontFamily="JetBrains Mono, monospace"
                    textAnchor={i === 0 ? 'start' : i === ticks.length - 1 ? 'end' : 'middle'}
                  >
                    {tickVal} {i === ticks.length - 1 ? unit : ''}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Alignment Bars for each Hit */}
          <g transform={`translate(0, ${rulerHeight + 8})`}>
            {displayHits.map((hit, index) => {
              const yPos = index * (barHeight + barSpacing);
              const isSelected = selectedHitId === hit.id;

              return (
                <g
                  key={hit.id}
                  onClick={() => onSelectHit(hit)}
                  className="cursor-pointer group"
                >
                  {/* Hit index label */}
                  <text
                    x={paddingLeft - 8}
                    y={yPos + barHeight - 1}
                    fill={isSelected ? '#38bdf8' : '#475569'}
                    fontSize={9}
                    fontFamily="JetBrains Mono, monospace"
                    textAnchor="end"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                  >
                    #{hit.num}
                  </text>

                  {/* Hit background guide line on hover/select */}
                  <rect
                    x={paddingLeft}
                    y={yPos}
                    width={usableWidth}
                    height={barHeight}
                    fill={isSelected ? 'rgba(56, 189, 248, 0.15)' : 'transparent'}
                    rx={2}
                    className="group-hover:fill-slate-800/40 transition"
                  />

                  {/* Draw each HSP segment for this hit */}
                  {hit.hsps.map((hsp, hIdx) => {
                    const startX = coordToX(hsp.queryFrom);
                    const endX = coordToX(hsp.queryTo);
                    const w = Math.max(3, endX - startX);
                    const barColor = getColor(hsp.bitScore, hsp.pident);

                    return (
                      <rect
                        key={hIdx}
                        x={startX}
                        y={yPos}
                        width={w}
                        height={barHeight}
                        rx={2}
                        fill={barColor}
                        stroke={isSelected ? '#ffffff' : 'none'}
                        strokeWidth={isSelected ? 1 : 0}
                        opacity={hoveredHit && hoveredHit.hit.id !== hit.id ? 0.45 : 1}
                        className="transition-all hover:brightness-125"
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHoveredHit({
                            hit,
                            hspIdx: hIdx,
                            x: rect.x + rect.width / 2,
                            y: rect.y
                          });
                        }}
                        onMouseLeave={() => setHoveredHit(null)}
                      />
                    );
                  })}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredHit && (
          <div
            className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full mb-3 rounded-xl border border-slate-700 bg-slate-900/95 p-3 text-xs text-white shadow-2xl backdrop-blur-md max-w-sm"
            style={{
              left: `${hoveredHit.x}px`,
              top: `${hoveredHit.y - 8}px`
            }}
          >
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-1.5">
              <span className="font-mono font-bold text-cyan-400">
                Hit #{hoveredHit.hit.num} : {hoveredHit.hit.accession}
              </span>
              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300 font-mono">
                {hoveredHit.hit.hsps[hoveredHit.hspIdx].alignLen} {unit}
              </span>
            </div>

            <p className="text-[11px] text-slate-300 font-medium line-clamp-2 mb-2">
              {hoveredHit.hit.title}
            </p>

            <div className="grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[11px]">
              <div>
                <span className="text-slate-500">Score de Bit : </span>
                <span className="font-bold text-amber-400">
                  {hoveredHit.hit.hsps[hoveredHit.hspIdx].bitScore} bits
                </span>
              </div>
              <div>
                <span className="text-slate-500">E-value : </span>
                <span className="font-bold text-emerald-400">
                  {formatEvalue(hoveredHit.hit.hsps[hoveredHit.hspIdx].evalue)}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Identité : </span>
                <span className="font-bold text-cyan-400">
                  {hoveredHit.hit.hsps[hoveredHit.hspIdx].pident}%
                </span>
              </div>
              <div>
                <span className="text-slate-500">Requête : </span>
                <span className="text-slate-300">
                  [{hoveredHit.hit.hsps[hoveredHit.hspIdx].queryFrom} - {hoveredHit.hit.hsps[hoveredHit.hspIdx].queryTo}]
                </span>
              </div>
            </div>

            <div className="mt-2 text-[10px] text-slate-400 italic">
              Cliquez pour afficher le détail de l'alignement
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 text-right text-[11px] text-slate-400">
        Affichage des {displayHits.length} meilleurs hits • Cliquez sur une barre d'alignement pour inspecter le pairwise
      </div>
    </div>
  );
};
