declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    proxyChain: IProxyChain;
    store: IStore;
    app: IApp;
  }
}

export interface IStore {
  getGeneralPreference: () => Promise<GeneralPreferenceType>;
  setGeneralPreference: (GeneralPreferenceType) => void;
  getProxiesPreference: () => Promise<ProxiesPreferenceType>;
  setProxiesPreference: (ProxiesPreferenceType) => void;
}

export interface IApp {
  updateTray: () => void;
}
