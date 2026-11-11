# L2 ATM — Grade Calculator 🎓

**Calculateur de Moyenne & Simulateur Académique — L2 Automatique (Semestre 3)**  
*Université Saad Dahlab Blida 1 (Algérie) • Institut d'Aéronautique et des Études Spatiales / Faculté de Technologie*

---

## 🌟 Présentation du Projet

**L2 ATM** est une application web moderne, mobile-first et 100% autonome conçue spécifiquement pour les étudiants de **L2 Automatique (S3)** de l'**Université de Blida 1**.

Elle permet de calculer avec exactitude la moyenne semestrielle, de simuler des notes d'examen (*What-If Simulator*), d'analyser les objectifs de réussite (*Target Calculator*), et d'exporter un relevé de notes prévisionnel imprimable et conforme aux règles officielles du système **LMD algérien**.

---

## 📚 Programme Officiel S3 & Coefficients (2024–2026)

Conformément au canevas officiel de l'Université de Blida 1 (l'anglais technique ayant été retiré du programme cette année) :
- **10 Matières**
- **16 Coefficients au total**
- **29 Crédits au total**

### 1. UE Fondamentale 1 (UEF 1) — Coeff: 5 | Crédits: 10
* **Mathématiques 3** : Coeff **3** | Crédits **6** | Évaluation : 40% Contrôle Continu (CC) + 60% Examen
* **Ondes et vibrations** : Coeff **2** | Crédits **4** | Évaluation : 40% Contrôle Continu (CC) + 60% Examen

### 2. UE Fondamentale 2 (UEF 2) — Coeff: 4 | Crédits: 8
* **Électronique fondamentale 1** : Coeff **2** | Crédits **4** | Évaluation : 40% Contrôle Continu (CC) + 60% Examen
* **Électrotechnique fondamentale 1** : Coeff **2** | Crédits **4** | Évaluation : 40% Contrôle Continu (CC) + 60% Examen

### 3. UE Méthodologique (UEM) — Coeff: 5 | Crédits: 9
* **Probabilités et statistiques** : Coeff **2** | Crédits **4** | Évaluation : 40% Contrôle Continu (CC) + 60% Examen
* **Informatique 3** : Coeff **1** | Crédits **2** | Évaluation : 100% Contrôle Continu (CC)
* **TP Électronique 1 et Électrotechnique 1** : Coeff **1** | Crédits **2** | Évaluation : 100% Contrôle Continu (CC)
* **TP Ondes et vibrations** : Coeff **1** | Crédits **1** | Évaluation : 100% Contrôle Continu (CC)

### 4. UE Découverte (UED) — Coeff: 2 | Crédits: 2
* **État de l'art du Génie électrique** : Coeff **1** | Crédits **1** | Évaluation : 100% Examen
* **Énergies et environnement** : Coeff **1** | Crédits **1** | Évaluation : 100% Examen

---

## 🧮 Règles de Calcul Strictes

1. **Formules d'évaluation par matière** :
   - Pour les 5 premières matières : $\text{Note Finale} = (CC \times 0.40) + (\text{Exam} \times 0.60)$
   - Pour Informatique 3 et les TP : $\text{Note Finale} = CC$
   - Pour l'État de l'art et Énergies : $\text{Note Finale} = \text{Exam}$
2. **Moyenne Semestrielle** :
   $$\text{Moyenne Semestrielle} = \frac{\sum (\text{Note Matière} \times \text{Coefficient})}{16}$$
   *(La somme pondérée est divisée par le total des coefficients **16**, et **non** par les crédits 29).*
3. **Gestion des champs vides** :
   - Un champ non renseigné n'est **jamais** considéré comme un zéro.
   - L'application distingue clairement les matières complétées des matières en attente et fournit une moyenne provisoire sur les coefficients validés.
4. **Acquisition des Crédits (Compensation LMD)** :
   - Si la moyenne générale $\ge 10.00/20$, l'étudiant valide la totalité des **29 crédits** par compensation semestrielle.
   - En cas d'ajournement ($< 10$), chaque UE ayant une moyenne $\ge 10.00$ valide tous ses crédits (compensation intra-UE). Dans les UEs non acquises, seules les matières ayant $\ge 10.00$ attribuent leurs crédits.

---

## 🛠️ Stack Technique

* **Framework** : React 19 + TypeScript (Strict typing)
* **Build Tool** : Vite 8 (configuré avec `base: './'` pour chemins relatifs universels)
* **Styles & Design** : Tailwind CSS v4
* **Icônes** : Lucide React
* **Tests Unitaires & Moteur de Calcul** : Vitest (12 tests automatisés)
* **Persistance** : Web Storage API (`localStorage`)
* **Dépendances Backend** : **Aucune (0 backend, 0 base de données, 0 API payante)**

---

## 💻 Développement Local

