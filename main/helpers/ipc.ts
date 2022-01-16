import { ipcMain } from "electron";
import { is } from "electron-util";
import {
  closePrefsWindow,
  isMaximizedPrefsWindow,
  maximizePrefsWindow,
  minimizePrefsWindow,
  onPrefsWindowMaximize,
  onPrefsWindowUnmaximize,
  unmaximizePrefsWindow,
} from "../windows/preferences";
import {
  getGeneralPreference,
  setGeneralPreference,
  getProxyPreference,
  setProxyPreference,
  getUpstreamsPreference,
  setUpstreamsPreference,
} from "./preference-accessor";

export const initializeIpc = () => {
  ipcMain.handle("system.isMacos", (event): boolean => is.macos);

  ipcMain.handle("system.closePrefsWindow", (event) => closePrefsWindow());

  ipcMain.handle("system.maximizePrefsWindow", (event) =>
    maximizePrefsWindow()
  );

  ipcMain.handle("system.unmaximizePrefsWindow", (event) =>
    unmaximizePrefsWindow()
  );

  ipcMain.handle("system.minimizePrefsWindow", (event) =>
    minimizePrefsWindow()
  );

  ipcMain.handle("system.isMaximizedPrefsWindow", (event): boolean =>
    isMaximizedPrefsWindow()
  );

  onPrefsWindowMaximize((window) =>
    window.webContents.send("system.onPrefsWindowMaximize")
  );

  onPrefsWindowUnmaximize((window) =>
    window.webContents.send("system.onPrefsWindowUnmaximize")
  );

  ipcMain.handle(
    "store.getGeneralPreference",
    (event): GeneralPreferenceType => {
      return getGeneralPreference();
    }
  );

  ipcMain.handle(
    "store.setGeneralPreference",
    (event, preference: GeneralPreferenceType) => {
      setGeneralPreference(preference);
    }
  );

  ipcMain.handle("store.getProxyPreference", (event): ProxyPreferenceType => {
    return getProxyPreference();
  });

  ipcMain.handle(
    "store.setProxyPreference",
    (event, preference: ProxyPreferenceType) => {
      setProxyPreference(preference);
    }
  );

  ipcMain.handle(
    "store.getUpstreamsPreference",
    (event): UpstreamsPreferenceType => {
      return getUpstreamsPreference();
    }
  );

  ipcMain.handle(
    "store.setUpstreamsPreference",
    (event, preference: UpstreamsPreferenceType) => {
      setUpstreamsPreference(preference);
    }
  );
};
