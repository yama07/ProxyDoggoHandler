const path = require("path");
const { merge } = require("webpack-merge");

module.exports = {
  webpack: (config, env) => {
    const preload = merge(config, {
      target: "electron-preload",
      output: {
        libraryTarget: "commonjs",
        filename: "preload.js",
      },
      entry: path.join(process.cwd(), "preload", "preload.ts"),
    });

    return [config, preload];
  },
};
