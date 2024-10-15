import { contextBridge, ipcRenderer } from "electron";

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
  getGeneral: (): Promise<GeneralPreferenceType> =>
    ipcRenderer.invoke(channels.prefsStore.getGeneral),
  setGeneral: (preference: GeneralPreferenceType) =>
    ipcRenderer.send(channels.prefsStore.setGeneral, preference),
  onGeneralDidChange: (
    callback?: (newValue: GeneralPreferenceType, oldValue: GeneralPreferenceType) => void,
  ) => {
    if (callback === undefined) {
      ipcRenderer.removeAllListeners(channels.prefsStore.onGeneralDidChange);
    } else {
      ipcRenderer.on(channels.prefsStore.onGeneralDidChange, (_, newValue, oldValue) =>
        callback(newValue, oldValue),
      );
    }
  },

  getProxy: (): Promise<ProxyPreferenceType> => ipcRenderer.invoke(channels.prefsStore.getProxy),
  setProxy: (preference: ProxyPreferenceType) =>
    ipcRenderer.send(channels.prefsStore.setProxy, preference),
  onProxyDidChange: (
    callback?: (newValue: ProxyPreferenceType, oldValue: ProxyPreferenceType) => void,
  ) => {
    if (callback === undefined) {
      ipcRenderer.removeAllListeners(channels.prefsStore.onProxyDidChange);
    } else {
      ipcRenderer.on(channels.prefsStore.onProxyDidChange, (_, newValue, oldValue) =>
        callback(newValue, oldValue),
      );
    }
  },

  getUpstreams: (): Promise<UpstreamsPreferenceType> =>
    ipcRenderer.invoke(channels.prefsStore.getUpstreams),
  setUpstreams: (preference: UpstreamsPreferenceType) =>
    ipcRenderer.send(channels.prefsStore.setUpstreams, preference),
  onUpstreamsDidChange: (
    callback?: (newValue: UpstreamsPreferenceType, oldValue: UpstreamsPreferenceType) => void,
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
