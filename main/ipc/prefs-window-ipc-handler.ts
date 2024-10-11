import { type BrowserWindow, ipcMain } from "electron";

import channels from "./channels";
import type { IpcHandler } from "./ipc-handler";

export const prefsWindowIpcHandler: IpcHandler = (bowserWindow: BrowserWindow) => {
  const webContents = bowserWindow.webContents;

  const onMaximizeListener = () => webContents.send(channels.prefsWindow.onMaximize);
  const onUnmaximizeListener = () => webContents.send(channels.prefsWindow.onUnmaximize);

  const register = () => {
    ipcMain.on(channels.prefsWindow.close, () => bowserWindow.close());
    ipcMain.on(channels.prefsWindow.maximize, () => bowserWindow.maximize());
    ipcMain.on(channels.prefsWindow.unmaximize, () => bowserWindow.unmaximize());
    ipcMain.on(channels.prefsWindow.minimize, () => bowserWindow.minimize());
    ipcMain.handle(channels.prefsWindow.isMaximized, (): boolean => bowserWindow.isMaximized());
    bowserWindow.on("maximize", onMaximizeListener);
    bowserWindow.on("unmaximize", onUnmaximizeListener);
  };

  const unregister = () => {
    ipcMain.removeAllListeners(channels.prefsWindow.close);
    ipcMain.removeAllListeners(channels.prefsWindow.maximize);
    ipcMain.removeAllListeners(channels.prefsWindow.unmaximize);
    ipcMain.removeAllListeners(channels.prefsWindow.minimize);
    ipcMain.removeHandler(channels.prefsWindow.isMaximized);
    bowserWindow.removeListener("maximize", onMaximizeListener);
    bowserWindow.removeListener("unmaximize", onUnmaximizeListener);
  };

  return { register, unregister };
};
