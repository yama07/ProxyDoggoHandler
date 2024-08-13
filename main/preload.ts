import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("system", {
  isMacos: (): Promise<boolean> => ipcRenderer.invoke("system.isMacos"),
});

contextBridge.exposeInMainWorld("prefsWindow", {
  closePrefsWindow: () => ipcRenderer.invoke("prefsWindow.closePrefsWindow"),
  maximizePrefsWindow: () => ipcRenderer.invoke("prefsWindow.maximizePrefsWindow"),
  unmaximizePrefsWindow: () => ipcRenderer.invoke("prefsWindow.unmaximizePrefsWindow"),
  minimizePrefsWindow: () => ipcRenderer.invoke("prefsWindow.minimizePrefsWindow"),
  isMaximizedPrefsWindow: (): Promise<boolean> =>
    ipcRenderer.invoke("prefsWindow.isMaximizedPrefsWindow"),
  onPrefsWindowMaximize: (callback: () => void) =>
    ipcRenderer.on("prefsWindow.onPrefsWindowMaximize", () => callback()),
  onPrefsWindowUnmaximize: (callback: () => void) =>
    ipcRenderer.on("prefsWindow.onPrefsWindowUnmaximize", () => callback()),
});

contextBridge.exposeInMainWorld("store", {
  getGeneralPreference: (): Promise<GeneralPreferenceType> =>
    ipcRenderer.invoke("store.getGeneralPreference"),
  setGeneralPreference: (preference: GeneralPreferenceType) =>
    ipcRenderer.invoke("store.setGeneralPreference", preference),
  onGeneralPreferenceDidChange: (
    callback: (newValue: GeneralPreferenceType, oldValuee: GeneralPreferenceType) => void,
  ) =>
    ipcRenderer.on("store.onGeneralPreferenceDidChange", (event, newValue, oldValue) =>
      callback(newValue, oldValue),
    ),
  removeOnGeneralPreferenceDidChangeListeners: (): void => {
    ipcRenderer.removeAllListeners("store.onGeneralPreferenceDidChange");
  },

  getProxyPreference: (): Promise<ProxyPreferenceType> =>
    ipcRenderer.invoke("store.getProxyPreference"),
  setProxyPreference: (preference: ProxyPreferenceType) =>
    ipcRenderer.invoke("store.setProxyPreference", preference),
  onProxyPreferenceDidChange: (
    callback: (newValue: ProxyPreferenceType, oldValue: ProxyPreferenceType) => void,
  ) =>
    ipcRenderer.on("store.onProxyPreferenceDidChange", (event, newValue, oldValue) =>
      callback(newValue, oldValue),
    ),
  removeOnProxyPreferenceDidChangeListeners: (): void => {
    ipcRenderer.removeAllListeners("store.onProxyPreferenceDidChange");
  },

  getUpstreamsPreference: (): Promise<UpstreamsPreferenceType> =>
    ipcRenderer.invoke("store.getUpstreamsPreference"),
  setUpstreamsPreference: (preference: UpstreamsPreferenceType) =>
    ipcRenderer.invoke("store.setUpstreamsPreference", preference),
  onUpstreamsPreferenceDidChange: (
    callback: (newValue: UpstreamsPreferenceType, oldValue: UpstreamsPreferenceType) => void,
  ) =>
    ipcRenderer.on("store.onUpstreamsPreferenceDidChange", (event, newValue, oldValue) =>
      callback(newValue, oldValue),
    ),
  removeOnUpstreamsPreferenceDidChangeListeners: (): void => {
    ipcRenderer.removeAllListeners("store.onUpstreamsPreferenceDidChange");
  },
});
