import { nativeImage, NativeImage } from "electron";
import { is } from "electron-util";
import path from "path";

const imagesPaths: string[] = [
  ...(is.development ? [__dirname, "..", "renderer", "public"] : [__dirname]),
  "images",
];

export const getIcon = (iconId: string, style: string): NativeImage => {
  const icon = nativeImage.createFromPath(
    path.join(...imagesPaths, "tray-icons", style, iconId + ".png")
  );
  // カラーの場合はtemplateにしない
  icon.setTemplateImage(!["linealColor", "flatColor"].includes(style));
  return icon;
};

export const getAppIcon = (style: string): NativeImage => {
  // 白黒反転スタイルの場合は、それに合わせる
  const imgBaseName = ["lineal_inverse", "fill_inverse"].includes(style)
    ? "dog-house_inverse"
    : "dog-house";
  const icon = nativeImage.createFromPath(
    path.join(...imagesPaths, "app-icons", imgBaseName + ".png")
  );
  icon.setTemplateImage(true);
  return icon;
};

export const getStatusIcon = (
  status: "active" | "inactive",
  style: string
): NativeImage => {
  // 白黒反転スタイルの場合は、それに合わせる
  const imgBaseName = ["lineal_inverse", "fill_inverse"].includes(style)
    ? `${status}_inverse`
    : status;
  const icon = nativeImage.createFromPath(
    path.join(...imagesPaths, "status-icons", imgBaseName + ".png")
  );
  icon.setTemplateImage(true);
  return icon;
};
