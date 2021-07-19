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

export const getGeneralPreference = () => {
  return store.get("general");
};

export const setGeneralPreference = (preference: GeneralPreferenceType) => {
  store.set("general", preference);
};

export const getProxiesPreference = () => {
  return store.get("proxies");
};

export const setProxiesPreference = (preference: ProxiesPreferenceType) => {
  store.set("proxies", preference);
};
