import { Menu, MenuItem, Tray } from "electron";
import log from "electron-log";
import { is } from "electron-util";

import type { AppearancePreference } from "$/preference/appearancePreference";
import type { ProfilesPreference } from "$/preference/profilePreference";

import {
  getAppTrayIcon,
  getDogBreadsMenuIcon,
  getDogBreadsTrayIcon,
  getStatusMenuIcon,
} from "./icon";

type Accessor = {
  appearancePreference: () => AppearancePreference;
  profilePreference: () => ProfilesPreference;
  proxyServerEndpoint: () => string | undefined;
  isProxyServerRunning: () => boolean;
};

type Handler = {
  startProxyServer: () => void;
  stopProxyServer: () => void;
  clickPrefsWindowMenu: () => void;
  clickAboutWindow: () => void;
  selectProfile: (index: number) => void;
};

let _tray: Tray | undefined;
let handler: Handler;
let accessor: Accessor;

const initialize = (param: { accessor: Accessor; handler: Handler }) => {
  accessor = param.accessor;
  handler = param.handler;

  const generalPreference = accessor.appearancePreference();
  const icon = getAppTrayIcon(generalPreference.trayIcon.style, generalPreference.trayIcon.color);
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
  const upstreamsPreference = accessor.profilePreference();
  const generalPreference = accessor.appearancePreference();

  const statusMenuItem = new MenuItem(
    accessor.isProxyServerRunning()
      ? {
          label: `Running on ${accessor.proxyServerEndpoint()}`,
          icon: getStatusMenuIcon(
            "active",
            generalPreference.menuIcon.style,
            generalPreference.menuIcon.color,
          ),
          enabled: false,
        }
      : {
          label: "Not Running",
          icon: getStatusMenuIcon(
            "inactive",
            generalPreference.menuIcon.style,
            generalPreference.menuIcon.color,
          ),
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

  const proxyMenuItems = upstreamsPreference.profiles.map(
    (proxy, index) =>
      new MenuItem({
        id: String(index),
        label: proxy.name,
        type: "radio",
        checked: upstreamsPreference.selectedIndex === index,
        icon: getDogBreadsMenuIcon(
          proxy.icon,
          generalPreference.menuIcon.style,
          generalPreference.menuIcon.color,
        ),
        toolTip:
          proxy.connectionSetting.protocol === "direct"
            ? "Direct Access"
            : `${proxy.connectionSetting.host}:${proxy.connectionSetting.port}`,
        click: (item, window, event) => {
          log.debug("Click tray menu:", item.id, item.label);
          handler.selectProfile(Number(item.id));
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
        upstreamsPreference.profiles[upstreamsPreference.selectedIndex].icon,
        generalPreference.trayIcon.style,
        generalPreference.trayIcon.color,
      )
    : getAppTrayIcon(generalPreference.trayIcon.style, generalPreference.trayIcon.color);
  _tray.setImage(icon);

  log.info("System tray is updated.");
};

export const tray = {
  initialize,
  update,
};
