import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Dna, 
  Database, 
  FileText, 
  SlidersHorizontal, 
  Activity, 
  AlignLeft,
  ChevronDown
} from 'lucide-react';
import { BlastHit, BlastResult, FilterCriteria } from './types/blast';
import { SAMPLE_BLASTN_16S } from './data/sampleData';
import { parseBlastOutput } from './utils/parsers';
import { Header } from './components/Header';
import { ImportZone } from './components/ImportZone';
import { FilterBar } from './components/FilterBar';
import { KpiCards } from './components/KpiCards';
import { GraphicSummary } from './components/GraphicSummary';
import { DashboardCharts } from './components/DashboardCharts';
import { HitsTable } from './components/HitsTable';
import { AlignmentViewer } from './components/AlignmentViewer';
import { ExportModal } from './components/ExportModal';
import { GithubDeployGuideModal } from './components/GithubDeployGuideModal';
import { GithubPushModal } from './components/GithubPushModal';

export default function App() {
  const [blastResult, setBlastResult] = useState<BlastResult | null>(null);
  const [selectedHit, setSelectedHit] = useState<BlastHit | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isGithubGuideOpen, setIsGithubGuideOpen] = useState(false);
  const [isGithubPushOpen, setIsGithubPushOpen] = useState(false);

  const [criteria, setCriteria] = useState<FilterCriteria>({
    maxEvalue: 10,
    minIdentity: 0,
    minBitScore: 0,
    minCoverage: 0,
    minAlignLength: 0,
    deduplicateByTarget: false,
    searchQuery: ''
  });

  const alignmentViewerRef = useRef<HTMLDivElement>(null);

  // Auto-load 16S sample on first visit to immediately showcase the rich interface
  useEffect(() => {
    try {
      const initial = parseBlastOutput(SAMPLE_BLASTN_16S.raw);
      setBlastResult(initial);
      if (initial.hits.length > 0) {
        setSelectedHit(initial.hits[0]);
      }
    } catch {
      // Fallback
    }
  }, []);

  const handleParsed = (result: BlastResult) => {
    setBlastResult(result);
    setSelectedHit(result.hits[0] || null);
    // Reset filters to defaults
    setCriteria({
      maxEvalue: 10,
      minIdentity: 0,
      minBitScore: 0,
      minCoverage: 0,
      minAlignLength: 0,
      deduplicateByTarget: false,
      searchQuery: ''
    });
  };

  const handleReset = () => {
    setBlastResult(null);
    setSelectedHit(null);
  };

  const handleSelectHit = (hit: BlastHit) => {
    setSelectedHit(hit);
    setTimeout(() => {
      alignmentViewerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  };

  // Filtered hits
  const filteredHits = useMemo(() => {
    if (!blastResult) return [];

    let list = blastResult.hits.filter(hit => {
      // E-value
      if (hit.bestEvalue > criteria.maxEvalue) return false;
      // % Identity
      if (hit.bestPident < criteria.minIdentity) return false;
      // Bit score
      if (hit.bestBitScore < criteria.minBitScore) return false;
      // Query coverage
      if (hit.totalQueryCoverage < criteria.minCoverage) return false;
      // Align length
      if (hit.totalAlignLen < criteria.minAlignLength) return false;

      // Search query in title, accession or organism
      if (criteria.searchQuery.trim().length > 0) {
        const q = criteria.searchQuery.toLowerCase();
        const matchesAcc = hit.accession.toLowerCase().includes(q);
        const matchesTitle = hit.title.toLowerCase().includes(q);
        const matchesOrg = (hit.organism || '').toLowerCase().includes(q);
        if (!matchesAcc && !matchesTitle && !matchesOrg) return false;
      }

      return true;
    });

    // Deduplication by organism or target accession
    if (criteria.deduplicateByTarget) {
      const seen = new Set<string>();
      const deduped: BlastHit[] = [];
      list.forEach(hit => {
        const key = hit.organism || hit.accession;
        if (!seen.has(key)) {
          seen.add(key);
          deduped.push(hit);
        }
      });
      list = deduped;
    }

    return list;
  }, [blastResult, criteria]);

  // Keep selectedHit in sync if filtered out
  useEffect(() => {
    if (filteredHits.length > 0) {
      if (!selectedHit || !filteredHits.some(h => h.id === selectedHit.id)) {
        setSelectedHit(filteredHits[0]);
      }
    } else {
      setSelectedHit(null);
    }
  }, [filteredHits]);

  const unit = blastResult && (blastResult.program === 'BLASTP' || blastResult.program === 'BLASTX') ? 'aa' : 'pb';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top sticky navigation */}
      <Header
        blastResult={blastResult}
        onReset={handleReset}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenGithubGuide={() => setIsGithubGuideOpen(true)}
        onOpenGithubPush={() => setIsGithubPushOpen(true)}
      />

      <main className="flex-1 pb-16">
        {!blastResult ? (
          <ImportZone onParsed={handleParsed} />
        ) : (
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6">
            {/* Query overview summary bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-950 text-cyan-400 ring-1 ring-cyan-800">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-cyan-950 px-2 py-0.5 text-xs font-mono font-bold text-cyan-400 ring-1 ring-cyan-800">
                      {blastResult.program} {blastResult.version || ''}
                    </span>
                    <span className="font-heading text-sm font-bold text-white">
                      {blastResult.queryId}
                    </span>
                  </div>
                  <h2 className="text-xs text-slate-300 font-medium max-w-2xl truncate mt-0.5" title={blastResult.queryTitle}>
                    {blastResult.queryTitle}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                <div>
                  <span className="text-slate-500 block text-[10px]">Longueur</span>
                  <span className="text-slate-200 font-bold">{blastResult.queryLength} {unit}</span>
                </div>
                {blastResult.database && (
                  <div className="hidden sm:block">
                    <span className="text-slate-500 block text-[10px]">Base de référence</span>
                    <span className="text-slate-200 font-bold truncate max-w-[140px] block">{blastResult.database}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-500 block text-[10px]">Format d'origine</span>
                  <span className="text-cyan-400 font-bold capitalize">{blastResult.format.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <KpiCards
              totalHits={blastResult.hits.length}
              filteredHits={filteredHits}
              queryLength={blastResult.queryLength}
              unit={unit}
            />

            {/* Interactive Filter Bar */}
            <FilterBar
              criteria={criteria}
              onChange={setCriteria}
              totalHits={blastResult.hits.length}
              filteredHits={filteredHits.length}
            />

            {/* NCBI Graphic Summary */}
            <GraphicSummary
              hits={filteredHits}
              queryLength={blastResult.queryLength}
              queryId={blastResult.queryId}
              program={blastResult.program}
              selectedHitId={selectedHit?.id || null}
              onSelectHit={handleSelectHit}
            />

            {/* Analytical Charts */}
            <DashboardCharts
              hits={filteredHits}
              onSelectHit={handleSelectHit}
            />

            {/* Interactive Data Table */}
            <HitsTable
              hits={filteredHits}
              program={blastResult.program}
              selectedHitId={selectedHit?.id || null}
              onSelectHit={handleSelectHit}
            />

            {/* Pairwise Alignment Viewer (HSP Details) */}
            <div ref={alignmentViewerRef}>
              {selectedHit ? (
                <AlignmentViewer
                  hit={selectedHit}
                  program={blastResult.program}
                  queryTitle={blastResult.queryTitle}
                />
              ) : (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center text-xs text-slate-400">
                  Sélectionnez un hit dans le tableau ou le résumé graphique pour visualiser les alignements pairwise détaillés.
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Export Modal */}
      {blastResult && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          blastResult={blastResult}
          filteredHits={filteredHits}
          criteria={criteria}
        />
      )}

      {/* GitHub Deployment Guide Modal */}
      <GithubDeployGuideModal
        isOpen={isGithubGuideOpen}
        onClose={() => setIsGithubGuideOpen(false)}
      />

      {/* GitHub In-App Push Modal */}
      <GithubPushModal
        isOpen={isGithubPushOpen}
        onClose={() => setIsGithubPushOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Dna className="h-3.5 w-3.5 text-cyan-400" />
            <span className="font-heading font-semibold text-slate-300">BLAST Studio</span>
            <span>• Outil bio-informatique 100% Client-Side</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Compatible GitHub Pages • Déploiement sans serveur (Vite + React + TypeScript + Recharts)
          </div>
        </div>
      </footer>
    </div>
  );
}
