import React, { Dispatch, SetStateAction } from "react";

export const upstreamsPreferenceContext =
  React.createContext<UpstreamsPreferenceType>(null);

export const setUpstreamsPreferenceContext =
  React.createContext<Dispatch<SetStateAction<UpstreamsPreferenceType>>>(null);

export const UpstreamsPreferenceProvider: React.FC = ({ children }) => {
  const [upstreamsPreference, setUpstreamsPreference] =
    React.useState<UpstreamsPreferenceType>({
      selectedIndex: 0,
      upstreams: [{ name: "Direct", icon: "001-dog", connectionSetting: null }],
    });

  React.useEffect(() => {
    (async () =>
      setUpstreamsPreference(await window.store.getUpstreamsPreference()))();

    window.store.onUpstreamsPreferenceDidChange((newValue, oldValue) =>
      setUpstreamsPreference(newValue)
    );

    return () => {
      window.store.removeOnUpstreamsPreferenceDidChangeListeners();
    };
  }, []);

  const setUpstreamsPreferenceWrapper = React.useCallback(
    (
      newPreference:
        | UpstreamsPreferenceType
        | ((prevPreference: UpstreamsPreferenceType) => UpstreamsPreferenceType)
    ) => {
      const _newPreference =
        newPreference instanceof Function
          ? newPreference(upstreamsPreference)
          : newPreference;
      window.store.setUpstreamsPreference(_newPreference);
    },
    [upstreamsPreference]
  );

  return (
    <upstreamsPreferenceContext.Provider value={upstreamsPreference}>
      <setUpstreamsPreferenceContext.Provider
        value={setUpstreamsPreferenceWrapper}
      >
        {children}
      </setUpstreamsPreferenceContext.Provider>
    </upstreamsPreferenceContext.Provider>
  );
};
