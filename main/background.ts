import { app, ipcMain } from "electron";
import serve from "electron-serve";
import { createTray } from "./helpers";
import { listen, close } from "./helpers/proxy-chain-wrapper";
import {
  getGeneralPreference,
  setGeneralPreference,
  getProxiesPreference,
  setProxiesPreference,
  onProxiesPreferenceDidChange,
  onGeneralPreferenceDidChange,
} from "./helpers/preference-accessor";
import { updateTray } from "./helpers/create-tray";

const isProd: boolean = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  createTray();
})();

app.on("window-all-closed", () => {});

const unsubscribeFunctions = [
  onGeneralPreferenceDidChange((newValue, oldValue) => {
    close();
    listen(newValue);
  }),
  onProxiesPreferenceDidChange((newValue, oldValue) => {
    updateTray();
  }),
];

app.on("quit", () => {
  unsubscribeFunctions.map((unsubscribe) => {
    unsubscribe();
  });
});

// IPC handling //////////////////////////////////

ipcMain.handle("store.getGeneralPreference", (event): GeneralPreferenceType => {
  return getGeneralPreference();
});
ipcMain.handle(
  "store.setGeneralPreference",
  (event, preference: GeneralPreferenceType) => {
    setGeneralPreference(preference);
  }
);
ipcMain.handle("store.getProxiesPreference", (event): ProxiesPreferenceType => {
  return getProxiesPreference();
});
ipcMain.handle(
  "store.setProxiesPreference",
  (event, preference: ProxiesPreferenceType) => {
    setProxiesPreference(preference);
  }
);

ipcMain.handle("app.updateTray", (event) => {
  updateTray();
});
