import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

export const upstreamsPreferenceContext = createContext<UpstreamsPreferenceType>(null);

export const setUpstreamsPreferenceContext =
  createContext<Dispatch<SetStateAction<UpstreamsPreferenceType>>>(null);

type Props = {
  children: React.ReactNode;
};

export const UpstreamsPreferenceProvider: React.FC<Props> = ({ children }) => {
  const [upstreamsPreference, setUpstreamsPreference] = useState<UpstreamsPreferenceType>({
    selectedIndex: 0,
    upstreams: [{ name: "Direct", icon: "001-dog", connectionSetting: null }],
  });

  useEffect(() => {
    (async () => setUpstreamsPreference(await window.store.getUpstreamsPreference()))();

    window.store.onUpstreamsPreferenceDidChange((newValue, oldValue) =>
      setUpstreamsPreference(newValue),
    );

    return () => {
      window.store.removeOnUpstreamsPreferenceDidChangeListeners();
    };
  }, []);

  const setUpstreamsPreferenceWrapper = useCallback(
    (
      newPreference:
        | UpstreamsPreferenceType
        | ((prevPreference: UpstreamsPreferenceType) => UpstreamsPreferenceType),
    ) => {
      const _newPreference =
        newPreference instanceof Function ? newPreference(upstreamsPreference) : newPreference;
      window.store.setUpstreamsPreference(_newPreference);
    },
    [upstreamsPreference],
  );

  return (
    <upstreamsPreferenceContext.Provider value={upstreamsPreference}>
      <setUpstreamsPreferenceContext.Provider value={setUpstreamsPreferenceWrapper}>
        {children}
      </setUpstreamsPreferenceContext.Provider>
    </upstreamsPreferenceContext.Provider>
  );
};
