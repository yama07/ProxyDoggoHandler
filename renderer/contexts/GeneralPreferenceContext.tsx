import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

const defaultValues: GeneralPreferenceType = {
  isOpenAtStartup: true,
  isLaunchProxyServerAtStartup: false,
  trayIconStyle: "lineal",
  menuIconStyle: "lineal",
};
export const generalPreferenceContext = createContext<GeneralPreferenceType>(defaultValues);

export const setGeneralPreferenceContext = createContext<
  Dispatch<SetStateAction<GeneralPreferenceType>>
>(() => undefined);

type Props = {
  children: React.ReactNode;
};

export const GeneralPreferenceProvider: React.FC<Props> = ({ children }) => {
  const [generalPreference, setGeneralPreference] = useState<GeneralPreferenceType>(defaultValues);

  useEffect(() => {
    (async () => setGeneralPreference(await window.store.getGeneralPreference()))();

    window.store.onGeneralPreferenceDidChange((newValue, oldValue) =>
      setGeneralPreference(newValue),
    );

    return () => {
      window.store.removeOnGeneralPreferenceDidChangeListeners();
    };
  }, []);

  const setGeneralPreferenceWrapper = useCallback(
    (
      newPreference:
        | GeneralPreferenceType
        | ((prevPreference: GeneralPreferenceType) => GeneralPreferenceType),
    ) => {
      const _newPreference =
        newPreference instanceof Function ? newPreference(generalPreference) : newPreference;
      window.store.setGeneralPreference(_newPreference);
    },
    [generalPreference],
  );

  return (
    <generalPreferenceContext.Provider value={generalPreference}>
      <setGeneralPreferenceContext.Provider value={setGeneralPreferenceWrapper}>
        {children}
      </setGeneralPreferenceContext.Provider>
    </generalPreferenceContext.Provider>
  );
};
