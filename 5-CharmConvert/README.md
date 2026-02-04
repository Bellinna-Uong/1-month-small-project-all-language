# 🌟 Convertisseur d'Unités - NeutralinoJS

Un convertisseur d'unités simple et mignon avec une interface moderne ! ✨

## 📋 Fonctionnalités

- **📏 Distance** : mètres, kilomètres, miles, pieds, pouces, etc.
- **⚖️ Poids** : kilogrammes, grammes, livres, onces, etc.
- **🧪 Volume** : litres, millilitres, gallons, tasses, etc.
- **🌡️ Température** : Celsius, Fahrenheit, Kelvin

## 🚀 Installation

### Prérequis
- Node.js installé sur votre système
- NeutralinoJS CLI

### Étapes d'installation

1. **Installer NeutralinoJS CLI** (si pas déjà fait) :
```bash
npm install -g @neutralinojs/neu
```

2. **Télécharger les binaires NeutralinoJS** :
```bash
neu update
```

## 💻 Utilisation

### Lancer l'application en mode développement :
```bash
neu run
```

### Construire l'application :
```bash
neu build
```

Les fichiers construits seront dans le dossier `dist/`.

## 📁 Structure du projet

```
unit-converter/
├── neutralino.config.json    # Configuration NeutralinoJS
├── resources/
│   ├── index.html            # Page principale
│   ├── styles/
│   │   └── main.css          # Styles CSS
│   └── js/
│       ├── converter.js      # Logique de conversion
│       ├── main.js           # Application principale
│       └── neutralino.js     # Bibliothèque NeutralinoJS (auto-généré)
└── README.md
```

## 🎨 Fonctionnalités de l'interface

- **Interface responsive** : s'adapte à toutes les tailles d'écran
- **Animations douces** : transitions fluides et animations sympathiques
- **Bouton d'inversion** : échange facilement les unités
- **Conversion bidirectionnelle** : convertissez dans les deux sens
- **Résultats en temps réel** : mise à jour instantanée

## 🧮 Conversions disponibles

### Distance
- Mètre, Kilomètre, Centimètre, Millimètre
- Mile, Yard, Pied, Pouce
- Mile nautique

### Poids
- Kilogramme, Gramme, Milligramme, Tonne
- Livre, Once, Stone

### Volume
- Litre, Millilitre, Mètre cube, Centimètre cube
- Gallon, Quart, Pinte, Tasse
- Once liquide, Cuillère à soupe, Cuillère à café

### Température
- Celsius (°C)
- Fahrenheit (°F)
- Kelvin (K)

## 🛠️ Personnalisation

Vous pouvez facilement ajouter de nouvelles unités en modifiant le fichier `resources/js/converter.js` dans l'objet `unitDefinitions`.

## 📝 Notes

- L'application utilise NeutralinoJS pour créer une application native légère
- Toutes les conversions sont effectuées côté client
- Précision jusqu'à 6 décimales

## 💝 Fait avec

- NeutralinoJS
- JavaScript vanilla
- CSS3 avec animations

Profitez de votre convertisseur ! 🎉
