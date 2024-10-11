import { useEffect, useState } from "react";

export const useWindowControl = () => {
  const [isMaximized, setIsMaximized] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    window.prefsWindow.onMaximize(() => setIsMaximized(true));
    window.prefsWindow.onUnmaximize(() => setIsMaximized(false));
    (async () => setIsMaximized(await window.prefsWindow.isMaximized()))();

    return () => {
      window.prefsWindow.onMaximize(undefined);
      window.prefsWindow.onUnmaximize(undefined);
    };
  }, []);

  return {
    minimize: window.prefsWindow.minimize,
    maximize: window.prefsWindow.maximize,
    restore: window.prefsWindow.unmaximize,
    close: window.prefsWindow.close,
    isMaximized,
  };
};
