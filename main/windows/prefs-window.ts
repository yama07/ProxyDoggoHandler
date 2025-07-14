import path from "node:path";
import { BrowserWindow, type BrowserWindowConstructorOptions } from "electron";
import windowStateKeeper from "electron-window-state";

import { platformUtils } from "#/helpers/platform-utils";
import { type IpcHandler, aggregateIpcHandlers } from "#/ipc/ipc-handler";

const PREFERENCES_PAGE_PATH = "/preferences/profiles";

let browserWindow: BrowserWindow | undefined;

const open = async (ipcHandlers?: IpcHandler[]) => {
  if (browserWindow !== undefined && !browserWindow.isDestroyed()) {
    browserWindow.show();
    browserWindow.focus();
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
  browserWindow = new BrowserWindow(browserOptions);

  windowState.manage(browserWindow);

  // レンダリングの準備完了後にウィンドウを表示する
  browserWindow.once("ready-to-show", () => browserWindow?.show());

  if (ipcHandlers !== undefined) {
    const { register, unregister } = aggregateIpcHandlers(browserWindow, ipcHandlers);
    register();
    browserWindow.once("closed", () => unregister());
  }

  if (platformUtils.isDevelopment) {
    const port = process.argv[2];
    await browserWindow.loadURL(`http://localhost:${port}${PREFERENCES_PAGE_PATH}`);
    browserWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    await browserWindow.loadURL(`app://.${PREFERENCES_PAGE_PATH}`);
  }
};

export const prefsWindow = {
  open,
};
