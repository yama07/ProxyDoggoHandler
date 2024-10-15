import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

const defaultValues: ProxyPreferenceType = {
  port: 8080,
  verbose: false,
};

export const proxyPrefContext = createContext<ProxyPreferenceType>(defaultValues);

export const setProxyPrefContext = createContext<Dispatch<SetStateAction<ProxyPreferenceType>>>(
  () => undefined,
);

type Props = {
  children: React.ReactNode;
};

export const ProxyPrefProvider: React.FC<Props> = ({ children }) => {
  const [proxyPref, setProxyPref] = useState<ProxyPreferenceType>(defaultValues);

  useEffect(() => {
    (async () => setProxyPref(await window.prefsStore.getProxy()))();

    window.prefsStore.onProxyDidChange((newValue, oldValue) => setProxyPref(newValue));

    return () => {
      window.prefsStore.onProxyDidChange(undefined);
    };
  }, []);

  const setProxyPrefWrapper = useCallback(
    (
      newPreference:
        | ProxyPreferenceType
        | ((prevPreference: ProxyPreferenceType) => ProxyPreferenceType),
    ) => {
      const _newPreference =
        newPreference instanceof Function ? newPreference(proxyPref) : newPreference;
      window.prefsStore.setProxy(_newPreference);
    },
    [proxyPref],
  );

  return (
    <proxyPrefContext.Provider value={proxyPref}>
      <setProxyPrefContext.Provider value={setProxyPrefWrapper}>
        {children}
      </setProxyPrefContext.Provider>
    </proxyPrefContext.Provider>
  );
};
