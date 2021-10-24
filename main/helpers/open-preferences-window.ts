import { BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import isDev from "electron-is-dev";
import windowStateKeeper from "electron-window-state";
import path from "path";

let preferencesWindow: BrowserWindow | null = null;

export default async () => {
  if (preferencesWindow != null && !preferencesWindow.isDestroyed()) {
    preferencesWindow.show();
    preferencesWindow.focus();
    return;
  }
  const windowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 600,
  });

  const browserOptions: BrowserWindowConstructorOptions = {
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
    minWidth: 1000,
    minHeight: 600,
    titleBarStyle: "hidden",
    webPreferences: {
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  };
  preferencesWindow = new BrowserWindow(browserOptions);

  windowState.manage(preferencesWindow);

  if (isDev) {
    const port = process.argv[2];
    await preferencesWindow.loadURL(`http://localhost:${port}/preferences`);
    preferencesWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    await preferencesWindow.loadURL("app://./preferences.html");
  }
};
