import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import { type ProxyPreference, proxyPreference } from "$/preference/proxyPreference";

export const proxyPrefContext = createContext<ProxyPreference>(proxyPreference.defaults);

export const setProxyPrefContext = createContext<Dispatch<SetStateAction<ProxyPreference>>>(
  () => undefined,
);

type Props = {
  children: React.ReactNode;
};

export const ProxyPrefProvider: React.FC<Props> = ({ children }) => {
  const [proxyPref, setProxyPref] = useState<ProxyPreference>(proxyPreference.defaults);

  useEffect(() => {
    (async () => setProxyPref(await window.prefsStore.getProxy()))();

    window.prefsStore.onProxyDidChange((newValue, oldValue) => setProxyPref(newValue));

    return () => {
      window.prefsStore.onProxyDidChange(undefined);
    };
  }, []);

  const setProxyPrefWrapper = useCallback(
    (newPreference: ProxyPreference | ((prevPreference: ProxyPreference) => ProxyPreference)) => {
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
