module.exports = {
  webpack: (config) =>
    Object.assign(config, {
      entry: {
        background: "./main/background.ts",
        preload: "./preload/preload.ts",
      },
    }),
};
