/** @type {import('next').NextConfig} */
module.exports = {
  output: "export",
  distDir: process.env.NODE_ENV === "production" ? "../app" : ".next",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    externalDir: true,
  },
  webpack: (config) => {
    return config;
  },
};
