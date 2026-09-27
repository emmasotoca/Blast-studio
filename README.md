# 🧬 BLAST Studio - Analyseur & Visualiseur Bio-informatique

> **Outil bio-informatique 100% autonome côté client (Client-Side / In-Browser) pour l'analyse, le filtrage et la visualisation interactive de résultats BLAST.**
> Conçu pour un déploiement instantané et automatique sur **GitHub Pages**.

---

## 🚀 Déploiement GitHub Pages : Guide de configuration

### Étape 1 : Autoriser l'écriture pour les Workflows GitHub Actions (Important)
Par défaut, GitHub applique un mode lecture seule aux tokens des actions :
1. Allez sur votre dépôt GitHub : **`Settings`** (en haut à droite).
2. Dans le menu de gauche, cliquez sur **`Actions`** > **`General`**.
3. Descendez tout en bas jusqu'à la section **`Workflow permissions`**.
4. Cochez **`Read and write permissions`** et cliquez sur **Save**.

### Étape 2 : Poussez votre code vers GitHub
Dans votre terminal :
```bash
git add .
git commit -m "fix: Configuration déploiement automatique GitHub Pages"
git push origin main
```

### Étape 3 : Activez la branche `gh-pages`
Le workflow compile automatiquement l'application et crée la branche `gh-pages`.
1. Allez sur votre dépôt : **`Settings`** > **`Pages`**.
2. Sous **Build and deployment > Source**, sélectionnez **Deploy from a branch**.
3. Choisissez la branche **`gh-pages`** et dossier **`/ (root)`**, puis cliquez sur **Save**.

Votre application sera en ligne à l'adresse :
```
https://emmasotoca.github.io/Blast-studio/
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

```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement (port 3000)
npm run dev

# Compilation de production
npm run build
```

---

## 📄 Licence

Distribué sous licence **Apache-2.0**.
