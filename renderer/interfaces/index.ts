declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    system: ISystem;
    store: IStore;
    app: IApp;
  }
}

export interface ISystem {
  isMacos: () => Promise<boolean>;
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
