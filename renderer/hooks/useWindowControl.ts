import React from "react";

export const useWindowControl = () => {
  const [isMaximized, setIsMaximized] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    window.system.onPrefsWindowMaximize(() => setIsMaximized(true));
    window.system.onPrefsWindowUnmaximize(() => setIsMaximized(false));
    (async () =>
      setIsMaximized(await window.system.isMaximizedPrefsWindow()))();

    return () => {
      window.system.onPrefsWindowMaximize(undefined);
      window.system.onPrefsWindowUnmaximize(undefined);
    };
  }, []);

  const minimize = () => window.system.minimizePrefsWindow();
  const maximize = () => window.system.maximizePrefsWindow();
  const restore = () => window.system.unmaximizePrefsWindow();
  const close = () => window.system.closePrefsWindow();

  return { minimize, maximize, restore, close, isMaximized };
};
