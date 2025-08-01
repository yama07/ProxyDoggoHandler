import { type BrowserWindow, ipcMain } from "electron";
import { prefsStore } from "#/helpers/prefs-store";
import type { AppearancePreference } from "$/preference/appearancePreference";
import type { ProfilesPreference } from "$/preference/profilePreference";
import type { ProxyPreference } from "$/preference/proxyPreference";

import channels from "./channels";
import type { IpcHandler, Register, Unregister } from "./ipc-handler";

export const prefsStoreIpcHandler: IpcHandler = (bowserWindow: BrowserWindow) => {
  const webContents = bowserWindow.webContents;

  const unsubscribeFunctions: (() => void)[] = [];

  const register: Register = () => {
    ipcMain.handle(
      channels.prefsStore.getAppearance,
      (): AppearancePreference => prefsStore.get("appearance"),
    );

    ipcMain.on(channels.prefsStore.setAppearance, (_, preference: AppearancePreference) => {
      prefsStore.set("appearance", preference);
    });

    unsubscribeFunctions.push(
      prefsStore.onDidChange("appearance", (newValue, oldValue) => {
        webContents.send(channels.prefsStore.onAppearanceDidChange, newValue, oldValue);
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
      channels.prefsStore.getProfiles,
      (): ProfilesPreference => prefsStore.get("profiles"),
    );

    ipcMain.on(channels.prefsStore.setProfiles, (_, preference: ProfilesPreference) => {
      prefsStore.set("profiles", preference);
    });

    unsubscribeFunctions.push(
      prefsStore.onDidChange("profiles", (newValue, oldValue) => {
        webContents.send(channels.prefsStore.onProfilesDidChange, newValue, oldValue);
      }),
    );
  };

  const unregister: Unregister = () => {
    ipcMain.removeHandler(channels.prefsStore.getAppearance);
    ipcMain.removeAllListeners(channels.prefsStore.setAppearance);
    ipcMain.removeHandler(channels.prefsStore.getProxy);
    ipcMain.removeAllListeners(channels.prefsStore.setProxy);
    ipcMain.removeHandler(channels.prefsStore.getProfiles);
    ipcMain.removeAllListeners(channels.prefsStore.setProfiles);

    while (unsubscribeFunctions.length) {
      const unsubscribeFunc = unsubscribeFunctions.pop();
      unsubscribeFunc?.();
    }
  };

  return { register, unregister };
};
