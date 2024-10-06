import { type BrowserWindow, ipcMain } from "electron";

import preferences from "#/helpers/preferences";

import channels from "./channels";
import type { IpcHandler, Register, Unregister } from "./ipc-handler";

const ipcHandler: IpcHandler = (bowserWindow: BrowserWindow) => {
  const webContents = bowserWindow.webContents;

  const unsubscribeFunctions: (() => void)[] = [];

  const register: Register = () => {
    ipcMain.handle(
      channels.store.getGeneralPreference,
      (): GeneralPreferenceType => preferences.get("general"),
    );

    ipcMain.on(channels.store.setGeneralPreference, (_, preference: GeneralPreferenceType) => {
      preferences.set("general", preference);
    });

    unsubscribeFunctions.push(
      preferences.onDidChange("general", (newValue, oldValue) => {
        webContents.send(channels.store.onGeneralPreferenceDidChange, newValue, oldValue);
      }),
    );

    ipcMain.handle(
      channels.store.getProxyPreference,
      (): ProxyPreferenceType => preferences.get("proxy"),
    );

    ipcMain.on(channels.store.setProxyPreference, (_, preference: ProxyPreferenceType) => {
      preferences.set("proxy", preference);
    });

    unsubscribeFunctions.push(
      preferences.onDidChange("proxy", (newValue, oldValue) => {
        webContents.send(channels.store.onProxyPreferenceDidChange, newValue, oldValue);
      }),
    );

    ipcMain.handle(
      channels.store.getUpstreamsPreference,
      (): UpstreamsPreferenceType => preferences.get("upstreams"),
    );

    ipcMain.on(channels.store.setUpstreamsPreference, (_, preference: UpstreamsPreferenceType) => {
      preferences.set("upstreams", preference);
    });

    unsubscribeFunctions.push(
      preferences.onDidChange("upstreams", (newValue, oldValue) => {
        webContents.send(channels.store.onUpstreamsPreferenceDidChange, newValue, oldValue);
      }),
    );
  };

  const unregister: Unregister = () => {
    ipcMain.removeHandler(channels.store.getGeneralPreference);
    ipcMain.removeAllListeners(channels.store.setGeneralPreference);
    ipcMain.removeHandler(channels.store.getProxyPreference);
    ipcMain.removeAllListeners(channels.store.setProxyPreference);
    ipcMain.removeHandler(channels.store.getUpstreamsPreference);
    ipcMain.removeAllListeners(channels.store.setUpstreamsPreference);

    while (unsubscribeFunctions.length) {
      const unsubscribeFunc = unsubscribeFunctions.pop();
      unsubscribeFunc?.();
    }
  };

  return { register, unregister };
};

export default ipcHandler;
