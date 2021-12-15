import { app, Menu } from "electron";
import serve from "electron-serve";
import { openPrefsWindow } from "./windows/preferences";
import { listen, close } from "./helpers/proxy-chain-wrapper";
import {
  getGeneralPreference,
  getProxyPreference,
  onUpstreamsPreferenceDidChange,
  onProxyPreferenceDidChange,
  onGeneralPreferenceDidChange,
} from "./helpers/preference-accessor";
import { initializeTray, updateTray } from "./helpers/tray";
import { initializeIpc } from "./helpers/ipc";
import log from "electron-log";
import { is } from "electron-util";

// ロギング設定
console.log = log.log;
log.transports.console.level = is.development ? "silly" : "info";
log.transports.file.level = is.development ? "silly" : "info";
log.info(`Startup with PID ${process.pid}`);

// アプリの多重起動防止
const instanceLock = app.requestSingleInstanceLock();
if (!instanceLock) {
  log.info("Another instance is already running.");
  app.exit();
}

// 例外をキャッチできなかった場合、
// ログに出力して終了する
process.on("uncaughtException", (err) => {
  log.error("electron:event:uncaughtException");
  log.error(err);
  log.error(err.stack);
  app.quit();
});

if (is.development) {
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
  onGeneralPreferenceDidChange((newValue, oldValue) => {
    if (
      newValue.menuIconStyle != oldValue.menuIconStyle ||
      newValue.trayIconStyle != oldValue.trayIconStyle
    ) {
      // アイコンスタイルが変更されたらアップデートする
      updateTray();
    }
  }),
  onProxyPreferenceDidChange((newValue, oldValue) => {
    close();
    listen(newValue);
  }),
  onUpstreamsPreferenceDidChange((newValue, oldValue) => {
    updateTray();
  }),
];

app.on("quit", () => {
  log.info(`Shutdown with PID ${process.pid}`);
  unsubscribeFunctions.map((unsubscribe) => {
    unsubscribe();
  });
});
