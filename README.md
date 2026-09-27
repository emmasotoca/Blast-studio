# 🧬 BLAST Studio - Analyseur & Visualiseur Bio-informatique

> **Outil bio-informatique 100% autonome côté client (Client-Side / In-Browser) pour l'analyse, le filtrage et la visualisation interactive de résultats BLAST.**
> Conçu pour un déploiement instantané et automatique sur **GitHub Pages**.

---

## 🚀 Déploiement Automatique sur GitHub Pages (En 3 Étapes)

Ce projet est **100% pré-configuré** pour GitHub Pages :
- `base: './'` est configuré dans `vite.config.ts` (chargement garanti de tous les assets `.js`, `.css`, images et polices dans les sous-dossiers de GitHub Pages).
- Le workflow GitHub Actions d'intégration continue est déjà présent sous `.github/workflows/deploy.yml`.

### Étape 1 : Poussez votre code vers GitHub
Dans votre terminal :
```bash
git init
git add .
git commit -m "feat: Initialisation de BLAST Studio"
git remote add origin https://github.com/VOTRE-PSEUDO/blast-studio.git
git branch -M main
git push -u origin main
```

### Étape 2 : Activez GitHub Pages dans les réglages
1. Allez sur votre dépôt GitHub : `https://github.com/VOTRE-PSEUDO/blast-studio`
2. Cliquez sur l'onglet **Settings** (Paramètres).
3. Dans la colonne de gauche, cliquez sur **Pages**.
4. Sous **Build and deployment > Source**, choisissez **GitHub Actions**.

### Étape 3 : Votre application est en ligne ! 🎉
Le workflow se déclenche automatiquement à chaque push sur `main`. En moins de 60 secondes, votre application est accessible publiquement à l'adresse :
```
https://VOTRE-PSEUDO.github.io/blast-studio/
```

---

## ✨ Fonctionnalités Principales

- **🔒 100% Confidentialité & Zéro Serveur** : Toutes les analyses, calculs statistiques et parsings s'exécutent directement dans votre navigateur. Aucune donnée biologique ne quitte votre machine.
- **📥 Import Multi-Formats** :
  - BLAST Tabulaire (`outfmt 6` et `outfmt 7` avec colonnes personnalisées ou standard).
  - BLAST XML (`<BlastOutput>`).
  - BLAST JSON (`BlastOutput2` et NCBI API).
  - BLAST classique Pairwise (`outfmt 0`).
  - Détection automatique de `BLASTN`, `BLASTP`, `BLASTX`, `TBLASTN`, `TBLASTX`.
- **🎯 Filtrage Intelligent en Temps Réel** :
  - Seuil maximal d'E-value (saisie scientifique `1e-5`, `1e-50` ou curseur logarithmique).
  - % d'identité minimal, Score de Bit minimal, Couverture de la requête (%), Longueur minimale.
  - Option de dédoublonnage par cible (garder uniquement le meilleur HSP).
  - Recherche textuelle instantanée (espèce, organisme, accession, mot-clé).
- **📊 Tableau de Bord & Graphiques (Recharts)** :
  - Histogramme logarithmique de la distribution des E-values.
  - Nuage de points (% Identité vs Score de Bit, taille proportionnelle à la longueur).
  - Répartition taxonomique (Top des organismes/espèces).
  - Tableau complet paginé, triable par colonne avec liens directs vers NCBI.
- **🗺️ Résumé Graphique Linéaire (Style NCBI Graphic Summary)** :
  - Séquence requête à l'échelle avec graduation (en pb ou aa).
  - Barres d'alignement avec palette couleur officielle NCBI (<40, 40-50, 50-80, 80-200, ≥200 bits).
  - Tooltip interactif et export vectoriel SVG haute résolution.
- **🔬 Visualiseur Détaillé d'Alignements (HSP Pairwise Viewer)** :
  - Alignements Query / Midline / Subject découpés par blocs (60, 80, 100 résidus).
  - Coloration par correspondance/mismatch ou par propriétés physico-chimiques des acides aminés (hydrophobes, polaires, basiques, acides) et bases A, T/U, G, C.
  - Copie 1 clic de l'alignement.
- **💾 Exportations Multi-Formats** :
  - Tableaux de données **CSV** et **TSV** pour R / Python Pandas.
  - Séquences homologues filtrées au format **FASTA**.
  - **Rapport HTML complet et autonome** imprimable en **PDF** (`window.print()`).
  - Graphiques vectoriels **SVG**.

---

## 💻 Développement Local

Si vous souhaitez exécuter ou modifier l'application en local :

```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement (port 3000)
npm run dev

# Compilation pour la production (vérification du build)
npm run build
```

---

## 📄 Licence

Distribué sous licence **Apache-2.0**.
