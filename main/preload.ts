import { contextBridge, ipcRenderer } from "electron";

import channels from "./ipc/channels";

const systemApi = {
  isMacos: (): Promise<boolean> => ipcRenderer.invoke(channels.system.isMacos),
};
export type SystemApiType = typeof systemApi;
contextBridge.exposeInMainWorld("system", systemApi);

const prefWindowApi = {
  close: () => ipcRenderer.send(channels.prefWindow.close),
  maximize: () => ipcRenderer.send(channels.prefWindow.maximize),
  unmaximize: () => ipcRenderer.send(channels.prefWindow.unmaximize),
  minimize: () => ipcRenderer.send(channels.prefWindow.minimize),
  isMaximized: (): Promise<boolean> => ipcRenderer.invoke(channels.prefWindow.isMaximized),
  onMaximize: (callback?: () => void) => {
    if (callback === undefined) {
      ipcRenderer.removeAllListeners(channels.prefWindow.onMaximize);
    } else {
      ipcRenderer.on(channels.prefWindow.onMaximize, callback);
    }
  },
  onUnmaximize: (callback?: () => void) => {
    if (callback === undefined) {
      ipcRenderer.removeAllListeners(channels.prefWindow.onUnmaximize);
    } else {
      ipcRenderer.on(channels.prefWindow.onUnmaximize, callback);
    }
  },
};
export type PrefWindowApiType = typeof prefWindowApi;
contextBridge.exposeInMainWorld("prefWindow", prefWindowApi);

const storeApi = {
  getGeneralPreference: (): Promise<GeneralPreferenceType> =>
    ipcRenderer.invoke(channels.store.getGeneralPreference),
  setGeneralPreference: (preference: GeneralPreferenceType) =>
    ipcRenderer.send(channels.store.setGeneralPreference, preference),
  onGeneralPreferenceDidChange: (
    callback?: (newValue: GeneralPreferenceType, oldValue: GeneralPreferenceType) => void,
  ) => {
    if (callback === undefined) {
      ipcRenderer.removeAllListeners(channels.store.onGeneralPreferenceDidChange);
    } else {
      ipcRenderer.on(channels.store.onGeneralPreferenceDidChange, (_, newValue, oldValue) =>
        callback(newValue, oldValue),
      );
    }
  },

  getProxyPreference: (): Promise<ProxyPreferenceType> =>
    ipcRenderer.invoke(channels.store.getProxyPreference),
  setProxyPreference: (preference: ProxyPreferenceType) =>
    ipcRenderer.send(channels.store.setProxyPreference, preference),
  onProxyPreferenceDidChange: (
    callback?: (newValue: ProxyPreferenceType, oldValue: ProxyPreferenceType) => void,
  ) => {
    if (callback === undefined) {
      ipcRenderer.removeAllListeners(channels.store.onProxyPreferenceDidChange);
    } else {
      ipcRenderer.on(channels.store.onProxyPreferenceDidChange, (_, newValue, oldValue) =>
        callback(newValue, oldValue),
      );
    }
  },

  getUpstreamsPreference: (): Promise<UpstreamsPreferenceType> =>
    ipcRenderer.invoke(channels.store.getUpstreamsPreference),
  setUpstreamsPreference: (preference: UpstreamsPreferenceType) =>
    ipcRenderer.send(channels.store.setUpstreamsPreference, preference),
  onUpstreamsPreferenceDidChange: (
    callback?: (newValue: UpstreamsPreferenceType, oldValue: UpstreamsPreferenceType) => void,
  ) => {
    if (callback === undefined) {
      ipcRenderer.removeAllListeners(channels.store.onUpstreamsPreferenceDidChange);
    } else {
      ipcRenderer.on(channels.store.onUpstreamsPreferenceDidChange, (_, newValue, oldValue) =>
        callback(newValue, oldValue),
      );
    }
  },
};
export type StoreApiType = typeof storeApi;
contextBridge.exposeInMainWorld("store", storeApi);
