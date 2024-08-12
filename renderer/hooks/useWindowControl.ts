import { useEffect, useState } from "react";

export const useWindowControl = () => {
  const [isMaximized, setIsMaximized] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    window.prefsWindow.onPrefsWindowMaximize(() => setIsMaximized(true));
    window.prefsWindow.onPrefsWindowUnmaximize(() => setIsMaximized(false));
    (async () => setIsMaximized(await window.prefsWindow.isMaximizedPrefsWindow()))();

    return () => {
      window.prefsWindow.onPrefsWindowMaximize(undefined);
      window.prefsWindow.onPrefsWindowUnmaximize(undefined);
    };
  }, []);

  const minimize = () => window.prefsWindow.minimizePrefsWindow();
  const maximize = () => window.prefsWindow.maximizePrefsWindow();
  const restore = () => window.prefsWindow.unmaximizePrefsWindow();
  const close = () => window.prefsWindow.closePrefsWindow();

  return { minimize, maximize, restore, close, isMaximized };
};
