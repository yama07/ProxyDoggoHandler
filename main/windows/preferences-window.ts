import path from "node:path";
import { BrowserWindow, type BrowserWindowConstructorOptions } from "electron";
import log from "electron-log";
import { is } from "electron-util";
import windowStateKeeper from "electron-window-state";
import { type IpcHandler, aggregateIpcHandlers } from "#/ipc/ipc-handler";

const PREFERENCES_PAGE_PATH = "/preferences/general";

let preferencesWindow: BrowserWindow | undefined;

export const openPrefsWindow = async (ipcHandlers?: IpcHandler[]) => {
  if (preferencesWindow !== undefined && !preferencesWindow.isDestroyed()) {
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

  if (ipcHandlers !== undefined) {
    const { register, unregister } = aggregateIpcHandlers(preferencesWindow, ipcHandlers);
    register();
    preferencesWindow.once("closed", () => unregister());
  }

  if (is.development) {
    const port = process.argv[2];
    await preferencesWindow.loadURL(`http://localhost:${port}${PREFERENCES_PAGE_PATH}`);
    preferencesWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    await preferencesWindow.loadURL(`app://.${PREFERENCES_PAGE_PATH}`);
  }
};
