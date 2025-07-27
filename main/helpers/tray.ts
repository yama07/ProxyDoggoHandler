import { Menu, MenuItem, Tray } from "electron";
import log from "electron-log";

import type { AppearancePreference } from "$/preference/appearancePreference";
import type { ProfilesPreference } from "$/preference/profilePreference";

import {
  getAppTrayIcon,
  getDogBreadsMenuIcon,
  getDogBreadsTrayIcon,
  getStatusMenuIcon,
} from "./icon";
import { platformUtils } from "./platform-utils";

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

  const appearancePreference = accessor.appearancePreference();
  const icon = getAppTrayIcon(
    appearancePreference.trayIcon.style,
    appearancePreference.trayIcon.color,
  );
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
  const profilesPreference = accessor.profilePreference();
  const appearancePreference = accessor.appearancePreference();

  const statusMenuItem = new MenuItem(
    accessor.isProxyServerRunning()
      ? {
          label: `Running on ${accessor.proxyServerEndpoint()}`,
          icon: getStatusMenuIcon(
            "active",
            appearancePreference.menuIcon.style,
            appearancePreference.menuIcon.color,
          ),
          enabled: false,
        }
      : {
          label: "Not Running",
          icon: getStatusMenuIcon(
            "inactive",
            appearancePreference.menuIcon.style,
            appearancePreference.menuIcon.color,
          ),
          enabled: false,
        },
  );

  const proxyServerControlItem = new MenuItem(
    accessor.isProxyServerRunning()
      ? {
          label: "プロキシサーバを停止",
          click: (item, _window, _event) => {
            log.debug("Click tray menu:", item.label);
            handler.stopProxyServer();
          },
        }
      : {
          label: "プロキシサーバを起動",
          click: (item, _window, _event) => {
            log.debug("Click tray menu:", item.label);
            handler.startProxyServer();
          },
        },
  );

  const proxyMenuItems = profilesPreference.profiles.map(
    (proxy, index) =>
      new MenuItem({
        id: String(index),
        label: proxy.name,
        type: "radio",
        checked: profilesPreference.selectedIndex === index,
        icon: getDogBreadsMenuIcon(
          proxy.icon,
          appearancePreference.menuIcon.style,
          appearancePreference.menuIcon.color,
        ),
        toolTip:
          proxy.connectionSetting.protocol === "direct"
            ? "Direct Access"
            : `${proxy.connectionSetting.protocol}://${proxy.connectionSetting.host}:${proxy.connectionSetting.port}`,
        click: (item, _window, _event) => {
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
      accelerator: platformUtils.isMacos ? "Command+," : undefined,
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
      accelerator: platformUtils.isMacos ? "Command+Q" : undefined,
      role: "quit",
    },
  ]);
  _tray.setContextMenu(contextMenu);

  const icon = accessor.isProxyServerRunning()
    ? getDogBreadsTrayIcon(
        profilesPreference.profiles[profilesPreference.selectedIndex].icon,
        appearancePreference.trayIcon.style,
        appearancePreference.trayIcon.color,
      )
    : getAppTrayIcon(appearancePreference.trayIcon.style, appearancePreference.trayIcon.color);
  _tray.setImage(icon);

  log.info("System tray is updated.");
};

export const tray = {
  initialize,
  update,
};
