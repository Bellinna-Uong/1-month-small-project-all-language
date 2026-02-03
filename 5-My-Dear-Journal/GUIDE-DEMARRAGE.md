# 🚀 Guide de démarrage rapide

## Étapes simples pour lancer votre journal

### 1. Vérifier les installations

Ouvrez un terminal et tapez ces commandes pour vérifier que tout est installé :

```bash
go version
```
Vous devriez voir quelque chose comme `go version go1.21.0` ou supérieur.

```bash
wails version
```
Vous devriez voir la version de Wails (ex: `v2.8.0`).

Si l'une de ces commandes ne fonctionne pas :

**Pour installer Go :**
- Allez sur https://go.dev/dl/
- Téléchargez l'installateur pour votre système
- Suivez les instructions

**Pour installer Wails :**
```bash
go install github.com/wailsapp/wails/v2/cmd/wails@latest
```

### 2. Préparer le projet

Dans votre terminal, allez dans le dossier du projet :
```bash
cd journal-app
```

Installez les dépendances Go :
```bash
go mod tidy
```

Cette commande peut prendre quelques minutes la première fois.

### 3. Lancer l'application

**En mode développement (recommandé pour débuter) :**
```bash
wails dev
```

L'application va se compiler et s'ouvrir automatiquement. Toute modification du code sera automatiquement rechargée !

**Pour créer un exécutable :**
```bash
wails build
```

L'exécutable sera créé dans `build/bin/`. Vous pourrez le lancer comme n'importe quel programme.

### 4. Utiliser l'application

1. **Choisir votre humeur** : Cliquez sur un emoji
2. **Écrire** : Tapez votre ressentis du jour dans la grande zone de texte
3. **Sauvegarder** : Cliquez sur le bouton "💾 Sauvegarder"
4. **Voir l'historique** : Cliquez sur "📖 Mes entrées passées"

### 5. Trouver vos données

Vos entrées sont automatiquement sauvegardées dans un dossier caché :

**Sur Linux/Mac :**
```bash
ls ~/.mon-journal/
cat ~/.mon-journal/entries.json
```

**Sur Windows :**
```
C:\Users\VotreNom\.mon-journal\entries.json
```

Vous pouvez ouvrir ce fichier avec n'importe quel éditeur de texte !

---

## ❓ Problèmes courants

### "wails: command not found"
Wails n'est pas installé ou n'est pas dans votre PATH.

**Solution :**
```bash
go install github.com/wailsapp/wails/v2/cmd/wails@latest
```

Puis ajoutez `~/go/bin` à votre PATH (demandez de l'aide si besoin).

### "package github.com/wailsapp/wails/v2: cannot find package"
Les dépendances ne sont pas installées.

**Solution :**
```bash
cd journal-app
go mod tidy
```

### La fenêtre ne s'ouvre pas
Vous n'avez peut-être pas les dépendances système nécessaires.

**Sur Linux (Ubuntu/Debian) :**
```bash
sudo apt-get install libgtk-3-dev libwebkit2gtk-4.0-dev
```

**Sur Mac :**
Wails fonctionne directement, mais assurez-vous d'avoir Xcode Command Line Tools :
```bash
xcode-select --install
```

**Sur Windows :**
Installez WebView2 : https://developer.microsoft.com/microsoft-edge/webview2/

---

## 🎨 Premiers pas de personnalisation

### Changer le titre de la fenêtre
Dans `main.go`, ligne ~18 :
```go
Title: "Mon Nouveau Titre ♡",
```

### Changer la taille de la fenêtre
Dans `main.go`, lignes ~19-20 :
```go
Width:  600,  // Plus large
Height: 700,  // Plus haut
```

### Ajouter un emoji d'humeur
Dans `frontend/dist/index.html`, cherchez les boutons d'humeur et ajoutez :
```html
<button class="mood-btn" data-mood="🎉" title="Joyeux">🎉</button>
```

### Changer les couleurs
Dans `frontend/dist/style.css`, cherchez les couleurs hexadécimales (ex: `#ffd4e5`) et remplacez-les par vos couleurs préférées !

Outil pour choisir des couleurs : https://coolors.co/

---

## 📖 Structure des fichiers à connaître

```
journal-app/
│
├── main.go                 ← Lance l'application
├── app.go                  ← Gère la sauvegarde des données
├── go.mod                  ← Liste des dépendances Go
├── wails.json              ← Configuration Wails
│
└── frontend/
    └── dist/               ← Fichiers de l'interface utilisateur
        ├── index.html      ← Structure de la page
        ├── style.css       ← Apparence (couleurs, tailles)
        └── app.js          ← Logique (boutons, sauvegarde)
```

**Pour modifier l'apparence** → Éditez `style.css`
**Pour modifier le texte/structure** → Éditez `index.html`
**Pour modifier le comportement** → Éditez `app.js` ou `app.go`

---

## 🎓 Apprendre progressivement

### Niveau 1 : Modifications simples
- Changer les couleurs dans `style.css`
- Modifier le titre dans `main.go`
- Ajouter des emojis d'humeur dans `index.html`

### Niveau 2 : Nouvelles fonctionnalités
- Ajouter un champ "Titre de l'entrée"
- Permettre d'ajouter des photos
- Créer un système de tags/catégories

### Niveau 3 : Fonctionnalités avancées
- Ajouter un mot de passe
- Exporter les entrées en PDF
- Créer des statistiques (humeur la plus fréquente, etc.)

---

## 🆘 Besoin d'aide ?

- Documentation Wails : https://wails.io/docs/introduction
- Forum Wails : https://github.com/wailsapp/wails/discussions
- Tutoriel Go : https://go.dev/tour/welcome/1

---

Bon courage et amusez-vous bien ! ✨
