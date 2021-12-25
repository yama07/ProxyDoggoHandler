import { Tray, Menu, MenuItem, nativeImage, NativeImage } from "electron";
import log from "electron-log";
import { is } from "electron-util";
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

const getIcon = (iconId: string, style: string): NativeImage =>
  nativeImage.createFromPath(
    path.join(__dirname, "images", "tray-icons", style, iconId + ".png")
  );

const getStatusIcon = (status: "active" | "inactive"): NativeImage =>
  nativeImage.createFromPath(
    path.join(__dirname, "images", "status-icons", status + ".png")
  );

export const initializeTray = (param: {
  accessor: Accessor;
  handler: Handler;
}) => {
  accessor = param.accessor;
  handler = param.handler;

  const generalPreference = accessor.generalPreference();
  const icon = getIcon("dog-house", generalPreference.trayIconStyle);
  tray = new Tray(icon);
  tray.addListener("click", () => {
    tray.popUpContextMenu();
  });

  log.info("System tray is initialized.");
};

export const updateTray = () => {
  const upstreamsPreference = accessor.upstreamsPreference();
  const generalPreference = accessor.generalPreference();

  const StatusMenuItem = new MenuItem(
    accessor.isProxyServerRunning()
      ? {
          label: `Running on ${accessor.proxyServerEndpoint()}`,
          icon: getStatusIcon("active"),
          enabled: false,
        }
      : {
          label: "Stopped",
          icon: getStatusIcon("inactive"),
          enabled: false,
        }
  );

  const proxyMenuItems = upstreamsPreference.upstreams.map(
    (proxy, index) =>
      new MenuItem({
        label: proxy.name,
        type: "radio",
        checked: upstreamsPreference.selectedIndex == index,
        icon: getIcon(proxy.icon, generalPreference.menuIconStyle),
        id: String(index),
        click: (item, window, event) => {
          log.debug("Click tray menu:", item.id, item.label);
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

  const icon = getIcon(
    accessor.isProxyServerRunning()
      ? upstreamsPreference.upstreams[upstreamsPreference.selectedIndex].icon
      : "dog-house",
    generalPreference.trayIconStyle
  );
  icon.setTemplateImage(generalPreference.trayIconStyle == "default");
  tray.setImage(icon);

  log.info("System tray is updated.");
};
