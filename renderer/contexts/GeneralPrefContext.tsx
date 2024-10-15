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
export const generalPrefContext = createContext<GeneralPreferenceType>(defaultValues);

export const setGeneralPrefContext = createContext<Dispatch<SetStateAction<GeneralPreferenceType>>>(
  () => undefined,
);

type Props = {
  children: React.ReactNode;
};

export const GeneralPrefProvider: React.FC<Props> = ({ children }) => {
  const [generalPref, setGeneralPref] = useState<GeneralPreferenceType>(defaultValues);

  useEffect(() => {
    (async () => setGeneralPref(await window.prefsStore.getGeneral()))();

    window.prefsStore.onGeneralDidChange((newValue, oldValue) => setGeneralPref(newValue));

    return () => {
      window.prefsStore.onGeneralDidChange(undefined);
    };
  }, []);

  const setGeneralPrefWrapper = useCallback(
    (
      newPreference:
        | GeneralPreferenceType
        | ((prevPreference: GeneralPreferenceType) => GeneralPreferenceType),
    ) => {
      const _newPreference =
        newPreference instanceof Function ? newPreference(generalPref) : newPreference;
      window.prefsStore.setGeneral(_newPreference);
    },
    [generalPref],
  );

  return (
    <generalPrefContext.Provider value={generalPref}>
      <setGeneralPrefContext.Provider value={setGeneralPrefWrapper}>
        {children}
      </setGeneralPrefContext.Provider>
    </generalPrefContext.Provider>
  );
};
