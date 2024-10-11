import { Menu, MenuItem, Tray } from "electron";
import log from "electron-log";
import { is } from "electron-util";

import {
  getAppTrayIcon,
  getDogBreadsMenuIcon,
  getDogBreadsTrayIcon,
  getStatusMenuIcon,
} from "./icon";

type Accessor = {
  generalPreference: () => GeneralPreferenceType;
  upstreamsPreference: () => UpstreamsPreferenceType;
  proxyServerEndpoint: () => string | undefined;
  isProxyServerRunning: () => boolean;
};

type Handler = {
  startProxyServer: () => void;
  stopProxyServer: () => void;
  clickPrefsWindowMenu: () => void;
  clickAboutWindow: () => void;
  selectUpstream: (index: number) => void;
};

let _tray: Tray | undefined;
let handler: Handler;
let accessor: Accessor;

const initialize = (param: {
  accessor: Accessor;
  handler: Handler;
}) => {
  accessor = param.accessor;
  handler = param.handler;

  const generalPreference = accessor.generalPreference();
  const icon = getAppTrayIcon(generalPreference.trayIconStyle);
  _tray = new Tray(icon);
  _tray.addListener("click", () => {
    _tray?.popUpContextMenu();
  });

  log.info("System tray is initialized.");
};

const update = () => {
  if (_tray === undefined) {
    log.info("System tray is not initialized.");
    return;
  }
  const upstreamsPreference = accessor.upstreamsPreference();
  const generalPreference = accessor.generalPreference();

  const statusMenuItem = new MenuItem(
    accessor.isProxyServerRunning()
      ? {
          label: `Running on ${accessor.proxyServerEndpoint()}`,
          icon: getStatusMenuIcon("active", generalPreference.menuIconStyle),
          enabled: false,
        }
      : {
          label: "Not Running",
          icon: getStatusMenuIcon("inactive", generalPreference.menuIconStyle),
          enabled: false,
        },
  );

  const proxyServerControlItem = new MenuItem(
    accessor.isProxyServerRunning()
      ? {
          label: "プロキシサーバを停止",
          click: (item, window, event) => {
            log.debug("Click tray menu:", item.label);
            handler.stopProxyServer();
          },
        }
      : {
          label: "プロキシサーバを起動",
          click: (item, window, event) => {
            log.debug("Click tray menu:", item.label);
            handler.startProxyServer();
          },
        },
  );

  const proxyMenuItems = upstreamsPreference.upstreams.map(
    (proxy, index) =>
      new MenuItem({
        id: String(index),
        label: proxy.name,
        type: "radio",
        checked: upstreamsPreference.selectedIndex === index,
        icon: getDogBreadsMenuIcon(proxy.icon, generalPreference.menuIconStyle),
        toolTip:
          proxy.connectionSetting == null
            ? "Direct Access"
            : `${proxy.connectionSetting.host}:${proxy.connectionSetting.port}`,
        click: (item, window, event) => {
          log.debug("Click tray menu:", item.id, item.label);
          handler.selectUpstream(Number(item.id));
        },
      }),
  );

  const contextMenu = Menu.buildFromTemplate([
    statusMenuItem,
    { type: "separator" },
    {
      label: "環境設定",
      accelerator: is.macos ? "Command+," : undefined,
      click: handler.clickPrefsWindowMenu,
    },
    {
      label: "Proxy Doggo Handlerについて",
      click: handler.clickAboutWindow,
    },
    { type: "separator" },
    ...proxyMenuItems,
    { type: "separator" },
    proxyServerControlItem,
    {
      label: "終了",
      accelerator: is.macos ? "Command+Q" : undefined,
      role: "quit",
    },
  ]);
  _tray.setContextMenu(contextMenu);

  const icon = accessor.isProxyServerRunning()
    ? getDogBreadsTrayIcon(
        upstreamsPreference.upstreams[upstreamsPreference.selectedIndex].icon,
        generalPreference.trayIconStyle,
      )
    : getAppTrayIcon(generalPreference.trayIconStyle);
  _tray.setImage(icon);

  log.info("System tray is updated.");
};

export const tray = {
  initialize,
  update,
};
