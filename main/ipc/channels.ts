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
  prefsStore: {
    getGeneral: "prefsStore.getGeneral",
    setGeneral: "prefsStore.setGeneral",
    onGeneralDidChange: "prefsStore.onGeneralDidChange",

    getProxy: "prefsStore.getProxy",
    setProxy: "prefsStore.setProxy",
    onProxyDidChange: "prefsStore.onProxyDidChange",

    getUpstreams: "prefsStore.getUpstreams",
    setUpstreams: "prefsStore.setUpstreams",
    onUpstreamsDidChange: "prefsStore.onUpstreamsDidChange",
  },
};
