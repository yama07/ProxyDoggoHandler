import React from "react";

export type SystemProperties = {
  isMacos: boolean;
};

export const systemPropertiesContext =
  React.createContext<SystemProperties>(null);

export const SystemPropertiesProvider: React.FC = ({ children }) => {
  const [isMacos, setIsMacos] = React.useState(false);
  React.useEffect(() => {
    (async () => setIsMacos(await window.system.isMacos()))();
  }, []);

  return (
    <systemPropertiesContext.Provider value={{ isMacos: isMacos }}>
      {children}
    </systemPropertiesContext.Provider>
  );
};
