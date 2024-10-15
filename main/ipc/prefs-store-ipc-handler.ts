import { type BrowserWindow, ipcMain } from "electron";

import { prefsStore } from "#/helpers/prefs-store";

import channels from "./channels";
import type { IpcHandler, Register, Unregister } from "./ipc-handler";

export const prefsStoreIpcHandler: IpcHandler = (bowserWindow: BrowserWindow) => {
  const webContents = bowserWindow.webContents;

  const unsubscribeFunctions: (() => void)[] = [];

  const register: Register = () => {
    ipcMain.handle(
      channels.prefsStore.getGeneral,
      (): GeneralPreferenceType => prefsStore.get("general"),
    );

    ipcMain.on(channels.prefsStore.setGeneral, (_, preference: GeneralPreferenceType) => {
      prefsStore.set("general", preference);
    });

    unsubscribeFunctions.push(
      prefsStore.onDidChange("general", (newValue, oldValue) => {
        webContents.send(channels.prefsStore.onGeneralDidChange, newValue, oldValue);
      }),
    );

    ipcMain.handle(
      channels.prefsStore.getProxy,
      (): ProxyPreferenceType => prefsStore.get("proxy"),
    );

    ipcMain.on(channels.prefsStore.setProxy, (_, preference: ProxyPreferenceType) => {
      prefsStore.set("proxy", preference);
    });

    unsubscribeFunctions.push(
      prefsStore.onDidChange("proxy", (newValue, oldValue) => {
        webContents.send(channels.prefsStore.onProxyDidChange, newValue, oldValue);
      }),
    );

    ipcMain.handle(
      channels.prefsStore.getUpstreams,
      (): UpstreamsPreferenceType => prefsStore.get("upstreams"),
    );

    ipcMain.on(channels.prefsStore.setUpstreams, (_, preference: UpstreamsPreferenceType) => {
      prefsStore.set("upstreams", preference);
    });

    unsubscribeFunctions.push(
      prefsStore.onDidChange("upstreams", (newValue, oldValue) => {
        webContents.send(channels.prefsStore.onUpstreamsDidChange, newValue, oldValue);
      }),
    );
  };

  const unregister: Unregister = () => {
    ipcMain.removeHandler(channels.prefsStore.getGeneral);
    ipcMain.removeAllListeners(channels.prefsStore.setGeneral);
    ipcMain.removeHandler(channels.prefsStore.getProxy);
    ipcMain.removeAllListeners(channels.prefsStore.setProxy);
    ipcMain.removeHandler(channels.prefsStore.getUpstreams);
    ipcMain.removeAllListeners(channels.prefsStore.setUpstreams);

    while (unsubscribeFunctions.length) {
      const unsubscribeFunc = unsubscribeFunctions.pop();
      unsubscribeFunc?.();
    }
  };

  return { register, unregister };
};
