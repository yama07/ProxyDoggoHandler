import { contextBridge, ipcRenderer } from "electron";

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
