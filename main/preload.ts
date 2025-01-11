import { contextBridge, ipcRenderer } from "electron";

import type { AppearancePreference } from "$/preference/appearancePreference";
import type { ProfilesPreference } from "$/preference/profilePreference";
import type { ProxyPreference } from "$/preference/proxyPreference";

import channels from "./ipc/channels";

const systemApi = {
  isMacos: (): Promise<boolean> => ipcRenderer.invoke(channels.system.isMacos),
};
export type SystemApi = typeof systemApi;
contextBridge.exposeInMainWorld("system", systemApi);

const prefsWindowApi = {
  close: () => ipcRenderer.send(channels.prefsWindow.close),
  maximize: () => ipcRenderer.send(channels.prefsWindow.maximize),
  unmaximize: () => ipcRenderer.send(channels.prefsWindow.unmaximize),
  minimize: () => ipcRenderer.send(channels.prefsWindow.minimize),
  isMaximized: (): Promise<boolean> => ipcRenderer.invoke(channels.prefsWindow.isMaximized),
  onMaximize: (callback?: () => void) => {
    if (callback === undefined) {
      ipcRenderer.removeAllListeners(channels.prefsWindow.onMaximize);
    } else {
      ipcRenderer.on(channels.prefsWindow.onMaximize, callback);
    }
  },
  onUnmaximize: (callback?: () => void) => {
    if (callback === undefined) {
      ipcRenderer.removeAllListeners(channels.prefsWindow.onUnmaximize);
    } else {
      ipcRenderer.on(channels.prefsWindow.onUnmaximize, callback);
    }
  },
};
export type PrefsWindowApi = typeof prefsWindowApi;
contextBridge.exposeInMainWorld("prefsWindow", prefsWindowApi);

const prefsStoreApi = {
  getAppearance: (): Promise<AppearancePreference> =>
    ipcRenderer.invoke(channels.prefsStore.getGeneral),
  setGeneral: (preference: AppearancePreference) =>
    ipcRenderer.send(channels.prefsStore.setGeneral, preference),
  onGeneralDidChange: (
    callback?: (newValue: AppearancePreference, oldValue: AppearancePreference) => void,
  ) => {
    if (callback === undefined) {
      ipcRenderer.removeAllListeners(channels.prefsStore.onGeneralDidChange);
    } else {
      ipcRenderer.on(channels.prefsStore.onGeneralDidChange, (_, newValue, oldValue) =>
        callback(newValue, oldValue),
      );
    }
  },

  getProxy: (): Promise<ProxyPreference> => ipcRenderer.invoke(channels.prefsStore.getProxy),
  setProxy: (preference: ProxyPreference) =>
    ipcRenderer.send(channels.prefsStore.setProxy, preference),
  onProxyDidChange: (callback?: (newValue: ProxyPreference, oldValue: ProxyPreference) => void) => {
    if (callback === undefined) {
      ipcRenderer.removeAllListeners(channels.prefsStore.onProxyDidChange);
    } else {
      ipcRenderer.on(channels.prefsStore.onProxyDidChange, (_, newValue, oldValue) =>
        callback(newValue, oldValue),
      );
    }
  },

  getUpstreams: (): Promise<ProfilesPreference> =>
    ipcRenderer.invoke(channels.prefsStore.getUpstreams),
  setUpstreams: (preference: ProfilesPreference) =>
    ipcRenderer.send(channels.prefsStore.setUpstreams, preference),
  onUpstreamsDidChange: (
    callback?: (newValue: ProfilesPreference, oldValue: ProfilesPreference) => void,
  ) => {
    if (callback === undefined) {
      ipcRenderer.removeAllListeners(channels.prefsStore.onUpstreamsDidChange);
    } else {
      ipcRenderer.on(channels.prefsStore.onUpstreamsDidChange, (_, newValue, oldValue) =>
        callback(newValue, oldValue),
      );
    }
  },
};
export type PrefsStoreApi = typeof prefsStoreApi;
contextBridge.exposeInMainWorld("prefsStore", prefsStoreApi);
