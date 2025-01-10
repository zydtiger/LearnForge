// entry point

import { app, BrowserWindow, nativeTheme } from "electron";

// enable sandboxing to comply with MacOS App Store requirements
app.enableSandbox();

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
    },

    title: "LearnForge",
    width: 1000,
    height: 600,
    autoHideMenuBar: true,
    backgroundColor: nativeTheme.shouldUseDarkColors ? "#070707" : "#f6f6f6",
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
