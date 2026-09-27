import React, { useState, useRef } from 'react';
import { Upload, FileCode, Sparkles, AlertCircle, FileText, CheckCircle2, Database } from 'lucide-react';
import { SAMPLES } from '../data/sampleData';
import { detectBlastFormat, parseBlastOutput } from '../utils/parsers';
import { BlastResult } from '../types/blast';

interface ImportZoneProps {
  onParsed: (result: BlastResult) => void;
}

export const ImportZone: React.FC<ImportZoneProps> = ({ onParsed }) => {
  const [rawText, setRawText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const detectedFormat = rawText.trim() ? detectBlastFormat(rawText) : null;

  const handleParse = (text: string) => {
    if (!text.trim()) {
      setError('Veuillez coller ou téléverser une sortie BLAST valide.');
      return;
    }
    setError(null);
    setIsProcessing(true);
    try {
      const result = parseBlastOutput(text);
      if (!result.hits || result.hits.length === 0) {
        setError('Aucun alignement ou hit BLAST détecté dans les données fournies. Vérifiez le format.');
        setIsProcessing(false);
        return;
      }
      onParsed(result);
    } catch (err: any) {
      setError(err?.message || 'Erreur lors du traitement du fichier BLAST.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      loadFile(e.dataTransfer.files[0]);
    }
  };

  const loadFile = (file: File) => {
    setError(null);
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRawText(content);
      handleParse(content);
    };
    reader.onerror = () => {
      setError('Erreur lors de la lecture du fichier.');
      setIsProcessing(false);
    };
    reader.readAsText(file);
  };

  const handleSampleClick = (raw: string) => {
    setRawText(raw);
    handleParse(raw);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Intro hero banner */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-cyan-950/70 border border-cyan-800/60 px-3 py-1 text-xs text-cyan-300 mb-3 shadow-inner">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>Moteur 100% Client-Side • Confidentialité Totale des Données Biologiques</span>
        </div>
        <h2 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Visualisez & Analysez vos Résultats BLAST
        </h2>
        <p className="mt-2 text-sm text-slate-400 max-w-2xl mx-auto">
          Prise en charge instantanée des formats <strong className="text-slate-200">Tabulaire (outfmt 6/7)</strong>, <strong className="text-slate-200">XML</strong>, <strong className="text-slate-200">JSON</strong> et <strong className="text-slate-200">Pairwise classique (outfmt 0)</strong> pour BLASTN, BLASTP, BLASTX et TBLASTN/X.
        </p>
      </div>

      {/* Quick samples bar */}
      <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Database className="h-3.5 w-3.5 text-cyan-400" />
            Échantillons de Démonstration (1 clic)
          </span>
          <span className="text-xs text-slate-400">
            Testez instantanément avec des jeux de données réels
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSampleClick(sample.raw)}
              className="group flex flex-col text-left rounded-lg border border-slate-800 bg-slate-950/60 p-3 hover:border-cyan-500/50 hover:bg-slate-900/80 transition shadow-sm hover:shadow-cyan-500/10"
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-heading text-xs font-bold text-white group-hover:text-cyan-300">
                  {sample.name}
                </span>
                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-cyan-400 font-semibold">
                  {sample.program}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {sample.description}
              </p>
              <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
                <FileText className="h-3 w-3" />
                <span>{sample.formatName}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Drag & Drop / Input area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleFileDrop}
        className={`relative rounded-2xl border-2 transition-all p-6 bg-slate-900/40 backdrop-blur-sm ${
          isDragging 
            ? 'border-cyan-400 bg-cyan-950/20 ring-4 ring-cyan-500/10' 
            : 'border-dashed border-slate-700/80 hover:border-slate-600'
        }`}
      >
        <div className="flex flex-col items-center justify-center text-center mb-4">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20">
            <Upload className="h-6 w-6" />
          </div>
          <h3 className="font-heading text-sm font-semibold text-white">
            Glissez-déposez votre fichier BLAST ici
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Fichiers acceptés : <code className="text-cyan-300 font-mono">.txt, .blast, .xml, .json, .tsv, .out, .tab</code>
          </p>
          <div className="mt-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])}
              accept=".txt,.blast,.xml,.json,.tsv,.out,.tab"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg bg-slate-800 hover:bg-slate-700 px-4 py-1.5 text-xs font-medium text-slate-200 shadow-sm transition ring-1 ring-slate-700"
            >
              Parcourir les fichiers
            </button>
          </div>
        </div>

        <div className="relative my-4 flex items-center justify-center">
          <div className="w-full border-t border-slate-800" />
          <span className="absolute bg-slate-900 px-3 text-xs uppercase tracking-wider text-slate-400">
            ou collez le texte brut ci-dessous
          </span>
        </div>

        {/* Text Area */}
        <div className="space-y-3">
          <div className="relative">
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Collez ici la sortie BLAST brute (outfmt 6, outfmt 7, XML <BlastOutput>, JSON ou format Pairwise outfmt 0)..."
              rows={8}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-3 font-mono text-xs text-slate-200 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
            {detectedFormat && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded bg-slate-900/90 border border-slate-700 px-2 py-0.5 text-[10px] text-cyan-300">
                <CheckCircle2 className="h-3 w-3 text-cyan-400" />
                <span>Format détecté : {detectedFormat}</span>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-rose-800/80 bg-rose-950/40 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end gap-2">
            {rawText && (
              <button
                onClick={() => { setRawText(''); setError(null); }}
                className="rounded-lg px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200"
              >
                Effacer
              </button>
            )}
            <button
              onClick={() => handleParse(rawText)}
              disabled={isProcessing || !rawText.trim()}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-2 text-xs font-semibold text-white shadow-md shadow-cyan-500/20 transition disabled:opacity-50"
            >
              {isProcessing ? 'Traitement en cours...' : 'Analyser les Résultats'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
