import { Tray, Menu, MenuItem } from "electron";
import path from "path";
import {
  getGeneralPreference,
  getProxiesPreference,
  setProxiesPreference,
} from "./preference-accessor";
import { listen, updateUpstreamProxyUrl } from "./proxy-chain-wrapper";
import openPreferencesWindow from "./open-preferences-window";

let tray: Tray = null;

const getIconPath = (iconId: string): string =>
  path.join(
    __dirname,
    "tray-icons",
    "dog-breeds",
    iconId + (process.platform === "win32" ? ".ico" : ".png")
  );

export const updateTray = () => {
  const proxiesPreference = getProxiesPreference();

  const proxyMenuItems = proxiesPreference.upstreams.map(
    (proxy, index) =>
      new MenuItem({
        label: proxy.name,
        type: "radio",
        checked: proxiesPreference.selectedIndex == index,
        icon: getIconPath(proxy.icon),
        click: (item, window, event) => {
          proxiesPreference.selectedIndex = index;
          setProxiesPreference(proxiesPreference);
          updateTray();
          updateUpstreamProxyUrl(
            proxiesPreference.upstreams[index].connectionSetting
          );
        },
      })
  );
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "環境設定",
      accelerator:
        (process.platform === "darwin" ? "Command" : "Control") + "+,",
      click: () => {
        openPreferencesWindow();
      },
    },
    { type: "separator" },
    ...proxyMenuItems,
    { type: "separator" },
    {
      label: "終了",
      accelerator:
        (process.platform === "darwin" ? "Command" : "Control") + "+Q",
      role: "quit",
    },
  ]);
  tray.setContextMenu(contextMenu);

  const iconPath = getIconPath(
    proxiesPreference.upstreams[proxiesPreference.selectedIndex].icon
  );
  tray.setImage(iconPath);
};

export default () => {
  const imgFilePath = getIconPath("001-dog");
  tray = new Tray(imgFilePath);

  updateTray();

  listen(getGeneralPreference());
};
