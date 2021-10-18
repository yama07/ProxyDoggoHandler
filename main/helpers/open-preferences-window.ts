import isDev from "electron-is-dev";
import { createWindow } from ".";

export default async () => {
  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    minWidth: 1000,
    minHeight: 600,
    titleBarStyle: "hidden",
  });

  if (isDev) {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/preferences`);
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    await mainWindow.loadURL("app://./preferences.html");
  }
};
