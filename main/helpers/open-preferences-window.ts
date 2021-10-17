import { createWindow } from ".";

const isProd: boolean = process.env.NODE_ENV === "production";

export default async () => {
  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    minWidth: 1000,
    minHeight: 600,
    titleBarStyle: "hidden",
  });

  if (isProd) {
    await mainWindow.loadURL("app://./preferences.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/preferences`);
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }
};
