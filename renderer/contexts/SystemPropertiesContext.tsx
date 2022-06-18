import React from "react";

export type SystemProperties = {
  isMacos: boolean;
};

export const systemPropertiesContext =
  React.createContext<SystemProperties>(null);

type Props = {
  children: React.ReactNode;
};

export const SystemPropertiesProvider: React.FC<Props> = ({ children }) => {
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
