import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("system", {
  isMacos: (): Promise<boolean> => ipcRenderer.invoke("system.isMacos"),
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

contextBridge.exposeInMainWorld("app", {
  updateTray: () => ipcRenderer.invoke("app.updateTray"),
});
