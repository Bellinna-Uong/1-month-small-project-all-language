const { app, BrowserWindow, ipcMain } = require("electron");
require('dotenv').config();

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 320,
    height: 480,
    resizable: false,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    show: true, // ✅ la fenêtre s'affiche
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile("index.html");
}

ipcMain.on("close-app", () => {
  app.quit();
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  app.quit();
});
