// entry point

import {
  app,
  BrowserWindow,
  nativeTheme,
  Menu,
  MenuItemConstructorOptions,
} from "electron";

// enable sandboxing to comply with MacOS App Store requirements
app.enableSandbox();

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
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

  mainWindow.on("closed", () => {
    mainWindow = null;
    createApplicationMenu();
  });

  createApplicationMenu();
};

// Create the application menu with Window menu
const createApplicationMenu = () => {
  const template: MenuItemConstructorOptions[] = [
    {
      label: "Edit",
      submenu: [
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "delete" },
        { type: "separator" },
        { role: "selectAll" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "Window",
      role: "window",
      submenu: [
        {
          enabled: mainWindow == null,
          label: "New Window",
          click: () => {
            if (!mainWindow) {
              createWindow();
            } else {
              mainWindow.focus();
            }
          },
        },
        { type: "separator" },
        { role: "minimize" },
        { role: "zoom" },
        { type: "separator" },
        { role: "front" },
      ],
    },
  ];

  // On macOS, add the app menu
  if (process.platform === "darwin") {
    template.unshift({
      label: "LearnForge",
      submenu: [
        { role: "about", label: "About LearnForge" },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit", label: "Quit LearnForge" },
      ],
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
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
