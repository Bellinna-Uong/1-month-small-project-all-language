const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 320, 
    height: 480,
    resizable: false, 
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile('index.html');
  win.setMenuBarVisibility(false); 
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});