```bash
# 1. Naviguer dans le dossier
cd c:\Users\Admin\Downloads\calc

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement local
npm run dev
# -> Disponible sur http://localhost:5173/

# 4. Lancer la suite de tests automatisés
npm run test

# 5. Compiler pour la production
npm run build
# -> Fichiers générés dans le dossier dist/

# 6. Prévisualiser le build de production localement
npm run preview
```

---

## 🚀 Guide de Déploiement Statique Gratuit

L'application a été préparée pour un hébergement statique gratuit immédiat :
- ✅ **Chemins d'accès relatifs configurés (`base: './'`)** : Fonctionne aussi bien à la racine d'un domaine qu'au sein d'un sous-dossier (ex: `https://user.github.io/calc/`).
- ✅ **Aucun backend requis** : Entièrement exécuté côté client dans le navigateur.
- ✅ **Dossier de sortie prêt** : Dossier `dist/` autonome avec `index.html`, `assets/`, et `favicon.svg`.

Voici les options gratuites recommandées :

### Option 1 : Vercel (Recommandé — Déploiement en 1 clic)
1. Créer un compte gratuit sur [vercel.com](https://vercel.com/).
2. Lier votre dépôt GitHub contenant ce projet.
3. Vercel détecte automatiquement le projet Vite :
   - **Framework Preset** : `Vite`
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
4. Cliquer sur **Deploy**. Votre site est en ligne avec HTTPS automatique.

*Alternative via CLI Vercel :*
```bash
npm run build
npx vercel deploy --prod dist
```

---

### Option 2 : GitHub Pages (100% Gratuit & Lié à GitHub)
1. Pousser le projet sur votre dépôt GitHub.
2. Aller dans **Settings** > **Pages** de votre dépôt GitHub.
3. Dans **Build and deployment** > **Source**, choisissez soit :
   - **GitHub Actions** avec le template standard "Static HTML / Vite", ou
   - **Deploy from a branch** en utilisant la branche `gh-pages` :
     ```bash
     npm install -D gh-pages
     npm run build
     npx gh-pages -d dist
     ```
4. Grâce à la configuration `base: './'`, tous les assets (`JS`, `CSS`, `favicon`) se chargeront parfaitement sous l'URL `https://<votre-compte>.github.io/<nom-du-repo>/`.

---

### Option 3 : Netlify (Glisser-Déposer en 30 secondes)
1. Exécuter le build en local :
   ```bash
   npm run build
   ```
2. Rendez-vous sur [app.netlify.com/drop](https://app.netlify.com/drop).
3. Glissez-déposez simplement le dossier **`dist`** dans la fenêtre du navigateur.
4. Votre application est immédiatement mise en ligne avec une URL sécurisée (HTTPS).

*Alternative via Netlify CLI :*
```bash
npx netlify deploy --prod --dir=dist
```

---

### Option 4 : Cloudflare Pages
1. Créer un compte sur [dash.cloudflare.com](https://dash.cloudflare.com/).
2. Aller dans **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Sélectionner votre dépôt :
   - **Framework preset** : `Vite`
   - **Build command** : `npm run build`
   - **Build output directory** : `dist`
4. Cliquer sur **Save and Deploy**. Bénéficie du CDN mondial ultra-rapide de Cloudflare.

---

### Option 5 : Surge.sh (Déploiement direct en ligne de commande)
```bash
npm run build
npx surge dist
```
Suivez les invites pour choisir un nom de domaine gratuit (ex: `l2-atm-blida.surge.sh`).

---

### 📱 Intégration en Telegram Mini App
L'application est immédiatement compatible avec l'intégration en tant que Telegram Mini App pour les groupes d'étudiants :
1. Créez un bot sur Telegram via `@BotFather`.
2. Tapez `/newapp`, sélectionnez votre bot.
3. Définissez le titre (`L2 ATM Calculator`) et collez l'URL HTTPS issue de votre hébergement statique (Vercel, Netlify, Cloudflare ou GitHub Pages).
4. L'application s'ouvre de manière fluide et responsive à l'intérieur même de Telegram sur Android et iOS.

---

## 🧪 Tests Automatisés

La suite de 12 tests automatisés peut être exécutée à tout moment :
```bash
npm run test
```

Vérifications incluses :
- Exactement 10 matières, 16 coefficients, 29 crédits.
- Retrait confirmé de l'anglais technique.
- Règle 40% CC + 60% Exam sur les 5 premières matières.
- Règle 100% CC sur Informatique 3 et les 2 TPs.
- Règle 100% Exam sur État de l'art et Énergies.
- Division stricte de la somme pondérée par 16 (et non 29).
- Non-comptabilisation des champs vides comme des zéros.
- Validité de la sérialisation LocalStorage.
- Complétude des traductions (Français, Arabe RTL, Anglais).
- Calculs d'objectifs d'examen et détection des cibles impossibles ($>20$).

---

## 👨‍🎓 Conçu pour
Les étudiants de **Licence 2 Automatique — Semestre 3** de l'**Université Saad Dahlab Blida 1**.
