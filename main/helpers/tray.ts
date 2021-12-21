import { Tray, Menu, MenuItem, nativeImage } from "electron";
import { is } from "electron-util";
import fs from "fs";
import path from "path";

type Accessor = {
  generalPreference: () => GeneralPreferenceType;
  upstreamsPreference: () => UpstreamsPreferenceType;
  proxyServerEndpoint: () => String | undefined;
  isProxyServerRunning: () => boolean;
};

type Handler = {
  clickPrefsWindowMenu: () => void;
  clickAboutWindow: () => void;
  selectUpstream: (index: number) => void;
};

let tray: Tray | undefined;
let handler: Handler;
let accessor: Accessor;

const getIconPath = (iconId: string, style: string): string => {
  const basePath = path.join(__dirname, "images", "tray-icons", style);
  return fs.existsSync(path.join(basePath, iconId + "Template@1x.png"))
    ? path.join(basePath, iconId + "Template.png")
    : path.join(basePath, iconId + ".png");
};

const getStatusIconPath = (status: "active" | "inactive"): string =>
  path.join(__dirname, "images", "status-icons", status + ".png");

export const initializeTray = (param: {
  accessor: Accessor;
  handler: Handler;
}) => {
  accessor = param.accessor;
  handler = param.handler;

  const generalPreference = accessor.generalPreference();
  const imgFilePath = getIconPath("dog-house", generalPreference.trayIconStyle);
  const icon = nativeImage.createFromPath(imgFilePath);
  tray = new Tray(icon);
  tray.addListener("click", () => {
    tray.popUpContextMenu();
  });
};

export const updateTray = () => {
  const upstreamsPreference = accessor.upstreamsPreference();
  const generalPreference = accessor.generalPreference();

  const StatusMenuItem = new MenuItem(
    accessor.isProxyServerRunning
      ? {
          label: `Running on ${accessor.proxyServerEndpoint()}`,
          icon: getStatusIconPath("active"),
          enabled: false,
        }
      : {
          label: "Stopped",
          icon: getStatusIconPath("inactive"),
          enabled: false,
        }
  );

  const proxyMenuItems = upstreamsPreference.upstreams.map(
    (proxy, index) =>
      new MenuItem({
        label: proxy.name,
        type: "radio",
        checked: upstreamsPreference.selectedIndex == index,
        icon: getIconPath(proxy.icon, generalPreference.menuIconStyle),
        id: String(index),
        click: (item, window, event) => {
          handler.selectUpstream(Number(item.id));
        },
      })
  );

  const contextMenu = Menu.buildFromTemplate([
    StatusMenuItem,
    { type: "separator" },
    {
      label: "環境設定",
      accelerator: is.macos ? "Command+," : null,
      click: handler.clickPrefsWindowMenu,
    },
    {
      label: "Proxy Doggo Handlerについて",
      click: handler.clickAboutWindow,
    },
    { type: "separator" },
    ...proxyMenuItems,
    { type: "separator" },
    {
      label: "終了",
      accelerator: is.macos ? "Command+Q" : null,
      role: "quit",
    },
  ]);
  tray.setContextMenu(contextMenu);

  const iconPath = getIconPath(
    upstreamsPreference.upstreams[upstreamsPreference.selectedIndex].icon,
    generalPreference.trayIconStyle
  );
  tray.setImage(iconPath);
};
