import { useEffect, useState } from "react";

export const useWindowControl = () => {
  const [isMaximized, setIsMaximized] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    window.prefWindow.onMaximize(() => setIsMaximized(true));
    window.prefWindow.onUnmaximize(() => setIsMaximized(false));
    (async () => setIsMaximized(await window.prefWindow.isMaximized()))();

    return () => {
      window.prefWindow.onMaximize(undefined);
      window.prefWindow.onUnmaximize(undefined);
    };
  }, []);

  return {
    minimize: window.prefWindow.minimize,
    maximize: window.prefWindow.maximize,
    restore: window.prefWindow.unmaximize,
    close: window.prefWindow.close,
    isMaximized,
  };
};
