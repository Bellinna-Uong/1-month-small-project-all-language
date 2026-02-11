# Love Potion Sweeper 💕

A romantic twist on the classic Minesweeper game! Instead of avoiding bombs, you must avoid magical love potions while uncovering safe hearts.

## Features

- 🎯 **4 Difficulty Levels**: Easy, Medium, Hard, and Expert
- ⏱️ **Timer**: Track your completion time
- 🚩 **Flag System**: Mark suspected love potions
- 💖 **Romantic Theme**: Beautiful pink and red color scheme
- 📊 **Statistics**: Track clicks, time, and remaining flags

## Requirements

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Neutralino CLI](https://neutralino.js.org/)

## Installation

1. **Install Neutralino CLI globally:**
   ```bash
   npm install -g @neutralinojs/neu
   ```

2. **Navigate to the project directory:**
   ```bash
   cd love-potion-sweeper
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

## Running the Game

### Development Mode

```bash
npm run dev
```

or

```bash
neu run
```

### Build for Production

```bash
npm run build
```

This will create executables for your platform in the `dist` folder.

## How to Play

- **Left Click**: Reveal a cell
- **Right Click**: Flag a suspected love potion
- **Goal**: Reveal all safe hearts without clicking on any love potions!

### Difficulty Levels

- **Easy**: 8×8 grid, 10 potions
- **Medium**: 12×12 grid, 25 potions
- **Hard**: 16×16 grid, 50 potions
- **Expert**: 20×20 grid, 80 potions

## Project Structure

```
love-potion-sweeper/
├── resources/
│   ├── index.html              # Main HTML file
│   └── love-potion-sweeper.jsx # React game component
├── neutralino.config.json      # Neutralino configuration
├── package.json                # NPM configuration
└── README.md                   # This file
```

## Technologies Used

- **React 18**: UI framework
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **Neutralino.js**: Cross-platform desktop app framework
