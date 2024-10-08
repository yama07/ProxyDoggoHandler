import path from "node:path";
import { BrowserWindow, type BrowserWindowConstructorOptions } from "electron";
import log from "electron-log";
import { is } from "electron-util";
import windowStateKeeper from "electron-window-state";

const PREFERENCES_PAGE_PATH = "/preferences/general";

let preferencesWindow: BrowserWindow | undefined;

let onPrefsWindowMaximizeListener: ((window: BrowserWindow) => void) | undefined;
let onPrefsWindowUnmaximizeListener: ((window: BrowserWindow) => void) | undefined;

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
      sandbox: true,
      preload: path.join(__dirname, "preload.js"),
    },
    show: false,
  };
  preferencesWindow = new BrowserWindow(browserOptions);

  windowState.manage(preferencesWindow);

  // レンダリングの準備完了後にウィンドウを表示する
  preferencesWindow.once("ready-to-show", () => preferencesWindow?.show());

  preferencesWindow.on("maximize", () => {
    log.debug("Prefs window is on maximize");
    if (preferencesWindow !== undefined) {
      onPrefsWindowMaximizeListener?.(preferencesWindow);
    }
  });
  preferencesWindow.on("unmaximize", () => {
    log.debug("Prefs window is on unmaximize");
    if (preferencesWindow !== undefined) {
      onPrefsWindowUnmaximizeListener?.(preferencesWindow);
    }
  });

  if (is.development) {
    const port = process.argv[2];
    await preferencesWindow.loadURL(`http://localhost:${port}${PREFERENCES_PAGE_PATH}`);
    preferencesWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    await preferencesWindow.loadURL(`app://.${PREFERENCES_PAGE_PATH}`);
  }
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
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

export const onPrefsWindowMaximize = (listener: typeof onPrefsWindowMaximizeListener) => {
  onPrefsWindowMaximizeListener = listener;
};

export const onPrefsWindowUnmaximize = (listener: typeof onPrefsWindowUnmaximizeListener) => {
  onPrefsWindowUnmaximizeListener = listener;
};
