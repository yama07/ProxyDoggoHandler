import path from "node:path";
import { type NativeImage, nativeImage } from "electron";

import type { DogIconId } from "$/icon/dogIcon";
import { type IconStyleId, iconStyles, type MonochromeColorId } from "$/icon/iconStyle";

import { platformUtils } from "./platform-utils";

const imagesPaths: string[] = [
  ...(platformUtils.isDevelopment ? [__dirname, "..", "renderer", "public"] : [__dirname]),
  "images",
];

const trayIconFileSuffix = platformUtils.isWindows ? ".ico" : ".png";

const dogBreadsIconPaths: string[] = [...imagesPaths, "tray-icons", "dog-breads"];

const getSource = (style: IconStyleId, color: MonochromeColorId): string => {
  const iconStyle = iconStyles[style];

  if (iconStyle.colorMode === "monochrome") {
    return iconStyle.source[color];
  }
  return iconStyle.source;
};

const isMonochrome = (style: IconStyleId): boolean => iconStyles[style].colorMode === "monochrome";

export const getDogBreadsTrayIcon = (
  iconId: DogIconId,
  style: IconStyleId,
  color: MonochromeColorId,
): NativeImage => {
  const icon = nativeImage.createFromPath(
    path.join(...dogBreadsIconPaths, getSource(style, color), iconId + trayIconFileSuffix),
  );
  // モノクロの場合のみtemplateにする
  icon.setTemplateImage(isMonochrome(style));

  return icon;
};

export const getDogBreadsMenuIcon = (
  iconId: DogIconId,
  style: IconStyleId,
  color: MonochromeColorId,
): NativeImage => {
  const icon = nativeImage.createFromPath(
    path.join(...dogBreadsIconPaths, getSource(style, color), `${iconId}.png`),
  );
  // モノクロの場合のみtemplateにする
  icon.setTemplateImage(isMonochrome(style));

  return icon;
};

export const getAppTrayIcon = (style: IconStyleId, color: MonochromeColorId): NativeImage => {
  // モノクロの場合は色を合わせる
  const imgBaseName = isMonochrome(style) && color === "white" ? "dog-house-w" : "dog-house";
  const icon = nativeImage.createFromPath(
    path.join(...imagesPaths, "tray-icons", "app", imgBaseName + trayIconFileSuffix),
  );
  icon.setTemplateImage(true);

  return icon;
};

export const getStatusMenuIcon = (
  status: "active" | "inactive",
  style: IconStyleId,
  color: MonochromeColorId,
): NativeImage => {
  // モノクロの場合は色を合わせる
  const imgBaseName = isMonochrome(style) && color === "white" ? `${status}-w` : status;
  const icon = nativeImage.createFromPath(
    path.join(...imagesPaths, "tray-icons", "status", `${imgBaseName}.png`),
  );
  icon.setTemplateImage(true);
  return icon;
};

export const getAppIconPath = (): string => path.join(...imagesPaths, "app-icon.png");
