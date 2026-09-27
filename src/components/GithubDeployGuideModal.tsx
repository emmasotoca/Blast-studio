import React, { useState } from 'react';
import { X, Github, Check, Copy, ExternalLink, Rocket, ShieldCheck, Terminal, AlertTriangle, ArrowRight } from 'lucide-react';

interface GithubDeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GithubDeployGuideModal: React.FC<GithubDeployGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const gitPushScript = `git add .
git commit -m "fix: Résolution du déploiement GitHub Pages"
git push origin main`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-white ring-1 ring-slate-700">
            <Github className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              Résolution du Déploiement GitHub Actions
            </h3>
            <p className="text-xs text-slate-400">
              Guide pas à pas pour corriger la croix rouge ❌ et passer au vert ✅ sur GitHub.
            </p>
          </div>
        </div>

        {/* Diagnostic alert */}
        <div className="my-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200">
          <div className="flex items-center gap-2 font-semibold text-amber-300 mb-1">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>Cause fréquente des erreurs à 14s ou 23s</span>
          </div>
          <p className="text-[11px] text-amber-200/90 leading-relaxed">
            Par défaut sur les nouveaux dépôts GitHub, les workflows n'ont pas la permission d'écriture (<code className="text-amber-100 font-mono">Read-only</code>). Il suffit d'activer l'écriture dans les paramètres en 2 clics.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4 my-4 text-xs">
          {/* Step 1: Permissions */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <span className="font-bold text-cyan-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              Étape 1 : Autoriser l'écriture pour GitHub Actions (15 secondes)
            </span>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1 text-[12px] leading-relaxed">
              <li>Sur votre dépôt GitHub, cliquez sur l'onglet <strong className="text-white">Settings</strong>.</li>
              <li>Dans le menu de gauche, descendez jusqu'à <strong className="text-white">Actions</strong> &gt; <strong className="text-white">General</strong>.</li>
              <li>Faites défiler tout en bas jusqu'à la section <strong className="text-white">Workflow permissions</strong>.</li>
              <li>
                Cochez <strong className="text-emerald-400">"Read and write permissions"</strong> puis cliquez sur <strong className="text-white">Save</strong>.
              </li>
            </ol>
          </div>

          {/* Step 2: Push fix */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-cyan-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5" />
                Étape 2 : Poussez la mise à jour
              </span>
              <button
                onClick={() => copyToClipboard(gitPushScript, 'push')}
                className="flex items-center gap-1 rounded bg-slate-800 hover:bg-slate-700 px-2 py-1 text-[11px] text-slate-300 transition"
              >
                {copiedCmd === 'push' ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-400">Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copier</span>
                  </>
                )}
              </button>
            </div>
            <pre className="overflow-x-auto rounded-lg bg-slate-950 p-2.5 font-mono text-[11px] text-slate-300 border border-slate-800">
              {gitPushScript}
            </pre>
          </div>

          {/* Step 3: Pages branch selection */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <span className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-1.5">
              <Rocket className="h-3.5 w-3.5" />
              Étape 3 : Activez la branche gh-pages
            </span>
            <p className="text-slate-300 leading-relaxed text-[12px] mb-2">
              Une fois le build terminé en vert (✅), rendez-vous dans <strong className="text-white">Settings &gt; Pages</strong> :
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1 text-[11px]">
              <li>Source : <strong className="text-white">Deploy from a branch</strong></li>
              <li>Branch : <strong className="text-cyan-400">gh-pages</strong> / Folder : <strong className="text-white">/ (root)</strong></li>
            </ul>
            <div className="mt-3 rounded-lg bg-slate-950 p-2.5 font-mono text-cyan-300 border border-slate-800 text-[11px] flex items-center justify-between">
              <span>https://emmasotoca.github.io/Blast-studio/</span>
              <span className="text-[10px] text-slate-500 uppercase font-sans font-semibold">Lien Direct</span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-cyan-600 hover:bg-cyan-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-cyan-500/20 transition"
          >
            Fermer le guide
          </button>
        </div>
      </div>
    </div>
  );
};
