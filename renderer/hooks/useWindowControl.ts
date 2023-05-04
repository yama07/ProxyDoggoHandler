import React from "react";

export const useWindowControl = () => {
  const [isMaximized, setIsMaximized] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    window.prefsWindow.onPrefsWindowMaximize(() => setIsMaximized(true));
    window.prefsWindow.onPrefsWindowUnmaximize(() => setIsMaximized(false));
    (async () =>
      setIsMaximized(await window.prefsWindow.isMaximizedPrefsWindow()))();

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
