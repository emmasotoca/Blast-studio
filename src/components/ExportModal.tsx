import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileSpreadsheet, 
  FileCode, 
  Globe, 
  Printer, 
  Check, 
  Sparkles,
  FileText
} from 'lucide-react';
import { BlastHit, BlastResult, FilterCriteria } from '../types/blast';
import { formatEvalue } from '../utils/bioUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  blastResult: BlastResult;
  filteredHits: BlastHit[];
  criteria: FilterCriteria;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  blastResult,
  filteredHits,
  criteria
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const downloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 1. Export CSV
  const handleExportCsv = (separator: ',' | '\t', ext: 'csv' | 'tsv') => {
    const headers = [
      'Rang',
      'Accession',
      'Titre',
      'Organisme',
      'Bit_Score',
      'E_Value',
      'Identite_Pourcentage',
      'Couverture_Pourcentage',
      'Longueur_Alignement',
      'Nombre_HSPs',
      'Query_Start',
      'Query_End',
      'Subject_Start',
      'Subject_End'
    ];

    const rows = filteredHits.map((hit) => {
      const topHsp = hit.hsps[0];
      return [
        hit.num,
        `"${hit.accession.replace(/"/g, '""')}"`,
        `"${hit.title.replace(/"/g, '""')}"`,
        `"${(hit.organism || '').replace(/"/g, '""')}"`,
        hit.bestBitScore,
        hit.bestEvalue,
        hit.bestPident,
        hit.totalQueryCoverage,
        hit.totalAlignLen,
        hit.hsps.length,
        topHsp ? topHsp.queryFrom : '',
        topHsp ? topHsp.queryTo : '',
        topHsp ? topHsp.hitFrom : '',
        topHsp ? topHsp.hitTo : ''
      ].join(separator);
    });

    const csvContent = [headers.join(separator), ...rows].join('\n');
    downloadFile(
      csvContent, 
      `blast_results_${blastResult.queryId}.${ext}`, 
      ext === 'csv' ? 'text/csv;charset=utf-8;' : 'text/tab-separated-values;charset=utf-8;'
    );
  };

  // 2. Export FASTA
  const handleExportFasta = () => {
    const lines: string[] = [];

    // Query sequence if available in top HSP
    const firstHitWithQseq = filteredHits.find(h => h.hsps.some(hsp => hsp.qseq));
    if (firstHitWithQseq) {
      const hsp = firstHitWithQseq.hsps.find(s => s.qseq);
      if (hsp?.qseq) {
        lines.push(`>Query|${blastResult.queryId} ${blastResult.queryTitle}`);
        lines.push(hsp.qseq.replace(/-/g, ''));
      }
    }

    // Homologous hits
    filteredHits.forEach(hit => {
      const hsp = hit.hsps.find(s => s.hseq);
      const seq = hsp?.hseq ? hsp.hseq.replace(/-/g, '') : '';
      lines.push(`>${hit.accession} ${hit.title} [BitScore=${hit.bestBitScore}, Evalue=${formatEvalue(hit.bestEvalue)}, Identity=${hit.bestPident}%]`);
      if (seq) {
        lines.push(seq);
      } else {
        lines.push(`; Coordonnees cibles: ${hit.hsps[0]?.hitFrom || 1}..${hit.hsps[0]?.hitTo || hit.len}`);
      }
    });

    downloadFile(lines.join('\n'), `blast_sequences_${blastResult.queryId}.fasta`, 'text/plain;charset=utf-8;');
  };

  // 3. Export Standalone HTML Report (with Print to PDF trigger)
  const handleExportHtml = () => {
    const reportDate = new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Rapport d'analyse BLAST - ${blastResult.queryTitle}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 40px; background: #fff; color: #1e293b; line-height: 1.5; }
    h1 { color: #0f172a; margin-bottom: 4px; font-size: 24px; }
    .subtitle { color: #64748b; font-size: 13px; margin-bottom: 24px; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
    .kpi-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; }
    .kpi-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600; }
    .kpi-value { font-size: 20px; font-weight: bold; color: #0284c7; margin-top: 4px; font-family: monospace; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
    th { background: #f1f5f9; text-align: left; padding: 8px 10px; border-bottom: 2px solid #cbd5e1; font-weight: 600; color: #334155; }
    td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
    tr:nth-child(even) { background: #f8fafc; }
    .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace; }
    .text-right { text-align: right; }
    .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: bold; background: #e0f2fe; color: #0369a1; }
    .btn-print { background: #0284c7; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500; margin-bottom: 20px; }
    @media print { .btn-print { display: none; } body { margin: 10mm; } }
  </style>
</head>
<body>
  <button class="btn-print" onclick="window.print()">🖨️ Imprimer ou Enregistrer en PDF</button>
  <h1>Rapport d'Analyse BLAST Studio</h1>
  <div class="subtitle">Généré le ${reportDate} • Programme : ${blastResult.program} • Base : ${blastResult.database || 'RefSeq'}</div>

  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-label">Requête ID</div>
      <div class="kpi-value" style="font-size: 14px; word-break: break-all;">${blastResult.queryId}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Longueur Requête</div>
      <div class="kpi-value">${blastResult.queryLength} pb / aa</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Hits Significatifs</div>
      <div class="kpi-value">${filteredHits.length} / ${blastResult.hits.length}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Meilleure E-value</div>
      <div class="kpi-value" style="color: #16a34a;">${filteredHits.length > 0 ? formatEvalue(filteredHits[0].bestEvalue) : '-'}</div>
    </div>
  </div>

  <h2>Alignements Significatifs Retenus (${filteredHits.length})</h2>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Accession</th>
        <th>Description / Espèce</th>
        <th class="text-right">Score (bits)</th>
        <th class="text-right">E-value</th>
        <th class="text-right">% Identité</th>
        <th class="text-right">% Couverture</th>
        <th class="text-right">Longueur</th>
      </tr>
    </thead>
    <tbody>
      ${filteredHits.map(h => `
        <tr>
          <td class="mono">${h.num}</td>
          <td class="mono"><strong>${h.accession}</strong></td>
          <td>${h.title} ${h.organism ? `<em>(${h.organism})</em>` : ''}</td>
          <td class="mono text-right">${Math.round(h.bestBitScore)}</td>
          <td class="mono text-right" style="color: #16a34a; font-weight: bold;">${formatEvalue(h.bestEvalue)}</td>
          <td class="mono text-right">${h.bestPident}%</td>
          <td class="mono text-right">${h.totalQueryCoverage}%</td>
          <td class="mono text-right">${h.totalAlignLen}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</body>
</html>`;

    downloadFile(html, `rapport_blast_${blastResult.queryId}.html`, 'text/html;charset=utf-8;');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-950 text-emerald-400 ring-1 ring-emerald-800">
            <Download className="h-4 w-4" />
          </div>
          <h3 className="font-heading text-lg font-bold text-white">
            Exporter les Résultats
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Téléchargez vos {filteredHits.length} hits significatifs filtrés dans les formats standards bio-informatiques.
        </p>

        <div className="space-y-3">
          {/* CSV / TSV */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 hover:border-slate-700 transition">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="h-5 w-5 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="font-heading text-xs font-bold text-white">
                    Format Tabulaire (CSV / TSV)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Idéal pour l'import dans R, Python Pandas, Excel ou GraphPad Prism.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleExportCsv(',', 'csv')}
                  className="rounded-lg bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-xs font-mono font-medium text-emerald-300 transition"
                >
                  .CSV
                </button>
                <button
                  onClick={() => handleExportCsv('\t', 'tsv')}
                  className="rounded-lg bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-xs font-mono font-medium text-emerald-300 transition"
                >
                  .TSV
                </button>
              </div>
            </div>
          </div>

          {/* FASTA */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 hover:border-slate-700 transition">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <FileCode className="h-5 w-5 text-cyan-400 shrink-0" />
                <div>
                  <h4 className="font-heading text-xs font-bold text-white">
                    Séquences Homologues (FASTA)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Exportation des séquences cibles retenues pour ré-alignement (Clustal/MAFFT).
                  </p>
                </div>
              </div>
              <button
                onClick={handleExportFasta}
                className="rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1 text-xs font-mono font-medium text-cyan-300 transition shrink-0"
              >
                .FASTA
              </button>
            </div>
          </div>

          {/* HTML Standalone Report */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 hover:border-slate-700 transition">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Globe className="h-5 w-5 text-purple-400 shrink-0" />
                <div>
                  <h4 className="font-heading text-xs font-bold text-white">
                    Rapport Complet Autonome (HTML / PDF)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Page web interactive autonome avec bouton d'impression PDF pour archives et publications.
                  </p>
                </div>
              </div>
              <button
                onClick={handleExportHtml}
                className="rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1 text-xs font-mono font-medium text-purple-300 transition shrink-0"
              >
                .HTML / PDF
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 hover:bg-slate-700 px-4 py-1.5 text-xs font-medium text-slate-300 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
