import { type BrowserWindow, ipcMain } from "electron";

import type { AppearancePreference } from "$/preference/appearancePreference";
import type { ProfilesPreference } from "$/preference/profilePreference";
import type { ProxyPreference } from "$/preference/proxyPreference";
import { prefsStore } from "#/helpers/prefs-store";

import channels from "./channels";
import type { IpcHandler, Register, Unregister } from "./ipc-handler";

export const prefsStoreIpcHandler: IpcHandler = (bowserWindow: BrowserWindow) => {
  const webContents = bowserWindow.webContents;

  const unsubscribeFunctions: (() => void)[] = [];

  const register: Register = () => {
    ipcMain.handle(
      channels.prefsStore.getGeneral,
      (): AppearancePreference => prefsStore.get("appearance"),
    );

    ipcMain.on(channels.prefsStore.setGeneral, (_, preference: AppearancePreference) => {
      prefsStore.set("appearance", preference);
    });

    unsubscribeFunctions.push(
      prefsStore.onDidChange("appearance", (newValue, oldValue) => {
        webContents.send(channels.prefsStore.onGeneralDidChange, newValue, oldValue);
      }),
    );

    ipcMain.handle(channels.prefsStore.getProxy, (): ProxyPreference => prefsStore.get("proxy"));

    ipcMain.on(channels.prefsStore.setProxy, (_, preference: ProxyPreference) => {
      prefsStore.set("proxy", preference);
    });

    unsubscribeFunctions.push(
      prefsStore.onDidChange("proxy", (newValue, oldValue) => {
        webContents.send(channels.prefsStore.onProxyDidChange, newValue, oldValue);
      }),
    );

    ipcMain.handle(
      channels.prefsStore.getUpstreams,
      (): ProfilesPreference => prefsStore.get("profiles"),
    );

    ipcMain.on(channels.prefsStore.setUpstreams, (_, preference: ProfilesPreference) => {
      prefsStore.set("profiles", preference);
    });

    unsubscribeFunctions.push(
      prefsStore.onDidChange("profiles", (newValue, oldValue) => {
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
