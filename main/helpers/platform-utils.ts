import { app } from "electron";

import type { Platform } from "$/platform";

const isProduction: boolean = app.isPackaged;
const isDevelopment: boolean = !isProduction;

const isWindows: boolean = process.platform === "win32";
const isMacos: boolean = process.platform === "darwin";
const isLinux: boolean = process.platform === "linux";

const platform: Platform = isWindows ? "windows" : isMacos ? "macos" : "linux";

export const platformUtils = {
  isProduction,
  isDevelopment,
  isWindows,
  isMacos,
  isLinux,
  platform,
};
