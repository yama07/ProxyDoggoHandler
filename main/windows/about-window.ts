import path from "node:path";
import openAboutWindow from "about-window";
import type { BrowserWindow } from "electron";

import { getAppIconPath } from "../helpers/icon";

let browserWindow: BrowserWindow | undefined;

const open = () => {
  if (browserWindow && !browserWindow.isDestroyed()) {
    browserWindow.show();
    browserWindow.focus();
    return;
  }

  browserWindow = openAboutWindow({
    icon_path: getAppIconPath(),
    product_name: "Proxy Doggo Handler",
    copyright: "Copyright © 2022 Naoki Yamamoto",
    description:
      '<div>Icons made by <a href="https://www.flaticon.com/authors/vitaly-gorbachev" title="Vitaly Gorbachev">Vitaly Gorbachev</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>',
    use_inner_html: true,
    package_json_dir: path.resolve(`${__dirname}/../`),
  });
};

export const aboutWindow = {
  open,
};
