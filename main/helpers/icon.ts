import { nativeImage, NativeImage } from "electron";
import { is } from "electron-util";
import path from "path";

const imagesPaths: string[] = [
  ...(is.development ? [__dirname, "..", "renderer", "public"] : [__dirname]),
  "images",
];

const trayIconFileSuffix = is.windows ? ".ico" : ".png";

const dogBreadsIconPaths: string[] = [
  ...imagesPaths,
  "tray-icons",
  "dog-breads",
];

export const getDogBreadsTrayIcon = (
  iconId: string,
  style: string
): NativeImage => {
  const icon = nativeImage.createFromPath(
    path.join(...dogBreadsIconPaths, style, iconId + trayIconFileSuffix)
  );
  // カラーの場合はtemplateにしない
  icon.setTemplateImage(!["linealColor", "flatColor"].includes(style));
  return icon;
};

export const getDogBreadsMenuIcon = (
  iconId: string,
  style: string
): NativeImage => {
  const icon = nativeImage.createFromPath(
    path.join(...dogBreadsIconPaths, style, iconId + ".png")
  );
  // カラーの場合はtemplateにしない
  icon.setTemplateImage(!["linealColor", "flatColor"].includes(style));
  return icon;
};

export const getAppTrayIcon = (style: string): NativeImage => {
  // 白色スタイルの場合は、それに合わせる
  const imgBaseName = ["lineal-w", "fill-w"].includes(style)
    ? "dog-house-w"
    : "dog-house";
  const icon = nativeImage.createFromPath(
    path.join(
      ...imagesPaths,
      "tray-icons",
      "app",
      imgBaseName + trayIconFileSuffix
    )
  );
  icon.setTemplateImage(true);
  return icon;
};

export const getStatusMenuIcon = (
  status: "active" | "inactive",
  style: string
): NativeImage => {
  // 白色スタイルの場合は、それに合わせる
  const imgBaseName = ["lineal-w", "fill-w"].includes(style)
    ? `${status}-w`
    : status;
  const icon = nativeImage.createFromPath(
    path.join(...imagesPaths, "tray-icons", "status", imgBaseName + ".png")
  );
  icon.setTemplateImage(true);
  return icon;
};

export const getAppIconPath = (): string =>
  path.join(...imagesPaths, "app-icon.png");
