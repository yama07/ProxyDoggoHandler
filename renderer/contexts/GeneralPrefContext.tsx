import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import { type AppearancePreference, appearancePreference } from "$/preference/appearancePreference";

export const generalPrefContext = createContext<AppearancePreference>(
  appearancePreference.defaults,
);

export const setGeneralPrefContext = createContext<Dispatch<SetStateAction<AppearancePreference>>>(
  () => undefined,
);

type Props = {
  children: React.ReactNode;
};

export const GeneralPrefProvider: React.FC<Props> = ({ children }) => {
  const [generalPref, setGeneralPref] = useState<AppearancePreference>(
    appearancePreference.defaults,
  );

  useEffect(() => {
    (async () => setGeneralPref(await window.prefsStore.getAppearance()))();

    window.prefsStore.onGeneralDidChange((newValue, oldValue) => setGeneralPref(newValue));

    return () => {
      window.prefsStore.onGeneralDidChange(undefined);
    };
  }, []);

  const setGeneralPrefWrapper = useCallback(
    (
      newPreference:
        | AppearancePreference
        | ((prevPreference: AppearancePreference) => AppearancePreference),
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
