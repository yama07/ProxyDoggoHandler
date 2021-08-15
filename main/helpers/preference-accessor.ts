import Store from "electron-store";

const store = new Store<PreferenceType>({
  defaults: {
    general: { isOpenAtStartup: true },
    proxy: { port: 8080, verbose: false },
    upstreams: {
      selectedIndex: 0,
      upstreams: [
        { name: "Dynamic", icon: "001-dog", connectionSetting: null },
      ],
    },
  },
});

export const getGeneralPreference = (): GeneralPreferenceType => {
  return store.get("general");
};

export const setGeneralPreference = (preference: GeneralPreferenceType) => {
  store.set("general", preference);
};

export const onGeneralPreferenceDidChange = (
  callback: (
    newValue: GeneralPreferenceType,
    oldValue: GeneralPreferenceType
  ) => void
): (() => void) => {
  return store.onDidChange("general", callback);
};

export const getProxyPreference = (): ProxyPreferenceType => {
  return store.get("proxy");
};

export const setProxyPreference = (preference: ProxyPreferenceType) => {
  store.set("proxy", preference);
};

export const onProxyPreferenceDidChange = (
  callback: (
    newValue: ProxyPreferenceType,
    oldValue: ProxyPreferenceType
  ) => void
): (() => void) => {
  return store.onDidChange("proxy", callback);
};

export const getUpstreamsPreference = (): UpstreamsPreferenceType => {
  return store.get("upstreams");
};

export const setUpstreamsPreference = (preference: UpstreamsPreferenceType) => {
  store.set("upstreams", preference);
};

export const onUpstreamsPreferenceDidChange = (
  callback: (
    newValue: UpstreamsPreferenceType,
    oldValue: UpstreamsPreferenceType
  ) => void
): (() => void) => {
  return store.onDidChange("upstreams", callback);
};
