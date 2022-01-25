import React, { Dispatch, SetStateAction } from "react";

export const generalPreferenceContext =
  React.createContext<GeneralPreferenceType>(null);

export const setGeneralPreferenceContext =
  React.createContext<Dispatch<SetStateAction<GeneralPreferenceType>>>(null);

export const GeneralPreferenceProvider: React.FC = ({ children }) => {
  const [generalPreference, setGeneralPreference] =
    React.useState<GeneralPreferenceType>({
      isOpenAtStartup: true,
      isLaunchProxyServerAtStartup: false,
      trayIconStyle: "lineal",
      menuIconStyle: "lineal",
    });

  React.useEffect(() => {
    (async () =>
      setGeneralPreference(await window.store.getGeneralPreference()))();

    window.store.onGeneralPreferenceDidChange((newValue, oldValue) =>
      setGeneralPreference(newValue)
    );

    return () => {
      window.store.removeOnGeneralPreferenceDidChangeListeners();
    };
  }, []);

  const setGeneralPreferenceWrapper = React.useCallback(
    (
      newPreference:
        | GeneralPreferenceType
        | ((prevPreference: GeneralPreferenceType) => GeneralPreferenceType)
    ) => {
      const _newPreference =
        newPreference instanceof Function
          ? newPreference(generalPreference)
          : newPreference;
      window.store.setGeneralPreference(_newPreference);
    },
    [generalPreference]
  );

  return (
    <generalPreferenceContext.Provider value={generalPreference}>
      <setGeneralPreferenceContext.Provider value={setGeneralPreferenceWrapper}>
        {children}
      </setGeneralPreferenceContext.Provider>
    </generalPreferenceContext.Provider>
  );
};
