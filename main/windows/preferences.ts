import { BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import { is } from "electron-util";
import windowStateKeeper from "electron-window-state";
import path from "path";

let preferencesWindow: BrowserWindow | undefined;

export const openPrefsWindow = async () => {
  if (preferencesWindow && !preferencesWindow.isDestroyed()) {
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
    titleBarStyle: is.macos ? "hidden" : "default",
    title: "環境設定 | Proxy Doggo Handler",
    webPreferences: {
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  };
  preferencesWindow = new BrowserWindow(browserOptions);

  windowState.manage(preferencesWindow);

  if (is.development) {
    const port = process.argv[2];
    await preferencesWindow.loadURL(
      `http://localhost:${port}/preferences/general`
    );
    preferencesWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    await preferencesWindow.loadURL("app://./preferences/general");
  }
};
