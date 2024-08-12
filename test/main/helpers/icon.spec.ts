import { sep } from "node:path";
import { describe, expect, jest, test } from "@jest/globals";
import { nativeImage } from "electron";

import { getDogBreadsTrayIcon } from "../../../main/helpers/icon";

jest.mock("electron-util", () => ({ is: {} }));

jest.mock("electron", () => ({
  nativeImage: {
    createFromPath: jest.fn().mockImplementation(() => ({
      setTemplateImage: jest.fn(),
    })),
  },
}));

describe("getDogBreadsTrayIcon", () => {
  test("linealのwindows用トレイアイコンが得られる", () => {
    const electronUtilMock = jest.requireMock("electron-util") as { is: object };
    electronUtilMock.is = {
      development: true,
      windows: true,
    };

    const icon = getDogBreadsTrayIcon("001-dog", "lineal");

    expect(icon).not.toBeNull();
    expect((nativeImage.createFromPath as jest.Mock).mock.calls[0][0]).toMatch(
      new RegExp(`${["images", "tray-icons", "dog-breads", "lineal", "001-dog.png"].join(sep)}$`),
    );
    expect(icon.setTemplateImage).toBeCalledWith(true);
  });
});
