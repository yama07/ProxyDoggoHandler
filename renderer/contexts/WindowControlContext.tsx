import React from "react";

export type WindowControlProperties = {
  minimize: () => void;
  maximize: () => void;
  restore: () => void;
  close: () => void;
  isMaximized: boolean;
};

export const windowControlContext =
  React.createContext<WindowControlProperties>(null);

export const WindowControlProvider: React.FC = ({ children }) => {
  const [isMaximized, setIsMaximized] = React.useState(false);

  React.useEffect(() => {
    window.system.onPrefsWindowMaximize(() => setIsMaximized(true));
    window.system.onPrefsWindowUnmaximize(() => setIsMaximized(false));
    (async () =>
      setIsMaximized(await window.system.isMaximizedPrefsWindow()))();
  }, []);

  return (
    <windowControlContext.Provider
      value={{
        minimize: () => {
          window.system.minimizePrefsWindow();
        },
        maximize: () => {
          window.system.maximizePrefsWindow();
        },
        restore: () => {
          window.system.unmaximizePrefsWindow();
        },
        close: () => {
          window.system.closePrefsWindow();
        },
        isMaximized: isMaximized,
      }}
    >
      {children}
    </windowControlContext.Provider>
  );
};
