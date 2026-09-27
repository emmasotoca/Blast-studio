import express from 'express';
import { createServer as createViteServer } from 'vite';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // API endpoint for in-app GitHub Push directly from Google Studio
  app.post('/api/git-push', async (req, res) => {
    const { token, repo = 'emmasotoca/Blast-studio', branch = 'main' } = req.body;
    
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Token GitHub requis' });
    }

    const cleanToken = token.trim();
    if (!cleanToken.startsWith('ghp_') && !cleanToken.startsWith('github_pat_')) {
      return res.status(400).json({ error: 'Le token doit commencer par ghp_ ou github_pat_' });
    }

    const cleanRepo = (repo || 'emmasotoca/Blast-studio').trim();
    const cleanBranch = (branch || 'main').trim();

    try {
      // 1. Stage all changes
      await execPromise('git add .');

      // 2. Commit if there are new changes
      try {
        await execPromise('git commit -m "fix: Résolution de la compilation Vite et déploiement GitHub Pages"');
      } catch {
        // Nothing new to commit is fine
      }

      // 3. Rename branch to target branch
      await execPromise(`git branch -M ${cleanBranch}`);

      // 4. Push to remote with token
      const remoteUrl = `https://${cleanToken}@github.com/${cleanRepo}.git`;
      const { stdout, stderr } = await execPromise(`git push "${remoteUrl}" ${cleanBranch} --force`);

      return res.json({
        success: true,
        message: 'Synchronisation réussie ! Les fichiers ont été poussés sur GitHub.',
        details: stdout || stderr
      });
    } catch (err: any) {
      // Redact token from error output for security
      const safeError = (err.message || '').replace(new RegExp(cleanToken, 'g'), '***');
      return res.status(500).json({
        error: 'Erreur lors du git push',
        details: safeError
      });
    }
  });

  // Healthcheck endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', studio: true });
  });

  // Vite integration
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
