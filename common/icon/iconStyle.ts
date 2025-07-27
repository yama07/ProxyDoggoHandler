import * as z from "zod";

export const iconStyleIds = ["lineal", "fill", "linealColor", "flatColor"] as const;

export const iconStyleIdSchema = z.enum(iconStyleIds);

export type IconStyleId = (typeof iconStyleIds)[number];

export const monochromeColorIds = ["black", "white"] as const;

export const monochromeColorSchema = z.enum(monochromeColorIds);

export type MonochromeColorId = (typeof monochromeColorIds)[number];

type IconStyleMetadata = {
  label: string;
  colorMode: "monochrome" | "color";
};

type MonochromeIconStyle = IconStyleMetadata & {
  colorMode: "monochrome";
  source: { [key in MonochromeColorId]: string };
};

type ColorIconStyle = IconStyleMetadata & {
  colorMode: "color";
  source: string;
};
export type IconStyle = MonochromeIconStyle | ColorIconStyle;

export const iconStyles = {
  lineal: {
    label: "Lineal",
    colorMode: "monochrome",
    source: { white: "lineal-w", black: "lineal" },
  },
  fill: {
    label: "Fill",
    colorMode: "monochrome",
    source: { white: "fill-w", black: "fill" },
  },
  linealColor: {
    label: "Lineal Color",
    colorMode: "color",
    source: "linealColor",
  },
  flatColor: {
    label: "Flat Color",
    colorMode: "color",
    source: "flatColor",
  },
} satisfies Record<IconStyleId, IconStyle>;
