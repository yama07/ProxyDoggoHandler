import { ipcMain } from "electron";

import type { Platform } from "$/platform";
import { platformUtils } from "#/helpers/platform-utils";

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
