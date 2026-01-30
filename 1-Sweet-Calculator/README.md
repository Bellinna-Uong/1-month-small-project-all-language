# Sweet Calculator

A small, single-page calculator built with plain HTML, CSS and JavaScript.

## What it is
- Simple calculator UI for basic arithmetic operations.
- Minimal dependencies, intended as a small learning project.

## Files
- `index.html` — main markup
- `style.css` — styles
- `script.js` — calculator logic
- `main.js` / `package.json` — (optional) included if you want to run inside Electron or via npm scripts

## Prerequisites
- A modern web browser (Chrome, Edge, Firefox)
- Optional: Node.js and npm if you want to run a local static server or package with Electron

## Run locally (quick)
- Option A — Open in browser:
  - Double-click `index.html` or open it in your browser.

- Option B — Run a local static server 

```bash
# using npm package 'http-server'
npx http-server .
# or using 'serve'
npx serve .
```
Then open the URL shown by the server (usually `http://localhost:8080`).

- Option C — If a `start` script exists in `package.json` you can try:

```bash
npm install
npm start
```

## Run inside Electron (optional)
If you want to package or run this as a desktop app with Electron:
1. Install Electron in the folder:

```bash
npm install --save-dev electron
```

2. Add or confirm a `main` entry in `package.json` (e.g., `main.js`) and a start script such as:

```json
"scripts": {
  "start": "electron ."
}
```

3. Run:

```bash
npm start
```

## Development notes
- The UI is intentionally small and simple; feel free to extend features (keyboard input, decimal handling, keyboard shortcuts).
- If you plan to publish this project, add a `.gitignore` and include `node_modules/`.

If you want, I can:
- Add a small README badge and license file.
- Add a `start` script to `package.json` if you want a specific npm workflow.
