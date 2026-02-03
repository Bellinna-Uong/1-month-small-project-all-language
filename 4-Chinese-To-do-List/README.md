# 新年快乐 - To-Do List 🏮 (Electron Version)

A beautiful desktop to-do list application with a Chinese New Year theme, built with **Electron** and **React**

## ✨ Features

- 🎨 Beautiful design inspired by Chinese New Year
- 🏮 Animated lanterns and falling flower petals
- ✅ Add, complete, and delete tasks
- 🔍 Filters: All / To Do / Completed
- 💾 Automatic saving in localStorage
- 📊 Real-time statistics
- 🖥️ Native desktop application with Electron

## 🛠️ Technologies

- **Desktop Framework**: Electron
- **Frontend**: React 18
- **Build**: Vite
- **Language**: 100% JavaScript
- **Styles**: Vanilla CSS with advanced animations
- **Fonts**: Noto Serif SC & Noto Sans SC (Google Fonts)

## 📋 Prerequisites

Only [Node.js](https://nodejs.org/) (version 16 or higher)

## 🚀 Installation

1. **Install dependencies**:

```bash
npm install
```

## 🎯 Usage

### Development Mode

```bash
npm run dev
```

This command launches Vite and Electron with hot-reload.

### Production Build

To create an executable for your system:

```bash
npm run package
```

Or for specific platforms:

```bash
npm run package:mac      # For macOS
npm run package:win      # For Windows
npm run package:linux    # For Linux
```

Executables will be created in the `release/` folder.

## 📁 Project Structure

```
chinese-new-year-todo/
├── main.js              # Electron entry point
├── package.json         # Configuration and dependencies
├── vite.config.js       # Vite configuration
├── index.html           # Main HTML page
├── main.jsx             # React entry point
├── App.jsx              # Main component
├── App.css              # Styles and animations
└── dist/                # Built files (generated)
```

## 🎨 Customization

### Colors

Colors are defined as CSS variables in `App.css`:

```css
:root {
  --red-primary: #D4161C;
  --red-dark: #8B0000;
  --gold-primary: #FFD700;
  --gold-light: #FFF4CC;
  --gold-dark: #B8860B;
}
```

### Application Icon

To change the icon:
1. Create an `assets/` folder
2. Add your icons:
   - `icon.icns` for macOS
   - `icon.ico` for Windows
   - `icon.png` for Linux

## 📱 Compatibility

- ✅ macOS (Intel & Apple Silicon)
- ✅ Windows (32-bit & 64-bit)
- ✅ Linux (Debian, Ubuntu, Fedora, etc.)

## 🐉 About

This application celebrates Chinese New Year with a design inspired by traditions:

- **福 (Fú)**: Happiness and luck on the lanterns
- **新年快乐**: "Happy New Year" in Mandarin
- **Red and gold colors**: Symbols of luck and prosperity
- **Dragon**: Symbol of power and good fortune

## 🔄 Migration from Wails

If you're coming from the Wails version:
- Same React code (App.jsx, App.css)
- Same features
- But with Electron instead of Go!

## 💡 Useful Commands

```bash
npm run dev          # Development with hot-reload
npm run build        # Build React assets
npm run electron     # Run Electron without Vite
npm run package      # Create an executable
```

## 📝 License

This project is free to use for your personal and commercial projects.

## 🙏 Thanks

Thank you for using this application! May this year bring prosperity and happiness to you! 🐉✨

---

**Happy New Year! Wishing you prosperity!** (新年快乐！恭喜发财！)
