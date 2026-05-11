# TopoCT — Suivi topographique des travaux

Application PWA (Progressive Web App) de contrôle topographique des travaux de voirie.
Fonctionne **hors ligne** sur iPhone et Android, installable sur l'écran d'accueil.

---

## Déploiement sur GitHub Pages (étape par étape)

### 1. Créer le dépôt GitHub

1. Connecte-toi sur [github.com](https://github.com)
2. Clique sur **"New repository"** (bouton vert en haut à droite)
3. Nom du dépôt : `topoCT`
4. Visibilité : **Public** (requis pour GitHub Pages gratuit)
5. Clique **"Create repository"**

---

### 2. Uploader les fichiers

Sur la page du dépôt vide, clique **"uploading an existing file"** puis glisse ces fichiers :

```
topoCT/
├── index.html        ← application principale
├── sw.js             ← service worker (mode hors ligne)
├── manifest.json     ← config PWA
└── icons/
    ├── icon-192.png  ← icône app
    └── icon-512.png  ← icône app
```

Clique **"Commit changes"** en bas.

---

### 3. Activer GitHub Pages

1. Dans le dépôt, clique **Settings** (onglet en haut)
2. Dans le menu gauche, clique **Pages**
3. Sous "Source", sélectionne **Deploy from a branch**
4. Branch : **main** — Folder : **/ (root)**
5. Clique **Save**

⏳ Attendre 2-3 minutes, puis ton URL sera :
```
https://TON-USERNAME.github.io/topoCT/
```

---

### 4. Installer sur iPhone

1. Ouvre **Safari** sur iPhone
2. Va sur l'URL de ton application
3. Appuie sur l'icône **Partager** (carré avec flèche vers le haut)
4. Appuie sur **"Sur l'écran d'accueil"**
5. Donne un nom → **Ajouter**

✅ TopoCT apparaît comme une vraie app sur ton écran d'accueil.

---

### 5. Installer sur Android

1. Ouvre **Chrome** sur Android
2. Va sur l'URL de ton application
3. Un bandeau **"Installer TopoCT"** apparaît automatiquement
4. Appuie sur **Installer**

Ou manuellement : menu ⋮ → **"Ajouter à l'écran d'accueil"**

✅ TopoCT apparaît comme une vraie app avec icône.

---

## Fonctionnement hors ligne

- Toutes les pages sont **mises en cache** au premier chargement
- Les saisies faites **sans internet** sont stockées localement
- Dès que la connexion revient, les données sont **synchronisées automatiquement**
- Un bandeau orange indique le mode hors ligne
- Un compteur indique le nombre de saisies en attente de sync

---

## Sécurité Admin

- Premier accès : code temporaire **1234**
- L'admin choisit son propre mot de passe dès la première connexion
- L'accès admin est **verrouillé sur un seul appareil**
- Aucun autre téléphone ne peut accéder même avec le bon mot de passe

---

## Évolution vers une vraie base de données

Pour persister les données entre tous les utilisateurs (et pas seulement en local),
connecter l'application à **Supabase** :

1. Créer un compte sur [supabase.com](https://supabase.com) (gratuit)
2. Créer un projet
3. Créer les tables : `axes`, `receptions`, `points_temps`, `profils_pk`
4. Remplacer les appels `localStorage` par des appels à l'API Supabase
5. Activer la **Row Level Security** pour sécuriser les accès

---

## Structure des fichiers

| Fichier | Rôle |
|---------|------|
| `index.html` | Application complète (HTML + CSS + JS) |
| `sw.js` | Service Worker — cache offline + sync arrière-plan |
| `manifest.json` | Métadonnées PWA (nom, icône, couleurs) |
| `icons/` | Icônes app (192px et 512px) |
