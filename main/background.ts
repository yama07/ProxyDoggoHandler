import { Menu, app } from "electron";
import log from "electron-log";
import serve from "electron-serve";
import { is } from "electron-util";

import { finalizeIpc, initializeIpc } from "./helpers/ipc";
import {
  getGeneralPreference,
  getProxyPreference,
  getUpstreamsPreference,
  onGeneralPreferenceDidChange,
  onProxyPreferenceDidChange,
  onUpstreamsPreferenceDidChange,
  setUpstreamsPreference,
} from "./helpers/preferences";
import {
  closePorxyPort,
  getProxyServerEndpoint,
  initializeProxyServer,
  isProxyServerRunning,
  listenProxyPort,
  onProxyStatusDidChange,
  updateUpstreamProxyUrl,
} from "./helpers/proxy";
import { initializeTray, updateTray } from "./helpers/tray";
import { openAboutWindow } from "./windows/about-window";
import { openPrefsWindow } from "./windows/preferences-window";

// DevelopmentとProductionでユーザデータの格納先を分ける
if (is.development) {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

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
if (is.macos) app.dock.hide();

if (!is.development) serve({ directory: "app" });

(async () => {
  await app.whenReady();

  setup();

  if (getGeneralPreference().isOpenAtStartup) {
    await openPrefsWindow();
  }
})();

app.on("window-all-closed", () => {
  log.debug("All windows are closed.");
});

app.on("quit", () => {
  log.info(`Shutdown with PID ${process.pid}`);

  finalizeIpc();
  unsubscribeFunctions.map((unsubscribe) => {
    unsubscribe();
  });
});

let unsubscribeFunctions: (() => void)[];

const setup = () => {
  log.debug("Begin application setup.");

  // 設定変更の監視
  unsubscribeFunctions = [
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
      closePorxyPort();
      initializeProxyServer(newValue);
      listenProxyPort();
      if (newValue.port != oldValue.port) {
        updateTray();
      }
    }),
    onUpstreamsPreferenceDidChange((newValue, oldValue) => {
      const newSelectedUpstream = newValue.upstreams[newValue.selectedIndex];
      const oldSelectedUpstream = oldValue.upstreams[oldValue.selectedIndex];
      if (newSelectedUpstream != oldSelectedUpstream) {
        // Proxyサーバのアップストリームを切り替え
        updateUpstreamProxyUrl(newSelectedUpstream.connectionSetting);
      }
      updateTray();
    }),
  ];

  // IPCハンドリングの設定
  initializeIpc();

  // システムトレイの初期化
  initializeTray({
    accessor: {
      generalPreference: getGeneralPreference,
      upstreamsPreference: getUpstreamsPreference,
      proxyServerEndpoint: getProxyServerEndpoint,
      isProxyServerRunning: isProxyServerRunning,
    },
    handler: {
      startProxyServer: () => {
        listenProxyPort();
      },
      stopProxyServer: () => {
        closePorxyPort();
      },
      selectUpstream: (index: number) => {
        // 設定ファイルを更新
        const newPreference = getUpstreamsPreference();
        newPreference.selectedIndex = index;
        setUpstreamsPreference(newPreference);
      },
      clickPrefsWindowMenu: async () => await openPrefsWindow(),
      clickAboutWindow: openAboutWindow,
    },
  });

  // プロキシサーバの初期化
  initializeProxyServer(getProxyPreference());
  onProxyStatusDidChange(() => {
    log.debug("Proxy server status was changed.");
    updateTray();
  });

  const generalPreference = getGeneralPreference();
  if (generalPreference.isLaunchProxyServerAtStartup) {
    listenProxyPort();
  }

  updateTray();

  log.debug("Finish application setup.");
};
