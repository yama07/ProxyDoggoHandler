import { ipcMain } from "electron";
import { is } from "electron-util";

import channels from "./channels";
import type { IpcHandler, Register, Unregister } from "./ipc-handler";

export const systemIpcHandler: IpcHandler = () => {
  const register: Register = () => {
    ipcMain.handle(channels.system.platform, (): "windows" | "macos" | "linux" => {
      if (is.windows) return "windows";
      if (is.macos) return "macos";
      return "linux";
    });
  };

  const unregister: Unregister = () => {
    ipcMain.removeHandler(channels.system.platform);
  };

  return { register, unregister };
};
