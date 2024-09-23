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

export const proxyPreferenceContext = createContext<ProxyPreferenceType>(defaultValues);

export const setProxyPreferenceContext = createContext<
  Dispatch<SetStateAction<ProxyPreferenceType>>
>(() => undefined);

type Props = {
  children: React.ReactNode;
};

export const ProxyPreferenceProvider: React.FC<Props> = ({ children }) => {
  const [proxyPreference, setProxyPreference] = useState<ProxyPreferenceType>(defaultValues);

  useEffect(() => {
    (async () => setProxyPreference(await window.store.getProxyPreference()))();

    window.store.onProxyPreferenceDidChange((newValue, oldValue) => setProxyPreference(newValue));

    return () => {
      window.store.removeOnProxyPreferenceDidChangeListeners();
    };
  }, []);

  const setProxyPreferenceWrapper = useCallback(
    (
      newPreference:
        | ProxyPreferenceType
        | ((prevPreference: ProxyPreferenceType) => ProxyPreferenceType),
    ) => {
      const _newPreference =
        newPreference instanceof Function ? newPreference(proxyPreference) : newPreference;
      window.store.setProxyPreference(_newPreference);
    },
    [proxyPreference],
  );

  return (
    <proxyPreferenceContext.Provider value={proxyPreference}>
      <setProxyPreferenceContext.Provider value={setProxyPreferenceWrapper}>
        {children}
      </setProxyPreferenceContext.Provider>
    </proxyPreferenceContext.Provider>
  );
};
