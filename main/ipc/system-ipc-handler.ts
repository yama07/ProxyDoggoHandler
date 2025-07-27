import { ipcMain } from "electron";

import { platformUtils } from "#/helpers/platform-utils";
import type { Platform } from "$/platform";

import channels from "./channels";
import type { IpcHandler, Register, Unregister } from "./ipc-handler";

export const systemIpcHandler: IpcHandler = () => {
  const register: Register = () => {
    ipcMain.handle(channels.system.platform, (): Platform => platformUtils.platform);
  };

  const unregister: Unregister = () => {
    ipcMain.removeHandler(channels.system.platform);
  };

  return { register, unregister };
};
