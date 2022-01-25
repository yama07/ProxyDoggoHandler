import React, { Dispatch, SetStateAction } from "react";

export const proxyPreferenceContext =
  React.createContext<ProxyPreferenceType>(null);

export const setProxyPreferenceContext =
  React.createContext<Dispatch<SetStateAction<ProxyPreferenceType>>>(null);

export const ProxyPreferenceProvider: React.FC = ({ children }) => {
  const [proxyPreference, setProxyPreference] =
    React.useState<ProxyPreferenceType>({ port: 8080, verbose: false });

  React.useEffect(() => {
    (async () => setProxyPreference(await window.store.getProxyPreference()))();

    window.store.onProxyPreferenceDidChange((newValue, oldValue) =>
      setProxyPreference(newValue)
    );

    return () => {
      window.store.removeOnProxyPreferenceDidChangeListeners();
    };
  }, []);

  const setProxyPreferenceWrapper = React.useCallback(
    (
      newPreference:
        | ProxyPreferenceType
        | ((prevPreference: ProxyPreferenceType) => ProxyPreferenceType)
    ) => {
      const _newPreference =
        newPreference instanceof Function
          ? newPreference(proxyPreference)
          : newPreference;
      window.store.setProxyPreference(_newPreference);
    },
    [proxyPreference]
  );

  return (
    <proxyPreferenceContext.Provider value={proxyPreference}>
      <setProxyPreferenceContext.Provider value={setProxyPreferenceWrapper}>
        {children}
      </setProxyPreferenceContext.Provider>
    </proxyPreferenceContext.Provider>
  );
};
