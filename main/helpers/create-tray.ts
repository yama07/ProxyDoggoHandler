import { Tray, Menu, MenuItem } from "electron";
import path from "path";
import {
  getUpstreamsPreference,
  setUpstreamsPreference,
} from "./preference-accessor";
import { updateUpstreamProxyUrl } from "./proxy-chain-wrapper";
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
    upstreamsPreference.upstreams[upstreamsPreference.selectedIndex].icon
  );
  tray.setImage(iconPath);
};

export default () => {
  const imgFilePath = getIconPath("001-dog");
  tray = new Tray(imgFilePath);

  updateTray();
};
