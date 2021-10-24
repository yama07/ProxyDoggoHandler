import { BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import isDev from "electron-is-dev";
import windowStateKeeper from "electron-window-state";
import path from "path";

export default async () => {
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
  const window = new BrowserWindow(browserOptions);

  windowState.manage(window);

  if (isDev) {
    const port = process.argv[2];
    await window.loadURL(`http://localhost:${port}/preferences`);
    window.webContents.openDevTools({ mode: "detach" });
  } else {
    await window.loadURL("app://./preferences.html");
  }
};
