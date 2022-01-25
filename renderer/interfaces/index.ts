declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    system: ISystem;
    store: IStore;
  }
}

export interface ISystem {
  isMacos: () => Promise<boolean>;

  closePrefsWindow: () => void;
  maximizePrefsWindow: () => void;
  unmaximizePrefsWindow: () => void;
  minimizePrefsWindow: () => void;
  isMaximizedPrefsWindow: () => Promise<boolean>;
  onPrefsWindowMaximize: (callback: () => void) => void;
  onPrefsWindowUnmaximize: (callback: () => void) => void;
}

export interface IStore {
  getGeneralPreference: () => Promise<GeneralPreferenceType>;
  setGeneralPreference: (preference: GeneralPreferenceType) => void;
  onGeneralPreferenceDidChange: (
    callback: (
      newValue: GeneralPreferenceType,
      oldValue: GeneralPreferenceType
    ) => void
  ) => void;
  removeOnGeneralPreferenceDidChangeListeners: () => void;

  getProxyPreference: () => Promise<ProxyPreferenceType>;
  setProxyPreference: (preference: ProxyPreferenceType) => void;
  onProxyPreferenceDidChange: (
    callback: (
      newValue: ProxyPreferenceType,
      oldValue: ProxyPreferenceType
    ) => void
  ) => void;
  removeOnProxyPreferenceDidChangeListeners: () => void;

  getUpstreamsPreference: () => Promise<UpstreamsPreferenceType>;
  setUpstreamsPreference: (preference: UpstreamsPreferenceType) => void;
  onUpstreamsPreferenceDidChange: (
    callback: (
      newValue: UpstreamsPreferenceType,
      oldValue: UpstreamsPreferenceType
    ) => void
  ) => void;
  removeOnUpstreamsPreferenceDidChangeListeners: () => void;
}
