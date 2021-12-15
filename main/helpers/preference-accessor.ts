import Store from "electron-store";

let _storeInstance: Store<PreferenceType> | null = null;
const getStoreInsance = (): Store<PreferenceType> => {
  if (!_storeInstance) {
    _storeInstance = new Store<PreferenceType>({
      defaults: {
        general: {
          isOpenAtStartup: true,
          trayIconStyle: "default",
          menuIconStyle: "default",
        },
        proxy: { port: 8080, verbose: false },
        upstreams: {
          selectedIndex: 0,
          upstreams: [
            { name: "Direct", icon: "001-dog", connectionSetting: null },
          ],
        },
      },
    });
  }
  return _storeInstance;
};

export const getGeneralPreference = (): GeneralPreferenceType => {
  return getStoreInsance().get("general");
};

export const setGeneralPreference = (preference: GeneralPreferenceType) => {
  getStoreInsance().set("general", preference);
};

export const onGeneralPreferenceDidChange = (
  callback: (
    newValue: GeneralPreferenceType,
    oldValue: GeneralPreferenceType
  ) => void
): (() => void) => {
  return getStoreInsance().onDidChange("general", callback);
};

export const getProxyPreference = (): ProxyPreferenceType => {
  return getStoreInsance().get("proxy");
};

export const setProxyPreference = (preference: ProxyPreferenceType) => {
  getStoreInsance().set("proxy", preference);
};

export const onProxyPreferenceDidChange = (
  callback: (
    newValue: ProxyPreferenceType,
    oldValue: ProxyPreferenceType
  ) => void
): (() => void) => {
  return getStoreInsance().onDidChange("proxy", callback);
};

export const getUpstreamsPreference = (): UpstreamsPreferenceType => {
  return getStoreInsance().get("upstreams");
};

export const setUpstreamsPreference = (preference: UpstreamsPreferenceType) => {
  getStoreInsance().set("upstreams", preference);
};

export const onUpstreamsPreferenceDidChange = (
  callback: (
    newValue: UpstreamsPreferenceType,
    oldValue: UpstreamsPreferenceType
  ) => void
): (() => void) => {
  return getStoreInsance().onDidChange("upstreams", callback);
};
