// entry point

import { app, BrowserWindow } from "electron";

// enable sandboxing to comply with MacOS App Store requirements
app.enableSandbox();

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
    },

    width: 1000,
    height: 600,
    autoHideMenuBar: true,
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile("dist/index.html");
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
