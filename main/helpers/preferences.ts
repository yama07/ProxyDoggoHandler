import Store from "electron-store";

const defaults: PreferenceType = {
  general: {
    isOpenAtStartup: true,
    isLaunchProxyServerAtStartup: true,
    trayIconStyle: "lineal",
    menuIconStyle: "lineal",
  },
  proxy: { port: 8080, verbose: false },
  upstreams: {
    selectedIndex: 0,
    upstreams: [{ name: "Direct", icon: "001-dog", connectionSetting: undefined }],
  },
};

let storeInstance: Store<PreferenceType> | undefined;
const getStoreInsance = (): Store<PreferenceType> => {
  if (storeInstance === undefined) {
    storeInstance = new Store<PreferenceType>({ defaults });
  }
  return storeInstance;
};

export default {
  get: <T extends keyof PreferenceType>(key: T): PreferenceType[T] => getStoreInsance().get(key),
  set: <T extends keyof PreferenceType>(key: T, value: PreferenceType[T]) =>
    getStoreInsance().set(key, value),
  onDidChange: <T extends keyof PreferenceType>(
    key: T,
    callback: (newValue?: PreferenceType[T], oldValue?: PreferenceType[T]) => void,
  ): (() => void) => {
    return getStoreInsance().onDidChange(key, callback);
  },
};
