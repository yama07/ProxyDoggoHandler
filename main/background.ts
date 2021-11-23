import { app, Menu } from "electron";
import serve from "electron-serve";
import isDev from "electron-is-dev";
import { openPrefsWindow } from "./windows/preferences";
import { listen, close } from "./helpers/proxy-chain-wrapper";
import {
  getGeneralPreference,
  getProxyPreference,
  onUpstreamsPreferenceDidChange,
  onProxyPreferenceDidChange,
} from "./helpers/preference-accessor";
import { initializeTray, updateTray } from "./helpers/tray";
import { initializeIpc } from "./helpers/ipc";
import log from "electron-log";

log.info("Startup");

// アプリの多重起動防止
const instanceLock = app.requestSingleInstanceLock();
if (!instanceLock) {
  log.info("Another instance is already running.");
  app.exit();
}

console.log = log.log;
process.on("uncaughtException", (err) => {
  log.error("electron:event:uncaughtException");
  log.error(err);
  log.error(err.stack);
  app.quit();
});

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

  initializeTray();
  initializeIpc();

  if (getGeneralPreference().isOpenAtStartup) {
    openPrefsWindow();
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
  log.info("Shutdown");
  unsubscribeFunctions.map((unsubscribe) => {
    unsubscribe();
  });
});
