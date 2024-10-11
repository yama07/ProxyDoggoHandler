import { type BrowserWindow, ipcMain } from "electron";

import { prefsStore } from "#/helpers/prefs-store";

import channels from "./channels";
import type { IpcHandler, Register, Unregister } from "./ipc-handler";

export const storeIpcHandler: IpcHandler = (bowserWindow: BrowserWindow) => {
  const webContents = bowserWindow.webContents;

  const unsubscribeFunctions: (() => void)[] = [];

  const register: Register = () => {
    ipcMain.handle(
      channels.store.getGeneralPreference,
      (): GeneralPreferenceType => prefsStore.get("general"),
    );

    ipcMain.on(channels.store.setGeneralPreference, (_, preference: GeneralPreferenceType) => {
      prefsStore.set("general", preference);
    });

    unsubscribeFunctions.push(
      prefsStore.onDidChange("general", (newValue, oldValue) => {
        webContents.send(channels.store.onGeneralPreferenceDidChange, newValue, oldValue);
      }),
    );

    ipcMain.handle(
      channels.store.getProxyPreference,
      (): ProxyPreferenceType => prefsStore.get("proxy"),
    );

    ipcMain.on(channels.store.setProxyPreference, (_, preference: ProxyPreferenceType) => {
      prefsStore.set("proxy", preference);
    });

    unsubscribeFunctions.push(
      prefsStore.onDidChange("proxy", (newValue, oldValue) => {
        webContents.send(channels.store.onProxyPreferenceDidChange, newValue, oldValue);
      }),
    );

    ipcMain.handle(
      channels.store.getUpstreamsPreference,
      (): UpstreamsPreferenceType => prefsStore.get("upstreams"),
    );

    ipcMain.on(channels.store.setUpstreamsPreference, (_, preference: UpstreamsPreferenceType) => {
      prefsStore.set("upstreams", preference);
    });

    unsubscribeFunctions.push(
      prefsStore.onDidChange("upstreams", (newValue, oldValue) => {
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
