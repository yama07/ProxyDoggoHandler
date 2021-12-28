import { ipcMain } from "electron";
import { is } from "electron-util";
import {
  getGeneralPreference,
  setGeneralPreference,
  getProxyPreference,
  setProxyPreference,
  getUpstreamsPreference,
  setUpstreamsPreference,
} from "./preference-accessor";
import { updateTray } from "./tray";

export const initializeIpc = () => {
  ipcMain.handle("system.isMacos", (event): boolean => is.macos);

  ipcMain.handle(
    "store.getGeneralPreference",
    (event): GeneralPreferenceType => {
      return getGeneralPreference();
    }
  );

  ipcMain.handle(
    "store.setGeneralPreference",
    (event, preference: GeneralPreferenceType) => {
      setGeneralPreference(preference);
    }
  );

  ipcMain.handle("store.getProxyPreference", (event): ProxyPreferenceType => {
    return getProxyPreference();
  });

  ipcMain.handle(
    "store.setProxyPreference",
    (event, preference: ProxyPreferenceType) => {
      setProxyPreference(preference);
    }
  );

  ipcMain.handle(
    "store.getUpstreamsPreference",
    (event): UpstreamsPreferenceType => {
      return getUpstreamsPreference();
    }
  );

  ipcMain.handle(
    "store.setUpstreamsPreference",
    (event, preference: UpstreamsPreferenceType) => {
      setUpstreamsPreference(preference);
    }
  );

  ipcMain.handle("app.updateTray", (event) => {
    updateTray();
  });
};
