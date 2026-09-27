#!/bin/bash
# Script de push direct vers GitHub depuis Google Studio
# Usage : ./push_to_github.sh ghp_VOTRE_TOKEN_GITHUB

TOKEN="$1"
REPO="emmasotoca/Blast-studio"
BRANCH="main"

if [ -z "$TOKEN" ]; then
  echo "❌ Erreur : veuillez fournir votre token GitHub."
  echo "Exemple : ./push_to_github.sh ghp_123456789abcdef"
  exit 1
fi

echo "📦 Préparation des fichiers..."
git add .
git commit -m "fix: Résolution de la compilation Vite et déploiement GitHub Pages" || true
git branch -M "$BRANCH"

echo "🚀 Envoi vers GitHub ($REPO)..."
git push "https://${TOKEN}@github.com/${REPO}.git" "$BRANCH" --force

echo "✅ Terminé avec succès ! Votre dépôt https://github.com/${REPO} a été mis à jour."
