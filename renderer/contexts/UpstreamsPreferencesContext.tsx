import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

const defaultValues: UpstreamsPreferenceType = {
  selectedIndex: 0,
  upstreams: [{ name: "Direct", icon: "001-dog", connectionSetting: undefined }],
};

export const upstreamsPreferenceContext = createContext<UpstreamsPreferenceType>(defaultValues);

export const setUpstreamsPreferenceContext = createContext<
  Dispatch<SetStateAction<UpstreamsPreferenceType>>
>(() => undefined);

type Props = {
  children: React.ReactNode;
};

export const UpstreamsPreferenceProvider: React.FC<Props> = ({ children }) => {
  const [upstreamsPreference, setUpstreamsPreference] =
    useState<UpstreamsPreferenceType>(defaultValues);

  useEffect(() => {
    (async () => setUpstreamsPreference(await window.store.getUpstreamsPreference()))();

    window.store.onUpstreamsPreferenceDidChange((newValue, oldValue) =>
      setUpstreamsPreference(newValue),
    );

    return () => {
      window.store.onUpstreamsPreferenceDidChange(undefined);
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
