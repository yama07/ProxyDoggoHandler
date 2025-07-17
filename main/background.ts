import { Menu, app } from "electron";
import log from "electron-log";
import serve from "electron-serve";

import { platformUtils } from "./helpers/platform-utils";
import { prefsStore } from "./helpers/prefs-store";
import { proxy } from "./helpers/proxy";
import { tray } from "./helpers/tray";
import { prefsStoreIpcHandler } from "./ipc/prefs-store-ipc-handler";
import { prefsWindowIpcHandler } from "./ipc/prefs-window-ipc-handler";
import { systemIpcHandler } from "./ipc/system-ipc-handler";
import { aboutWindow } from "./windows/about-window";
import { prefsWindow } from "./windows/prefs-window";

// DevelopmentとProductionでユーザデータの格納先を分ける
if (platformUtils.isDevelopment) {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

// ロギング設定
console.log = log.log;
console.debug = log.debug;
console.info = log.info;
console.warn = log.warn;
console.error = log.error;
log.initialize({ spyRendererConsole: true });
log.transports.console.level = platformUtils.isDevelopment ? "silly" : "info";
log.transports.file.level = platformUtils.isDevelopment ? "silly" : "info";
log.info(`Startup with PID ${process.pid}`);

// アプリの多重起動防止
const instanceLock = app.requestSingleInstanceLock();
if (!instanceLock) {
  log.info("Another instance is already running.");
  app.exit();
}

// 例外をキャッチできなかった場合、ログに出力して終了する
process.on("uncaughtException", (err) => {
  log.error("electron:event:uncaughtException");
  log.error(err);
  log.error(err.stack);
  app.quit();
});

// アプリケーションメニューは不要のため非表示にする
Menu.setApplicationMenu(null);

// macの場合、Dockerにアイコンを表示させる必要がないため非表示にする
if (platformUtils.isMacos) app.dock.hide();

if (platformUtils.isProduction) serve({ directory: "app" });

let unsubscribeFunctions: (() => void)[];

const setup = () => {
  log.debug("Begin application setup.");

  // 設定変更の監視
  unsubscribeFunctions = [
    prefsStore.onDidChange("appearance", (newValue, oldValue) => {
      if (newValue === undefined) {
        return;
      }
      if (
        newValue.menuIcon.style !== oldValue?.menuIcon.style ||
        newValue.menuIcon.color !== oldValue?.menuIcon.color ||
        newValue.trayIcon.style !== oldValue?.trayIcon.style ||
        newValue.trayIcon.color !== oldValue?.trayIcon.color
      ) {
        // アイコンスタイルが変更されたらアップデートする
        tray.update();
      }
    }),
    prefsStore.onDidChange("proxy", (newValue, oldValue) => {
      if (newValue === undefined) {
        return;
      }
      proxy.close();
      proxy.initialize(newValue);
      proxy.listen();
      if (newValue.port !== oldValue?.port) {
        tray.update();
      }
    }),
    prefsStore.onDidChange("profiles", (newValue, oldValue) => {
      if (newValue === undefined) {
        return;
      }
      const newSelectedProfile = newValue.profiles[newValue.selectedIndex];
      const oldSelectedProfile = oldValue?.profiles[oldValue.selectedIndex];
      if (JSON.stringify(newSelectedProfile) !== JSON.stringify(oldSelectedProfile)) {
        proxy.setConnectionSetting(newSelectedProfile.connectionSetting);
      }
      tray.update();
    }),
  ];

  // システムトレイの初期化
  tray.initialize({
    accessor: {
      appearancePreference: () => prefsStore.get("appearance"),
      profilePreference: () => prefsStore.get("profiles"),
      proxyServerEndpoint: proxy.getEndpoint,
      isProxyServerRunning: proxy.isRunning,
    },
    handler: {
      startProxyServer: () => {
        proxy.listen();
      },
      stopProxyServer: () => {
        proxy.close();
      },
      selectProfile: (index: number) => {
        // 設定ファイルを更新
        const newPreference = prefsStore.get("profiles");
        newPreference.selectedIndex = index;
        prefsStore.set("profiles", newPreference);
      },
      clickPrefsWindowMenu: async () =>
        await prefsWindow.open([prefsWindowIpcHandler, systemIpcHandler, prefsStoreIpcHandler]),
      clickAboutWindow: aboutWindow.open,
    },
  });

  // プロキシサーバの初期化
  const proxyPreference = prefsStore.get("proxy");
  proxy.initialize(proxyPreference);
  proxy.onStatusDidChange(() => {
    log.debug("Proxy server status was changed.");
    tray.update();
  });
  const profilesPreference = prefsStore.get("profiles");
  const currentProfile = profilesPreference.profiles[profilesPreference.selectedIndex];
  proxy.setConnectionSetting(currentProfile.connectionSetting);
  if (proxyPreference.isLaunchProxyServerAtStartup) {
    proxy.listen();
  }

  tray.update();

  log.debug("Finish application setup.");
};

(async () => {
  await app.whenReady();

  setup();

  if (prefsStore.get("appearance").isOpenAtStartup) {
    await prefsWindow.open([prefsWindowIpcHandler, systemIpcHandler, prefsStoreIpcHandler]);
  }
})();

app.on("window-all-closed", () => {
  log.debug("All windows are closed.");
});

app.on("quit", () => {
  log.info(`Shutdown with PID ${process.pid}`);

  while (unsubscribeFunctions.length) {
    const unsubscribeFunc = unsubscribeFunctions.pop();
    unsubscribeFunc?.();
  }
});
