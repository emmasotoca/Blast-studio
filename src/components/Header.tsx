import React from 'react';
import { Dna, FileText, Download, RotateCcw, ShieldCheck, Github } from 'lucide-react';
import { BlastResult } from '../types/blast';

interface HeaderProps {
  blastResult: BlastResult | null;
  onReset: () => void;
  onOpenExport: () => void;
  onOpenGithubGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({ blastResult, onReset, onOpenExport, onOpenGithubGuide }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
            <Dna className="h-6 w-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-lg font-bold tracking-tight text-white sm:text-xl">
                BLAST<span className="text-cyan-400">Studio</span>
              </h1>
              <span className="hidden rounded-full bg-cyan-950/80 px-2 py-0.5 text-xs font-semibold text-cyan-300 ring-1 ring-cyan-800/60 sm:inline-flex">
                Client-Side v2.1
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Analyseur & Visualiseur Bio-informatique autonome
            </p>
          </div>
        </div>

        {/* Status / Active query info */}
        {blastResult && (
          <div className="hidden lg:flex items-center gap-2 rounded-lg bg-slate-900/90 px-3 py-1.5 ring-1 ring-slate-800">
            <span className="rounded bg-cyan-950 px-2 py-0.5 text-xs font-mono font-bold text-cyan-400">
              {blastResult.program}
            </span>
            <span className="text-xs text-slate-400 font-mono max-w-[200px] truncate" title={blastResult.queryTitle}>
              {blastResult.queryId}
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400 font-mono">
              {blastResult.queryLength} {blastResult.program === 'BLASTP' || blastResult.program === 'BLASTX' ? 'aa' : 'pb'}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {blastResult && (
            <>
              <button
                onClick={onOpenExport}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:shadow-emerald-500/20 ring-1 ring-emerald-400/30"
                title="Exporter les résultats (CSV, TSV, FASTA, SVG, HTML)"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Exporter</span>
              </button>

              <button
                onClick={onReset}
                className="flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition ring-1 ring-slate-700"
                title="Charger un nouveau fichier BLAST"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Nouveau</span>
              </button>
            </>
          )}

          <button
            onClick={onOpenGithubGuide}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white px-2.5 py-1.5 text-xs font-medium border border-slate-700 transition"
            title="Guide de déploiement automatique sur GitHub Pages"
          >
            <Github className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Déployer sur GitHub</span>
          </button>

          <div className="hidden md:flex items-center gap-1 text-[11px] text-slate-400 border-l border-slate-800 pl-3">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>100% Hors Ligne</span>
          </div>
        </div>
      </div>
    </header>
  );
};
