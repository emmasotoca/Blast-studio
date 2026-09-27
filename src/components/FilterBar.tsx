import React, { useState } from 'react';
import { Filter, Search, RotateCcw, Check, Sparkles, HelpCircle } from 'lucide-react';
import { FilterCriteria } from '../types/blast';
import { formatEvalue } from '../utils/bioUtils';

interface FilterBarProps {
  criteria: FilterCriteria;
  onChange: (criteria: FilterCriteria) => void;
  totalHits: number;
  filteredHits: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  criteria,
  onChange,
  totalHits,
  filteredHits
}) => {
  const [evalueInput, setEvalueInput] = useState<string>(
    criteria.maxEvalue === 1 ? '1.0' : criteria.maxEvalue.toExponential(0)
  );

  const handleEvalueInputChange = (val: string) => {
    setEvalueInput(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed >= 0) {
      onChange({ ...criteria, maxEvalue: parsed });
    }
  };

  const handleResetFilters = () => {
    setEvalueInput('10');
    onChange({
      maxEvalue: 10,
      minIdentity: 0,
      minBitScore: 0,
      minCoverage: 0,
      minAlignLength: 0,
      deduplicateByTarget: false,
      searchQuery: ''
    });
  };

  const isFiltered = 
    criteria.maxEvalue < 10 || 
    criteria.minIdentity > 0 || 
    criteria.minBitScore > 0 || 
    criteria.minCoverage > 0 || 
    criteria.minAlignLength > 0 || 
    criteria.deduplicateByTarget || 
    criteria.searchQuery.trim().length > 0;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 shadow-lg shadow-black/20">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-950 text-cyan-400 ring-1 ring-cyan-800">
            <Filter className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-heading text-sm font-semibold text-white">
              Filtres Intelligents
            </h3>
            <p className="text-[11px] text-slate-400">
              Extraction en temps réel des hits et HSPs statistiquement significatifs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-slate-950 px-3 py-1 text-xs font-mono border border-slate-800">
            <span className="font-bold text-cyan-400">{filteredHits}</span>
            <span className="text-slate-500"> / </span>
            <span className="text-slate-300">{totalHits}</span>
            <span className="ml-1 text-slate-400">hits retenus</span>
            <span className="ml-1.5 rounded bg-cyan-950/80 px-1 py-0.5 text-[10px] text-cyan-300 font-sans font-medium">
              {totalHits > 0 ? Math.round((filteredHits / totalHits) * 100) : 0}%
            </span>
          </div>

          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-xs text-slate-300 transition"
              title="Réinitialiser tous les filtres"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Réinitialiser</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter grid */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* E-value filter */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-medium text-slate-300 flex items-center gap-1">
              <span>E-value max</span>
              <span className="text-[10px] text-slate-400">(seuil d'attente)</span>
            </label>
            <span className="font-mono text-cyan-400 font-semibold text-[11px]">
              ≤ {formatEvalue(criteria.maxEvalue)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="-100"
              max="1"
              step="1"
              value={criteria.maxEvalue <= 0 ? -100 : Math.log10(criteria.maxEvalue)}
              onChange={(e) => {
                const logVal = parseFloat(e.target.value);
                const actualVal = Math.pow(10, logVal);
                onChange({ ...criteria, maxEvalue: actualVal });
                setEvalueInput(actualVal.toExponential(0));
              }}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-cyan-400"
            />
            <input
              type="text"
              value={evalueInput}
              onChange={(e) => handleEvalueInputChange(e.target.value)}
              placeholder="ex: 1e-5"
              className="w-20 rounded bg-slate-950 px-2 py-1 font-mono text-xs text-cyan-300 border border-slate-800 focus:border-cyan-500 focus:outline-none text-right"
              title="Saisissez une valeur scientifique, ex: 1e-5, 1e-20"
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <button 
              onClick={() => { onChange({ ...criteria, maxEvalue: 1e-50 }); setEvalueInput('1e-50'); }}
              className="hover:text-cyan-400 transition"
            >
              1e-50
            </button>
            <button 
              onClick={() => { onChange({ ...criteria, maxEvalue: 1e-20 }); setEvalueInput('1e-20'); }}
              className="hover:text-cyan-400 transition"
            >
              1e-20
            </button>
            <button 
              onClick={() => { onChange({ ...criteria, maxEvalue: 1e-5 }); setEvalueInput('1e-5'); }}
              className="hover:text-cyan-400 transition"
            >
              1e-5
            </button>
            <button 
              onClick={() => { onChange({ ...criteria, maxEvalue: 0.01 }); setEvalueInput('0.01'); }}
              className="hover:text-cyan-400 transition"
            >
              0.01
            </button>
          </div>
        </div>

        {/* Identity % */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-medium text-slate-300">
              Identité min (%)
            </label>
            <span className="font-mono text-cyan-400 font-semibold text-[11px]">
              ≥ {criteria.minIdentity}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={criteria.minIdentity}
            onChange={(e) => onChange({ ...criteria, minIdentity: parseFloat(e.target.value) })}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0%</span>
            <span>50%</span>
            <span>70%</span>
            <span>90%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Min Bit Score */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-medium text-slate-300">
              Score de Bit min
            </label>
            <span className="font-mono text-cyan-400 font-semibold text-[11px]">
              ≥ {criteria.minBitScore} bits
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1500"
            step="20"
            value={criteria.minBitScore}
            onChange={(e) => onChange({ ...criteria, minBitScore: parseInt(e.target.value, 10) })}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0</span>
            <span>200</span>
            <span>500</span>
            <span>1000+</span>
          </div>
        </div>

        {/* Query Coverage % */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-medium text-slate-300">
              Couverture Requête min (%)
            </label>
            <span className="font-mono text-cyan-400 font-semibold text-[11px]">
              ≥ {criteria.minCoverage}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={criteria.minCoverage}
            onChange={(e) => onChange({ ...criteria, minCoverage: parseFloat(e.target.value) })}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Secondary filter bar: Search + Deduplication */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={criteria.searchQuery}
            onChange={(e) => onChange({ ...criteria, searchQuery: e.target.value })}
            placeholder="Rechercher par organisme, taxon, accession, mot-clé (ex: Escherichia, Kinase, P00533)..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-9 pr-8 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
          {criteria.searchQuery && (
            <button
              onClick={() => onChange({ ...criteria, searchQuery: '' })}
              className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-200"
            >
              ×
            </button>
          )}
        </div>

        {/* Deduplicate checkbox */}
        <label className="flex items-center gap-2 cursor-pointer select-none rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-1.5 text-xs text-slate-300 hover:border-slate-700 transition">
          <input
            type="checkbox"
            checked={criteria.deduplicateByTarget}
            onChange={(e) => onChange({ ...criteria, deduplicateByTarget: e.target.checked })}
            className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 cursor-pointer"
          />
          <span className="text-slate-300">Dédoublonner par cible (garder meilleur HSP)</span>
        </label>
      </div>
    </div>
  );
};
