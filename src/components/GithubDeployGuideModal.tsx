import React, { useState } from 'react';
import { X, Github, Check, Copy, ExternalLink, Rocket, ShieldCheck, Terminal, ArrowRight } from 'lucide-react';

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

  const gitPushScript = `# 1. Initialiser le dépôt git (si ce n'est pas déjà fait)
git init
git add .
git commit -m "feat: Déploiement initial de BLAST Studio"

# 2. Lier votre dépôt GitHub (remplacez PSEUDO et NOM-DU-REPO)
git remote add origin https://github.com/VOTRE-PSEUDO/blast-studio.git
git branch -M main

# 3. Pousser vers GitHub (déclenche le déploiement automatique)
git push -u origin main`;

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
              Déploiement Automatique sur GitHub Pages
              <span className="rounded-full bg-emerald-950/90 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 text-[11px] font-sans font-medium">
                Prêt à l'emploi
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Votre application est 100% configurée pour être publiée en ligne sans aucun serveur.
            </p>
          </div>
        </div>

        {/* Status badges */}
        <div className="my-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-2 rounded-lg bg-slate-950/80 p-2.5 border border-slate-800">
            <Check className="h-4 w-4 text-emerald-400 shrink-0" />
            <div>
              <span className="font-semibold text-slate-200 block text-[11px]">Chemins relatifs</span>
              <span className="text-[10px] text-slate-400">base: './' configuré</span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-slate-950/80 p-2.5 border border-slate-800">
            <Check className="h-4 w-4 text-emerald-400 shrink-0" />
            <div>
              <span className="font-semibold text-slate-200 block text-[11px]">Workflow CI/CD</span>
              <span className="text-[10px] text-slate-400">.github/workflows/deploy.yml</span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-slate-950/80 p-2.5 border border-slate-800">
            <Check className="h-4 w-4 text-emerald-400 shrink-0" />
            <div>
              <span className="font-semibold text-slate-200 block text-[11px]">Zéro serveur</span>
              <span className="text-[10px] text-slate-400">Pure Client-Side</span>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4 my-4 text-xs">
          {/* Step 1 */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-cyan-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5" />
                Étape 1 : Poussez votre code sur GitHub
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
                    <span>Copier les commandes</span>
                  </>
                )}
              </button>
            </div>
            <pre className="overflow-x-auto rounded-lg bg-slate-950 p-3 font-mono text-[11px] text-slate-300 leading-relaxed border border-slate-800">
              {gitPushScript}
            </pre>
          </div>

          {/* Step 2 */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <span className="font-bold text-cyan-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-2">
              <Rocket className="h-3.5 w-3.5" />
              Étape 2 : Activez GitHub Pages dans les réglages (30 secondes)
            </span>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1 text-[12px] leading-relaxed">
              <li>Rendez-vous sur votre dépôt GitHub dans votre navigateur.</li>
              <li>Cliquez sur l'onglet <strong className="text-white">Settings</strong> (Paramètres).</li>
              <li>Dans le menu de gauche, cliquez sur <strong className="text-white">Pages</strong>.</li>
              <li>
                Sous la section <strong className="text-white">Build and deployment &gt; Source</strong>, sélectionnez :
                <span className="ml-2 inline-block rounded bg-cyan-950/90 text-cyan-300 border border-cyan-800 px-2 py-0.5 font-semibold text-[11px]">
                  GitHub Actions
                </span>
              </li>
            </ol>
          </div>

          {/* Step 3 */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <span className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-1.5">
              <Check className="h-3.5 w-3.5" />
              Étape 3 : C'est tout ! Déploiement automatique terminé
            </span>
            <p className="text-slate-300 leading-relaxed text-[12px]">
              Dès que vous poussez un commit sur la branche <code className="text-cyan-400 font-mono">main</code>, GitHub Actions compile automatiquement votre application et la met en ligne à l'adresse :
            </p>
            <div className="mt-2 rounded-lg bg-slate-950 p-2.5 font-mono text-cyan-300 border border-slate-800 text-[11px] flex items-center justify-between">
              <span>https://&lt;votre-pseudo&gt;.github.io/&lt;nom-du-depot&gt;/</span>
              <span className="text-[10px] text-slate-500 uppercase font-sans font-semibold">URL finale</span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg bg-cyan-600 hover:bg-cyan-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-cyan-500/20 transition"
          >
            J'ai compris, fermer
          </button>
        </div>
      </div>
    </div>
  );
};
