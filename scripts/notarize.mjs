import { notarize } from "@electron/notarize";

process.env.DEBUG = "electron-notarize*";

export default async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;

  // macOSではない、あるいはENABLE_NOTARIZEフラグが有効ではない場合は公証を行わない
  if (electronPlatformName !== "darwin" || process.env.ENABLE_NOTARIZE === undefined) {
    console.log("skipped macOS notarization in afterSign.");
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  await notarize({
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLEID,
    appleIdPassword: process.env.APPLEIDPASS,
    teamId: process.env.TEAMID,
  });
}
