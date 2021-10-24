import { app, ipcMain, Menu } from "electron";
import serve from "electron-serve";
import isDev from "electron-is-dev";
import { createTray, openPreferencesWindow } from "./helpers";
import { listen, close } from "./helpers/proxy-chain-wrapper";
import {
  getGeneralPreference,
  setGeneralPreference,
  getProxyPreference,
  setProxyPreference,
  getUpstreamsPreference,
  setUpstreamsPreference,
  onUpstreamsPreferenceDidChange,
  onProxyPreferenceDidChange,
} from "./helpers/preference-accessor";
import { updateTray } from "./helpers/create-tray";

// アプリの多重起動防止
const instanceLock = app.requestSingleInstanceLock();
if (!instanceLock) {
  app.exit();
}

if (isDev) {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
} else {
  serve({ directory: "app" });
}

Menu.setApplicationMenu(null);

if (process.platform === "darwin") app.dock.hide();

(async () => {
  await app.whenReady();

  listen(getProxyPreference());

  createTray();

  if (getGeneralPreference().isOpenAtStartup) {
    openPreferencesWindow();
  }
})();

app.on("window-all-closed", () => {});

const unsubscribeFunctions = [
  onProxyPreferenceDidChange((newValue, oldValue) => {
    close();
    listen(newValue);
  }),
  onUpstreamsPreferenceDidChange((newValue, oldValue) => {
    updateTray();
  }),
];

app.on("quit", () => {
  unsubscribeFunctions.map((unsubscribe) => {
    unsubscribe();
  });
});

// IPC handling //////////////////////////////////

ipcMain.handle("store.getGeneralPreference", (event): GeneralPreferenceType => {
  return getGeneralPreference();
});
ipcMain.handle(
  "store.setGeneralPreference",
  (event, preference: GeneralPreferenceType) => {
    setGeneralPreference(preference);
  }
);
ipcMain.handle("store.getProxyPreference", (event): ProxyPreferenceType => {
  return getProxyPreference();
});
ipcMain.handle(
  "store.setProxyPreference",
  (event, preference: ProxyPreferenceType) => {
    setProxyPreference(preference);
  }
);
ipcMain.handle(
  "store.getUpstreamsPreference",
  (event): UpstreamsPreferenceType => {
    return getUpstreamsPreference();
  }
);
ipcMain.handle(
  "store.setUpstreamsPreference",
  (event, preference: UpstreamsPreferenceType) => {
    setUpstreamsPreference(preference);
  }
);

ipcMain.handle("app.updateTray", (event) => {
  updateTray();
});
