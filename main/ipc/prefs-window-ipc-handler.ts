import { type BrowserWindow, ipcMain } from "electron";

import channels from "./channels";
import type { IpcHandler } from "./ipc-handler";

const ipcHandler: IpcHandler = (bowserWindow: BrowserWindow) => {
  const webContents = bowserWindow.webContents;

  const onMaximizeListener = () => webContents.send(channels.prefWindow.onMaximize);
  const onUnmaximizeListener = () => webContents.send(channels.prefWindow.onUnmaximize);

  const register = () => {
    ipcMain.on(channels.prefWindow.close, () => bowserWindow.close());
    ipcMain.on(channels.prefWindow.maximize, () => bowserWindow.maximize());
    ipcMain.on(channels.prefWindow.unmaximize, () => bowserWindow.unmaximize());
    ipcMain.on(channels.prefWindow.minimize, () => bowserWindow.minimize());
    ipcMain.handle(channels.prefWindow.isMaximized, (): boolean => bowserWindow.isMaximized());
    bowserWindow.on("maximize", onMaximizeListener);
    bowserWindow.on("unmaximize", onUnmaximizeListener);
  };

  const unregister = () => {
    ipcMain.removeAllListeners(channels.prefWindow.close);
    ipcMain.removeAllListeners(channels.prefWindow.maximize);
    ipcMain.removeAllListeners(channels.prefWindow.unmaximize);
    ipcMain.removeAllListeners(channels.prefWindow.minimize);
    ipcMain.removeHandler(channels.prefWindow.isMaximized);
    bowserWindow.removeListener("maximize", onMaximizeListener);
    bowserWindow.removeListener("unmaximize", onUnmaximizeListener);
  };

  return { register, unregister };
};

export default ipcHandler;
