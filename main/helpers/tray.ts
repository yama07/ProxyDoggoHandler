import { Tray, Menu, MenuItem, nativeImage } from "electron";
import path from "path";
import {
  getUpstreamsPreference,
  setUpstreamsPreference,
} from "./preference-accessor";
import { updateUpstreamProxyUrl } from "./proxy-chain-wrapper";
import { openPrefsWindow } from "../windows/preferences";
import { openAboutWindow } from "../windows/about";

let tray: Tray | undefined;

const getIconPath = (iconId: string): string =>
  path.join(
    __dirname,
    "tray-icons",
    "dog-breeds",
    "default",
    iconId + "Template.png"
  );

export const initializeTray = () => {
  const imgFilePath = getIconPath("001-dog");
  const icon = nativeImage.createFromPath(imgFilePath);
  tray = new Tray(icon);
  tray.addListener("click", () => {
    tray.popUpContextMenu();
  });

  updateTray();
};

export const updateTray = () => {
  const upstreamsPreference = getUpstreamsPreference();

  const proxyMenuItems = upstreamsPreference.upstreams.map(
    (proxy, index) =>
      new MenuItem({
        label: proxy.name,
        type: "radio",
        checked: upstreamsPreference.selectedIndex == index,
        icon: getIconPath(proxy.icon),
        click: (item, window, event) => {
          upstreamsPreference.selectedIndex = index;
          setUpstreamsPreference(upstreamsPreference);
          updateTray();
          updateUpstreamProxyUrl(
            upstreamsPreference.upstreams[index].connectionSetting
          );
        },
      })
  );
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "環境設定",
      accelerator: process.platform === "darwin" ? "Command+," : null,
      click: () => {
        openPrefsWindow();
      },
    },
    {
      label: "Proxy Doggo Switcherについて",
      click: () => {
        openAboutWindow();
      },
    },
    { type: "separator" },
    ...proxyMenuItems,
    { type: "separator" },
    {
      label: "終了",
      accelerator: process.platform === "darwin" ? "Command+Q" : null,
      role: "quit",
    },
  ]);
  tray.setContextMenu(contextMenu);

  const iconPath = getIconPath(
    upstreamsPreference.upstreams[upstreamsPreference.selectedIndex].icon
  );
  tray.setImage(iconPath);
};
