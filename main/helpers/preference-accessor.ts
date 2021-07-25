import Store from "electron-store";

const store = new Store<PreferenceType>({
  defaults: {
    general: { port: 8080, verbose: false },
    proxies: {
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

export const getProxiesPreference = (): ProxiesPreferenceType => {
  return store.get("proxies");
};

export const setProxiesPreference = (preference: ProxiesPreferenceType) => {
  store.set("proxies", preference);
};

export const onProxiesPreferenceDidChange = (
  callback: (
    newValue: ProxiesPreferenceType,
    oldValue: ProxiesPreferenceType
  ) => void
): (() => void) => {
  return store.onDidChange("proxies", callback);
};
