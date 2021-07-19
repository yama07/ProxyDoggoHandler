import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("proxyChain", {
  init: (params: GeneralPreferenceType) =>
    ipcRenderer.invoke("proxyChain.init", params),
  listen: () => ipcRenderer.invoke("proxyChain.listen"),
  close: () => ipcRenderer.invoke("proxyChain.close"),
  updateUpstreamProxyUrl: (params?: ConnectionSettingType) =>
    ipcRenderer.invoke("proxyChain.updateUpstreamProxyUrl", params),
});

contextBridge.exposeInMainWorld("store", {
  getGeneralPreference: (): Promise<GeneralPreferenceType> =>
    ipcRenderer.invoke("store.getGeneralPreference"),
  setGeneralPreference: (preference: GeneralPreferenceType) =>
    ipcRenderer.invoke("store.setGeneralPreference", preference),
  getProxiesPreference: (): Promise<ProxiesPreferenceType> =>
    ipcRenderer.invoke("store.getProxiesPreference"),
  setProxiesPreference: (preference: ProxiesPreferenceType) =>
    ipcRenderer.invoke("store.setProxiesPreference", preference),
});

contextBridge.exposeInMainWorld("app", {
  updateTray: () => ipcRenderer.invoke("app.updateTray"),
});
