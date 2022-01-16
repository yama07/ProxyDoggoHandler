import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("system", {
  isMacos: (): Promise<boolean> => ipcRenderer.invoke("system.isMacos"),
  closePrefsWindow: () => ipcRenderer.invoke("system.closePrefsWindow"),
  maximizePrefsWindow: () => ipcRenderer.invoke("system.maximizePrefsWindow"),
  unmaximizePrefsWindow: () =>
    ipcRenderer.invoke("system.unmaximizePrefsWindow"),
  minimizePrefsWindow: () => ipcRenderer.invoke("system.minimizePrefsWindow"),
  isMaximizedPrefsWindow: (): Promise<boolean> =>
    ipcRenderer.invoke("system.isMaximizedPrefsWindow"),
  onPrefsWindowMaximize: (callback: () => void) =>
    ipcRenderer.on("system.onPrefsWindowMaximize", () => callback()),
  onPrefsWindowUnmaximize: (callback: () => void) =>
    ipcRenderer.on("system.onPrefsWindowUnmaximize", () => callback()),
});

contextBridge.exposeInMainWorld("store", {
  getGeneralPreference: (): Promise<GeneralPreferenceType> =>
    ipcRenderer.invoke("store.getGeneralPreference"),
  setGeneralPreference: (preference: GeneralPreferenceType) =>
    ipcRenderer.invoke("store.setGeneralPreference", preference),
  getProxyPreference: (): Promise<ProxyPreferenceType> =>
    ipcRenderer.invoke("store.getProxyPreference"),
  setProxyPreference: (preference: ProxyPreferenceType) =>
    ipcRenderer.invoke("store.setProxyPreference", preference),
  getUpstreamsPreference: (): Promise<UpstreamsPreferenceType> =>
    ipcRenderer.invoke("store.getUpstreamsPreference"),
  setUpstreamsPreference: (preference: UpstreamsPreferenceType) =>
    ipcRenderer.invoke("store.setUpstreamsPreference", preference),
});
