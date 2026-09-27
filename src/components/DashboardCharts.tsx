import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  CartesianGrid
} from 'recharts';
import { BarChart3, ScatterChart as ScatterIcon, PieChart as PieIcon } from 'lucide-react';
import { BlastHit } from '../types/blast';
import { getNcbiBitScoreColor, formatEvalue } from '../utils/bioUtils';

interface DashboardChartsProps {
  hits: BlastHit[];
  onSelectHit?: (hit: BlastHit) => void;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ hits, onSelectHit }) => {
  if (hits.length === 0) return null;

  // 1. E-value distribution bins
  const evalueBins = [
    { name: '< 1e-100', count: 0, color: '#10b981' },
    { name: '1e-100 à 1e-50', count: 0, color: '#06b6d4' },
    { name: '1e-50 à 1e-20', count: 0, color: '#3b82f6' },
    { name: '1e-20 à 1e-10', count: 0, color: '#8b5cf6' },
    { name: '1e-10 à 1e-5', count: 0, color: '#f59e0b' },
    { name: '1e-5 à 0.01', count: 0, color: '#f97316' },
    { name: '> 0.01', count: 0, color: '#ef4444' },
  ];

  hits.forEach(hit => {
    const ev = hit.bestEvalue;
    if (ev <= 1e-100) evalueBins[0].count++;
    else if (ev <= 1e-50) evalueBins[1].count++;
    else if (ev <= 1e-20) evalueBins[2].count++;
    else if (ev <= 1e-10) evalueBins[3].count++;
    else if (ev <= 1e-5) evalueBins[4].count++;
    else if (ev <= 0.01) evalueBins[5].count++;
    else evalueBins[6].count++;
  });

  // 2. Scatter plot data: % Identity vs Bit Score
  const scatterData = hits.map(hit => ({
    x: hit.bestBitScore,
    y: hit.bestPident,
    z: hit.totalAlignLen,
    id: hit.id,
    accession: hit.accession,
    title: hit.title,
    evalue: hit.bestEvalue,
    organism: hit.organism,
    rawHit: hit
  }));

  // 3. Taxonomic / Organism distribution (Top 8 species)
  const organismMap = new Map<string, number>();
  hits.forEach(hit => {
    const org = hit.organism || 'Inconnu';
    organismMap.set(org, (organismMap.get(org) || 0) + 1);
  });

  const sortedOrganisms = Array.from(organismMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const organismPalette = [
    '#38bdf8', '#34d399', '#818cf8', '#f472b6', 
    '#fbbf24', '#a78bfa', '#2dd4bf', '#fb923c'
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Chart 1: E-value distribution */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg shadow-black/20 flex flex-col">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800">
          <BarChart3 className="h-4 w-4 text-cyan-400" />
          <h4 className="font-heading text-xs font-semibold text-white">
            Distribution des E-values
          </h4>
        </div>
        <p className="text-[11px] text-slate-400 mb-3">
          Répartition des hits par intervalles de significativité statistique
        </p>
        <div className="h-56 w-full mt-auto">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={evalueBins} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#64748b" 
                fontSize={9} 
                angle={-35} 
                textAnchor="end" 
                interval={0}
              />
              <YAxis stroke="#64748b" fontSize={10} allowDecimals={false} />
              <RechartsTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs shadow-xl font-mono">
                        <div className="text-cyan-400 font-bold">{data.name}</div>
                        <div className="text-slate-200 mt-1">Hits : <span className="font-bold">{data.count}</span></div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {evalueBins.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Scatter Plot (% Identity vs Bit Score) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg shadow-black/20 flex flex-col">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800">
          <ScatterIcon className="h-4 w-4 text-emerald-400" />
          <h4 className="font-heading text-xs font-semibold text-white">
            % Identité vs Score de Bit
          </h4>
        </div>
        <p className="text-[11px] text-slate-400 mb-3">
          Taille des points proportionnelle à la longueur d'alignement
        </p>
        <div className="h-56 w-full mt-auto">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, left: -15, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Score de Bit" 
                stroke="#64748b" 
                fontSize={10}
                unit="b"
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="% Identité" 
                stroke="#64748b" 
                fontSize={10}
                domain={[0, 100]}
                unit="%"
              />
              <ZAxis type="number" dataKey="z" range={[50, 400]} name="Longueur" />
              <RechartsTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="rounded-lg border border-slate-700 bg-slate-900/95 p-2.5 text-xs shadow-xl backdrop-blur-sm max-w-xs font-mono">
                        <div className="font-bold text-cyan-400 truncate">{d.accession}</div>
                        <div className="text-[11px] text-slate-300 font-sans truncate mb-1">{d.title}</div>
                        <div className="text-slate-400 text-[11px]">Score : <span className="text-amber-400 font-bold">{d.x} bits</span></div>
                        <div className="text-slate-400 text-[11px]">Identité : <span className="text-cyan-400 font-bold">{d.y}%</span></div>
                        <div className="text-slate-400 text-[11px]">Longueur : <span className="text-slate-200">{d.z}</span></div>
                        <div className="text-slate-400 text-[11px]">E-value : <span className="text-emerald-400 font-bold">{formatEvalue(d.evalue)}</span></div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter
                name="Hits"
                data={scatterData}
                fill="#38bdf8"
                onClick={(e: any) => e?.rawHit && onSelectHit && onSelectHit(e.rawHit)}
                className="cursor-pointer"
              >
                {scatterData.map((entry, index) => (
                  <Cell 
                    key={`scatter-cell-${index}`} 
                    fill={getNcbiBitScoreColor(entry.x)}
                    opacity={0.8}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Taxonomic / Species distribution */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg shadow-black/20 flex flex-col">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800">
          <PieIcon className="h-4 w-4 text-purple-400" />
          <h4 className="font-heading text-xs font-semibold text-white">
            Répartition par Organisme / Espèce
          </h4>
        </div>
        <p className="text-[11px] text-slate-400 mb-3">
          Top 8 des taxons les plus représentés parmi les hits significatifs
        </p>
        <div className="h-56 w-full mt-auto">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={sortedOrganisms} 
              layout="vertical" 
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" stroke="#64748b" fontSize={10} allowDecimals={false} />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="#64748b" 
                fontSize={9} 
                width={110} 
                tickFormatter={(val) => val.length > 18 ? `${val.substring(0, 16)}…` : val}
              />
              <RechartsTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs shadow-xl">
                        <div className="font-bold text-white italic">{d.name}</div>
                        <div className="text-cyan-400 font-mono mt-1">Nombre de hits : <span className="font-bold">{d.count}</span></div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {sortedOrganisms.map((_, index) => (
                  <Cell key={`org-cell-${index}`} fill={organismPalette[index % organismPalette.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
