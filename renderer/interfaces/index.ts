declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    store: IStore;
    app: IApp;
  }
}

export interface IStore {
  getGeneralPreference: () => Promise<GeneralPreferenceType>;
  setGeneralPreference: (preference: GeneralPreferenceType) => void;
  getProxyPreference: () => Promise<ProxyPreferenceType>;
  setProxyPreference: (preference: ProxyPreferenceType) => void;
  getUpstreamsPreference: () => Promise<UpstreamsPreferenceType>;
  setUpstreamsPreference: (preference: UpstreamsPreferenceType) => void;
}

export interface IApp {
  updateTray: () => void;
}
