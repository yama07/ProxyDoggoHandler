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
  getProxyPreference: () => Promise<ProxyPreferenceType>;
  setProxyPreference: (ProxyPreferenceType) => void;
  getUpstreamsPreference: () => Promise<UpstreamsPreferenceType>;
  setUpstreamsPreference: (UpstreamsPreferenceType) => void;
}

export interface IApp {
  updateTray: () => void;
}
