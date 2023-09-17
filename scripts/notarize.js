process.env.DEBUG = "@electron/notarize*";

const { notarize } = require("@electron/notarize");

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;

  // macOSではない、あるいはENABLE_NOTARIZEフラグが
  // 有効ではない場合は公証を行わない
  if (
    electronPlatformName !== "darwin" ||
    process.env.ENABLE_NOTARIZE === undefined
  ) {
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  return await notarize({
    tool: "notarytool",
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLEID,
    appleIdPassword: "@keychain:AC_PASSWORD",
    teamId: process.env.TEAMID,
  });
};
