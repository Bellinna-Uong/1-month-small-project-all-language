# 📖 Mon Journal Intime - Application Wails

Une adorable application de journal intime style années 2000 construite avec **Wails** (Go + TypeScript/JavaScript).

## 🌟 Fonctionnalités

- ✍️ Écrire une entrée de journal pour chaque jour
- 😊 Choisir son humeur parmi 6 émojis
- 💾 Sauvegarde automatique sur votre ordinateur
- 📚 Consulter toutes vos entrées passées
- 🎨 Design mignon style années 2000 avec couleurs pastel

## 📋 Prérequis

Avant de commencer, vous devez installer :

1. **Go** (version 1.21 ou supérieure) : https://go.dev/dl/
2. **Wails CLI** : 
   ```bash
   go install github.com/wailsapp/wails/v2/cmd/wails@latest
   ```
3. **Node.js** et **npm** (pour TypeScript, optionnel car j'ai fourni le JS compilé)

## 🚀 Installation et lancement

### Étape 1 : Télécharger le projet
Placez tous les fichiers dans un dossier nommé `journal-app`.

### Étape 2 : Installer les dépendances Go
Ouvrez un terminal dans le dossier `journal-app` et exécutez :
```bash
go mod tidy
```
Cette commande télécharge toutes les dépendances Go nécessaires.

### Étape 3 : Lancer l'application en mode développement
```bash
wails dev
```
Cette commande compile et lance l'application. Une petite fenêtre mignonne devrait s'ouvrir !

### Étape 4 : Construire l'application (optionnel)
Pour créer un fichier exécutable :
```bash
wails build
```
L'exécutable sera dans le dossier `build/bin/`.

## 🔍 Explication détaillée du code

### 📂 Structure du projet

```
journal-app/
├── main.go              # Point d'entrée de l'application
├── app.go               # Logique backend (sauvegarde/chargement)
├── go.mod               # Dépendances Go
└── frontend/
    ├── dist/            # Fichiers compilés pour l'interface
    │   ├── index.html   # Structure HTML
    │   ├── style.css    # Styles années 2000
    │   └── app.js       # Logique JavaScript
    └── src/
        └── app.ts       # Code TypeScript original
```

---

## 📝 Explication ligne par ligne

### 1️⃣ **main.go** - Le point d'entrée

```go
package main
```
- Déclare que ce fichier appartient au package principal (le programme principal).

```go
import (
	"embed"
	"log"
	"github.com/wailsapp/wails/v2"
	// ...
)
```
- Importe les bibliothèques nécessaires :
  - `embed` : Pour intégrer les fichiers frontend dans l'exécutable
  - `log` : Pour afficher les erreurs
  - `wails/v2` : Le framework principal

```go
//go:embed all:frontend/dist
var assets embed.FS
```
- Cette ligne **magique** dit à Go d'inclure tous les fichiers du dossier `frontend/dist` dans l'exécutable final
- `embed.FS` crée un système de fichiers virtuel contenant vos fichiers HTML/CSS/JS

```go
func main() {
	app := NewApp()
```
- Crée une nouvelle instance de votre application (définie dans `app.go`)

```go
	err := wails.Run(&options.App{
		Title:  "Mon Journal ♡",
		Width:  500,  // Largeur de 500 pixels
		Height: 650,  // Hauteur de 650 pixels
```
- Configure la fenêtre de l'application
- `Width` et `Height` définissent la taille de la fenêtre (petit format pour un journal intime)

```go
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
```
- Dit à Wails où trouver vos fichiers HTML/CSS/JS (dans `assets` défini plus haut)

```go
		OnStartup: app.startup,
```
- Indique quelle fonction appeler au démarrage (la fonction `startup` dans `app.go`)

```go
		Bind: []interface{}{
			app,
		},
```
- **TRÈS IMPORTANT** : Expose les méthodes de `app` au JavaScript
- Cela permet au frontend d'appeler `SaveEntry`, `LoadAllEntries`, etc.

---

### 2️⃣ **app.go** - La logique backend

```go
type App struct {
	ctx context.Context
}
```
- Définit la structure `App` qui contient le contexte de l'application

```go
type JournalEntry struct {
	Date    string `json:"date"`
	Content string `json:"content"`
	Mood    string `json:"mood"`
}
```
- Définit la structure d'une entrée de journal :
  - `Date` : La date (format YYYY-MM-DD)
  - `Content` : Le texte écrit
  - `Mood` : L'emoji de l'humeur
- Le `json:"date"` indique comment cette structure sera convertie en JSON

```go
func (a *App) getDataDir() string {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		homeDir = "."
	}
	return filepath.Join(homeDir, ".mon-journal")
}
```
- Trouve le dossier personnel de l'utilisateur (ex: `/home/utilisateur` ou `C:\Users\utilisateur`)
- Crée le chemin vers `.mon-journal` (un dossier caché pour sauvegarder vos données)

```go
func (a *App) SaveEntry(entry JournalEntry) error {
	entries, err := a.LoadAllEntries()
	if err != nil {
		entries = []JournalEntry{}
	}
```
- Charge d'abord toutes les entrées existantes
- Si le fichier n'existe pas, crée une liste vide

```go
	// Si la date existe déjà, mettre à jour l'entrée
	found := false
	for i, e := range entries {
		if e.Date == entry.Date {
			entries[i] = entry
			found = true
			break
		}
	}
```
- Parcourt toutes les entrées
- Si une entrée avec la même date existe, la remplace
- Sinon, on ajoutera une nouvelle entrée

```go
	data, err := json.MarshalIndent(entries, "", "  ")
```
- Convertit la liste d'entrées en JSON formaté (facile à lire)
- Les `"  "` ajoutent une indentation de 2 espaces

```go
	return os.WriteFile(a.getFilePath(), data, 0644)
```
- Écrit le JSON dans le fichier
- `0644` = permissions (lecture/écriture pour vous, lecture pour les autres)

```go
func (a *App) LoadAllEntries() ([]JournalEntry, error) {
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		return []JournalEntry{}, nil
	}
```
- Vérifie si le fichier existe
- Si non, retourne une liste vide (pas d'erreur)

```go
	data, err := os.ReadFile(filePath)
	// ...
	var entries []JournalEntry
	if err := json.Unmarshal(data, &entries); err != nil {
		return nil, err
	}
```
- Lit le fichier
- Convertit le JSON en liste d'entrées Go

---

### 3️⃣ **app.ts/app.js** - La logique frontend

```javascript
let currentMood = '😊';
let currentDate = '';
```
- Variables globales pour stocker l'humeur sélectionnée et la date du jour

```javascript
function formatDate(date) {
	const days = ['Dimanche', 'Lundi', ...];
	const months = ['janvier', 'février', ...];
	// ...
	return `${dayName} ${day} ${month} ${year}`;
}
```
- Convertit une date JavaScript en texte français lisible
- Ex: "Lundi 3 février 2026"

```javascript
async function saveEntry() {
	const textArea = document.getElementById('journalText');
	const content = textArea?.value || '';
```
- Récupère le texte tapé dans la zone de texte
- `?.` = "opérateur optionnel" : évite une erreur si `textArea` est null

```javascript
	const entry = {
		date: currentDate,
		content: content,
		mood: currentMood
	};
```
- Crée un objet JavaScript représentant l'entrée

```javascript
	await window.go.main.App.SaveEntry(entry);
```
- **MAGIE** : Appelle la fonction Go `SaveEntry` depuis JavaScript !
- Wails crée automatiquement `window.go.main.App` pour accéder à vos fonctions Go
- `await` attend que la sauvegarde soit terminée avant de continuer

```javascript
async function loadTodayEntry() {
	const entry = await window.go.main.App.GetTodayEntry();
	
	if (entry) {
		const textArea = document.getElementById('journalText');
		textArea.value = entry.content;
		currentMood = entry.mood;
		updateMoodSelection();
	}
}
```
- Appelle la fonction Go pour récupérer l'entrée d'aujourd'hui
- Si elle existe, remplit la zone de texte avec le contenu sauvegardé
- Met à jour l'humeur sélectionnée

```javascript
function init() {
	const today = new Date();
	currentDate = getDateString(today);
	// ...
	loadTodayEntry();
	// ...
	const saveBtn = document.getElementById('saveBtn');
	saveBtn.addEventListener('click', saveEntry);
}
```
- Fonction d'initialisation appelée au démarrage
- Récupère la date du jour
- Charge l'entrée existante s'il y en a une
- Attache les événements aux boutons (clic sur Sauvegarder → appelle `saveEntry()`)

---

### 4️⃣ **index.html** - La structure

```html
<div class="mood-buttons">
	<button class="mood-btn" data-mood="😊">😊</button>
	<!-- ... -->
</div>
```
- Les boutons d'humeur stockent l'emoji dans `data-mood`
- JavaScript lit cet attribut quand vous cliquez

```html
<textarea id="journalText" maxlength="5000"></textarea>
```
- Zone de texte pour écrire
- `maxlength="5000"` limite à 5000 caractères

```html
<div class="history-panel" id="historyPanel">
	<!-- ... -->
</div>
```
- Panel qui apparaît de la droite pour afficher l'historique

---

### 5️⃣ **style.css** - Le style années 2000

```css
body {
	font-family: 'Comic Sans MS', 'Chalkboard SE', cursive;
	background: linear-gradient(135deg, #ffd4e5 0%, #c9f0ff 50%, #ffd4ff 100%);
}
```
- Police Comic Sans = très années 2000 !
- Dégradé de couleurs pastel rose-bleu-violet

```css
.header {
	background: linear-gradient(135deg, #ffb3d9 0%, #ffd4e5 100%);
	border: 3px solid #ff99cc;
	box-shadow: 0 4px 8px rgba(255, 105, 180, 0.3);
}
```
- Dégradé rose pour l'en-tête
- Bordure rose
- Ombre portée pour l'effet 3D

```css
.mood-btn.selected {
	transform: scale(1.15);
}
```
- Agrandit légèrement le bouton d'humeur sélectionné

```css
.history-panel {
	transform: translateX(100%);
	transition: transform 0.3s ease;
}

.history-panel.show {
	transform: translateX(0);
}
```
- Le panel d'historique est initialement hors de l'écran (à droite)
- Quand on ajoute la classe `show`, il glisse vers la gauche

---

## 🎯 Comment ça fonctionne ensemble

1. **Au démarrage** :
   - `main.go` lance Wails
   - Wails ouvre une fenêtre et charge `index.html`
   - JavaScript appelle `init()` qui appelle `loadTodayEntry()`
   - `loadTodayEntry()` appelle la fonction Go `GetTodayEntry()`
   - Go lit le fichier JSON et retourne l'entrée
   - JavaScript affiche l'entrée dans l'interface

2. **Quand vous cliquez sur Sauvegarder** :
   - JavaScript récupère le texte et l'humeur
   - Appelle la fonction Go `SaveEntry()`
   - Go met à jour le fichier JSON sur votre disque dur
   - JavaScript affiche un message de confirmation

3. **Quand vous consultez l'historique** :
   - JavaScript appelle `LoadAllEntries()`
   - Go lit tout le fichier JSON
   - JavaScript affiche toutes les entrées dans le panel

---

## 💾 Où sont sauvegardées vos données ?

Les entrées sont sauvegardées dans :
- **Linux/Mac** : `/home/votre-nom/.mon-journal/entries.json`
- **Windows** : `C:\Users\votre-nom\.mon-journal\entries.json`

Le fichier `entries.json` ressemble à ça :
```json
[
  {
    "date": "2026-02-03",
    "content": "Aujourd'hui j'ai passé une super journée !",
    "mood": "😊"
  },
  {
    "date": "2026-02-02",
    "content": "Un peu fatigué aujourd'hui...",
    "mood": "😴"
  }
]
```

---

## 🎨 Personnalisation

### Changer la taille de la fenêtre
Dans `main.go`, modifiez :
```go
Width:  500,  // Changez ce nombre
Height: 650,  // Changez ce nombre
```

### Changer les couleurs
Dans `style.css`, modifiez les valeurs hexadécimales :
```css
background: linear-gradient(135deg, #ffd4e5 0%, #c9f0ff 50%, #ffd4ff 100%);
```

### Ajouter plus d'humeurs
1. Dans `index.html`, ajoutez un bouton :
```html
<button class="mood-btn" data-mood="🎉" title="Excité">🎉</button>
```

---

## 🐛 Résolution des problèmes

### L'application ne se lance pas
- Vérifiez que Go est installé : `go version`
- Vérifiez que Wails est installé : `wails version`
- Exécutez `go mod tidy` pour installer les dépendances

### Les données ne se sauvent pas
- Vérifiez les permissions du dossier `.mon-journal`
- Regardez les erreurs dans la console du terminal

### Le style ne s'affiche pas
- Vérifiez que `style.css` est dans `frontend/dist/`
- Assurez-vous que `index.html` a la bonne balise `<link>`

---

## 📚 Pour aller plus loin

- **Documentation Wails** : https://wails.io/docs/introduction
- **Tutoriel Go** : https://go.dev/tour/
- **TypeScript** : https://www.typescriptlang.org/docs/

---

## ❤️ Amusez-vous bien avec votre journal !

N'hésitez pas à personnaliser l'application selon vos goûts. Vous pouvez :
- Ajouter des photos
- Créer des catégories (humeur, activités, etc.)
- Ajouter un mot de passe
- Exporter vos entrées en PDF

Bonne écriture ! ✨
