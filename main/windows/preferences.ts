import { BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import log from "electron-log";
import { is } from "electron-util";
import windowStateKeeper from "electron-window-state";
import path from "path";

let preferencesWindow: BrowserWindow | undefined;

let onPrefsWindowMaximizeListener: (window: BrowserWindow) => void | undefined;
let onPrefsWindowUnmaximizeListener: (
  window: BrowserWindow
) => void | undefined;

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
    titleBarStyle: "hidden",
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

  preferencesWindow.on("maximize", () => {
    log.debug("Prefs window is on maximize");
    if (onPrefsWindowMaximizeListener != undefined) {
      onPrefsWindowMaximizeListener(preferencesWindow);
    }
  });
  preferencesWindow.on("unmaximize", () => {
    log.debug("Prefs window is on unmaximize");
    if (onPrefsWindowUnmaximizeListener != undefined) {
      onPrefsWindowUnmaximizeListener(preferencesWindow);
    }
  });
};

export const sendMessage = (channel: string, ...args: any[]) => {
  if (!preferencesWindow || preferencesWindow.isDestroyed()) {
    return;
  }
  preferencesWindow?.webContents.send(channel, ...args);
};

export const closePrefsWindow = () => preferencesWindow?.close();

export const maximizePrefsWindow = () => preferencesWindow?.maximize();

export const unmaximizePrefsWindow = () => preferencesWindow?.unmaximize();

export const minimizePrefsWindow = () => preferencesWindow?.minimize();

export const isMaximizedPrefsWindow = () => preferencesWindow?.isMaximized();

export const onPrefsWindowMaximize = (
  listener: typeof onPrefsWindowMaximizeListener
) => (onPrefsWindowMaximizeListener = listener);

export const onPrefsWindowUnmaximize = (
  listener: typeof onPrefsWindowUnmaximizeListener
) => (onPrefsWindowUnmaximizeListener = listener);
