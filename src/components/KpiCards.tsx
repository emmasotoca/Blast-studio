import React from 'react';
import { Target, Award, Percent, Layers, Zap } from 'lucide-react';
import { BlastHit } from '../types/blast';
import { formatEvalue, getNcbiBitScoreColor } from '../utils/bioUtils';

interface KpiCardsProps {
  totalHits: number;
  filteredHits: BlastHit[];
  queryLength: number;
  unit: string;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  totalHits,
  filteredHits,
  queryLength,
  unit
}) => {
  const count = filteredHits.length;

  const bestEvalue = count > 0 
    ? Math.min(...filteredHits.map(h => h.bestEvalue)) 
    : 0;

  const bestBitScore = count > 0 
    ? Math.max(...filteredHits.map(h => h.bestBitScore)) 
    : 0;

  const avgIdentity = count > 0 
    ? Math.round((filteredHits.reduce((acc, h) => acc + h.bestPident, 0) / count) * 10) / 10 
    : 0;

  const avgCoverage = count > 0 
    ? Math.round((filteredHits.reduce((acc, h) => acc + h.totalQueryCoverage, 0) / count) * 10) / 10 
    : 0;

  const bestBitScoreColor = getNcbiBitScoreColor(bestBitScore);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {/* 1. Hits Retenus */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-sm shadow-sm hover:border-slate-700 transition">
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="text-xs font-medium">Hits Significatifs</span>
          <Target className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-heading text-xl font-bold text-white tracking-tight">
            {count}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            / {totalHits}
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400">
          {totalHits > 0 ? ((count / totalHits) * 100).toFixed(0) : 0}% du total détecté
        </div>
      </div>

      {/* 2. Meilleure E-value */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-sm shadow-sm hover:border-slate-700 transition">
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="text-xs font-medium">Meilleure E-value</span>
          <Award className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="flex items-baseline">
          <span className="font-mono text-xl font-bold text-emerald-400 tracking-tight">
            {count > 0 ? formatEvalue(bestEvalue) : '-'}
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400">
          {bestEvalue === 0 ? 'Signification statistique absolue' : 'Homologie hautement significative'}
        </div>
      </div>

      {/* 3. Identité Moyenne */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-sm shadow-sm hover:border-slate-700 transition">
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="text-xs font-medium">Identité Moyenne</span>
          <Percent className="h-4 w-4 text-blue-400" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-heading text-xl font-bold text-blue-400 tracking-tight">
            {count > 0 ? `${avgIdentity}%` : '-'}
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400">
          Moyenne des HSPs retenus
        </div>
      </div>

      {/* 4. Couverture Moyenne */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-sm shadow-sm hover:border-slate-700 transition">
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="text-xs font-medium">Couverture Moyenne</span>
          <Layers className="h-4 w-4 text-purple-400" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-heading text-xl font-bold text-purple-400 tracking-tight">
            {count > 0 ? `${avgCoverage}%` : '-'}
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400">
          Sur {queryLength} {unit} de requête
        </div>
      </div>

      {/* 5. Meilleur Bit Score */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-sm shadow-sm hover:border-slate-700 transition col-span-2 sm:col-span-1">
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="text-xs font-medium">Meilleur Bit Score</span>
          <Zap className="h-4 w-4 text-amber-400" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span 
            className="font-heading text-xl font-bold tracking-tight"
            style={{ color: count > 0 ? bestBitScoreColor : undefined }}
          >
            {count > 0 ? Math.round(bestBitScore) : '-'}
          </span>
          <span className="text-xs text-slate-400 font-mono">bits</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: bestBitScoreColor }} />
          <span>Palier NCBI ≥ 200 bits</span>
        </div>
      </div>
    </div>
  );
};
