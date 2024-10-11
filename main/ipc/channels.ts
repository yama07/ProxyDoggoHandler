export default {
  system: {
    isMacos: "system.isMacos",
  },
  prefsWindow: {
    close: "prefsWindow.close",
    maximize: "prefsWindow.maximize",
    unmaximize: "prefsWindow.unmaximize",
    minimize: "prefsWindow.minimize",
    isMaximized: "prefsWindow.isMaximized",
    onMaximize: "prefsWindow.onMaximize",
    onUnmaximize: "prefsWindow.onUnmaximize",
  },
  store: {
    getGeneralPreference: "store.getGeneralPreference",
    setGeneralPreference: "store.setGeneralPreference",
    onGeneralPreferenceDidChange: "store.onGeneralPreferenceDidChange",

    getProxyPreference: "store.getProxyPreference",
    setProxyPreference: "store.setProxyPreference",
    onProxyPreferenceDidChange: "store.onProxyPreferenceDidChange",

    getUpstreamsPreference: "store.getUpstreamsPreference",
    setUpstreamsPreference: "store.setUpstreamsPreference",
    onUpstreamsPreferenceDidChange: "store.onUpstreamsPreferenceDidChange",
  },
};
