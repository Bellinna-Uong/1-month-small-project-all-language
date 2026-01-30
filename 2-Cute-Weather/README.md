# Cute Weather (Electron)

A small desktop weather UI built with plain HTML/CSS/JavaScript and packaged with Electron.

## What it is
- Simple weather lookup UI that calls the OpenWeather API.
- Theme toggle (day/night) and small UI for humidity/wind.

## Prerequisites
- Node.js (v16+ recommended) and npm
- An OpenWeather API key: https://openweathermap.org/api

## Project layout
- `index.html`, `index.css`, `index.js` — renderer UI files
- `assets/` — images used by the app (icons, 404 image)

## Environment (.env)
1. Create a file named `.env` in the `2-Cute-Weather` folder (next to `package.json`).
2. Add your OpenWeather API key:

```
OPENWEATHER_API_KEY=your_api_key_here
```

3. Add `.env` to `.gitignore` to avoid committing secrets.

Note: The renderer code reads `process.env.OPENWEATHER_API_KEY`. To make this available you must load the `.env` file in the Electron main process (or pass the key to the renderer via preload/ipc). See the next section.

## Make the .env available to the app
Option A — Load in `main.js` (recommended simple approach):

1. Install `dotenv` in the project root:

```bash
npm install dotenv --save
```

2. In your Electron `main.js` (the entry script that starts the BrowserWindow), add at the very top:

```js
require('dotenv').config();
```

This will populate `process.env` on the main process. If your renderer relies on `process.env` directly, ensure `nodeIntegration` is enabled or pass the key to the renderer via `preload` or `ipcRenderer` (safer with `contextIsolation`).

Option B — Pass the key explicitly to the renderer (safer):
- Use a `preload.js` script that exposes a small API (e.g., `window.appConfig`) with the API key, or send it via `ipcMain`/`ipcRenderer`. This keeps `nodeIntegration` off and is the recommended secure approach.

## Install & Run (development)
From the `2-Cute-Weather` folder:

```bash
npm install
# If you don't have Electron installed as a dev dependency:
npm install --save-dev electron
# Run the app (example using npx):
npx electron .
```

If `package.json` contains a `start` script like `electron .`, you can run:

```bash
npm start
```

## Packaging (quick example)
Install `electron-packager` or `electron-builder`. Example with `electron-packager`:

```bash
npm install --save-dev electron-packager
npx electron-packager . CuteWeather --platform=win32 --arch=x64 --out=dist
```

Adjust `--platform`/`--arch` options for your target.

## Troubleshooting
- Nothing displays after search:
  - Check that `.env` contains `OPENWEATHER_API_KEY` and that it is loaded into the app (see "Make the .env available").
  - Open DevTools (right-click → Inspect) and check console/network for API errors.
- 404 image shows on load:
  - The app now hides the 404 and weather sections by default and reveals them after search. If you still see it, clear cache/restart Electron.

## Security note
- Do not commit `.env` or API keys to version control.
- For production, prefer using a secure backend to hide API keys or use the recommended Electron preload/ipc pattern rather than enabling `nodeIntegration` in renderer.