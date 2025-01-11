import * as z from "zod";

import { iconStyleIdSchema, monochromeColorSchema } from "$/icon/iconStyle";

export const appearancePreferenceSchema = z.object({
  isOpenAtStartup: z.boolean(),
  trayIcon: z.object({
    style: iconStyleIdSchema,
    color: monochromeColorSchema,
  }),
  menuIcon: z.object({
    style: iconStyleIdSchema,
    color: monochromeColorSchema,
  }),
  frameTheme: z.enum(["system", "windows", "macos"]).default("system"),
});

export type AppearancePreference = z.infer<typeof appearancePreferenceSchema>;

const defaults: AppearancePreference = {
  isOpenAtStartup: true,
  menuIcon: { style: "fill", color: "black" },
  trayIcon: { style: "fill", color: "black" },
  frameTheme: "system",
};

export const appearancePreference = {
  defaults,
};
