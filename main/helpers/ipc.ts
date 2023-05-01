import { ipcMain } from "electron";
import { is } from "electron-util";

import {
  closePrefsWindow,
  isMaximizedPrefsWindow,
  maximizePrefsWindow,
  minimizePrefsWindow,
  onPrefsWindowMaximize,
  onPrefsWindowUnmaximize,
  sendMessage,
  unmaximizePrefsWindow,
} from "../windows/preferences-window";
import {
  getGeneralPreference,
  getProxyPreference,
  getUpstreamsPreference,
  onGeneralPreferenceDidChange,
  onProxyPreferenceDidChange,
  onUpstreamsPreferenceDidChange,
  setGeneralPreference,
  setProxyPreference,
  setUpstreamsPreference,
} from "./preferences";

const unsubscribeFunctions: (() => void)[] = [];

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

  unsubscribeFunctions.push(
    onGeneralPreferenceDidChange((newValue, oldValue) => {
      sendMessage("store.onGeneralPreferenceDidChange", newValue, oldValue);
    })
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

  unsubscribeFunctions.push(
    onProxyPreferenceDidChange((newValue, oldValue) => {
      sendMessage("store.onProxyPreferenceDidChange", newValue, oldValue);
    })
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

  unsubscribeFunctions.push(
    onUpstreamsPreferenceDidChange((newValue, oldValue) => {
      sendMessage("store.onUpstreamsPreferenceDidChange", newValue, oldValue);
    })
  );
};

export const finalizeIpc = () => {
  onPrefsWindowMaximize(undefined);
  onPrefsWindowUnmaximize(undefined);

  while (unsubscribeFunctions.length) {
    const unsubscribeFunc = unsubscribeFunctions.pop();
    unsubscribeFunc();
  }
};
