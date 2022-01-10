import { nativeImage, NativeImage } from "electron";
import { is } from "electron-util";
import path from "path";

const imagesPaths: string[] = [
  ...(is.development ? [__dirname, "..", "renderer", "public"] : [__dirname]),
  "images",
];

const iconFileSuffix = is.windows ? ".ico" : ".png";

export const getDogBreadsTrayIcon = (
  iconId: string,
  style: string
): NativeImage => {
  const icon = nativeImage.createFromPath(
    path.join(
      ...imagesPaths,
      "tray-icons",
      "dog-breads",
      style,
      iconId + iconFileSuffix
    )
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
    path.join(...imagesPaths, "tray-icons", "app", imgBaseName + iconFileSuffix)
  );
  icon.setTemplateImage(true);
  return icon;
};

export const getStatusTrayIcon = (
  status: "active" | "inactive",
  style: string
): NativeImage => {
  // 白色スタイルの場合は、それに合わせる
  const imgBaseName = ["lineal-w", "fill-w"].includes(style)
    ? `${status}-w`
    : status;
  const icon = nativeImage.createFromPath(
    path.join(
      ...imagesPaths,
      "tray-icons",
      "status",
      imgBaseName + iconFileSuffix
    )
  );
  icon.setTemplateImage(true);
  return icon;
};

export const getAppIconPath = (): string =>
  path.join(...imagesPaths, "app-icon.png");
