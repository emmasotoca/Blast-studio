import React, { useState } from 'react';
import { 
  X, 
  Github, 
  Check, 
  Copy, 
  ExternalLink, 
  Rocket, 
  ShieldCheck, 
  Terminal, 
  AlertTriangle, 
  Lock, 
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';

interface GithubPushModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GithubPushModal: React.FC<GithubPushModalProps> = ({ isOpen, onClose }) => {
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [repo, setRepo] = useState('emmasotoca/Blast-studio');
  const [branch, setBranch] = useState('main');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; details?: string } | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handlePush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/git-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token.trim(),
          repo: repo.trim(),
          branch: branch.trim()
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult({
          success: true,
          message: 'Code poussé avec succès sur GitHub !',
          details: data.details
        });
      } else {
        setResult({
          success: false,
          message: data.error || 'Erreur lors du push',
          details: data.details
        });
      }
    } catch (err: any) {
      setResult({
        success: false,
        message: 'Erreur réseau ou serveur inaccessible',
        details: err.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const terminalCmd = `./push_to_github.sh ${token ? token.trim() : 'ghp_VOTRE_TOKEN'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/60 shadow-lg shadow-cyan-950/50">
            <Rocket className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              Pousser vers GitHub depuis Google Studio
            </h3>
            <p className="text-xs text-slate-400">
              Synchronisez directement tous les fichiers corrigés vers votre dépôt en 1 clic.
            </p>
          </div>
        </div>

        {result && (
          <div className={`mb-4 rounded-xl border p-4 text-xs ${
            result.success 
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' 
              : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
          }`}>
            <div className="flex items-center gap-2 font-bold mb-1">
              {result.success ? <Check className="h-4 w-4 shrink-0 text-emerald-400" /> : <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />}
              <span>{result.message}</span>
            </div>
            {result.details && (
              <pre className="mt-2 overflow-x-auto rounded bg-slate-950/80 p-2 font-mono text-[10px] text-slate-300 border border-slate-800">
                {result.details}
              </pre>
            )}
            {result.success && (
              <div className="mt-3 flex items-center gap-3">
                <a
                  href={`https://github.com/${repo}/actions`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-emerald-400 hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Voir GitHub Actions en cours
                </a>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handlePush} className="space-y-4">
          {/* Target Repo */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Dépôt GitHub cible
              </label>
              <div className="flex items-center rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-mono text-white">
                <Github className="h-3.5 w-3.5 mr-2 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  className="bg-transparent w-full focus:outline-none text-xs font-mono text-cyan-300"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Branche
              </label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* GitHub Token */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Votre Personal Access Token GitHub (classic)
              </label>
              <a
                href="https://github.com/settings/tokens/new?scopes=repo&description=Blast-Studio"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:underline"
              >
                Générer un token (cocher repo)
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 pl-9 pr-10 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                required
              />
              <Lock className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-500" />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              Ce token n'est jamais sauvegardé ni partagé. Il sert uniquement à authentifier l'envoi.
            </p>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading || !token.trim()}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-900/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Poussée des fichiers vers GitHub en cours...</span>
              </>
            ) : (
              <>
                <Rocket className="h-4 w-4" />
                <span>🚀 Pousser maintenant vers GitHub</span>
              </>
            )}
          </button>
        </form>

        {/* Alternative: Terminal Command */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-slate-400 text-xs flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-slate-400" />
              Ou via votre terminal local / console :
            </span>
            <button
              onClick={() => copyToClipboard(terminalCmd, 'cmd')}
              className="flex items-center gap-1 rounded bg-slate-800 hover:bg-slate-700 px-2 py-1 text-[11px] text-slate-300 transition"
            >
              {copiedCmd === 'cmd' ? (
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
          <pre className="overflow-x-auto rounded-lg bg-slate-950 p-2.5 font-mono text-[11px] text-cyan-300 border border-slate-800">
            {terminalCmd}
          </pre>
        </div>
      </div>
    </div>
  );
};
