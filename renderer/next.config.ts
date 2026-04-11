import type { NextConfig } from "next";

const config: NextConfig = {
  output: "export",
  distDir: process.env.NODE_ENV === "production" ? "../app" : ".next",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    externalDir: true,
  },
};

export default config;
