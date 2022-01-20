process.env.DEBUG = "electron-notarize*";

const { notarize } = require("electron-notarize");

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== "darwin") {
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  return await notarize({
    appBundleId: "jp.yama07.ProxyDoggoHandler",
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLEID,
    appleIdPassword: "@keychain:AC_PASSWORD",
    ascProvider: process.env.ASC_PROVIDER,
  });
};
