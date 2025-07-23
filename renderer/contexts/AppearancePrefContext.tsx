import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

import { type AppearancePreference, appearancePreference } from "$/preference/appearancePreference";

export const appearancePrefContext = createContext<AppearancePreference>(
  appearancePreference.defaults,
);

export const setAppearancePrefContext = createContext<
  Dispatch<SetStateAction<AppearancePreference>>
>(() => undefined);

type Props = {
  children: React.ReactNode;
};

export const AppearancePrefProvider: React.FC<Props> = ({ children }) => {
  const [appearancePref, setAppearancePref] = useState<AppearancePreference>(
    appearancePreference.defaults,
  );

  useEffect(() => {
    (async () => setAppearancePref(await window.prefsStore.getAppearance()))();

    window.prefsStore.onAppearanceDidChange((newValue, _oldValue) => setAppearancePref(newValue));

    return () => {
      window.prefsStore.onAppearanceDidChange(undefined);
    };
  }, []);

  const setAppearancePrefWrapper = useCallback(
    (
      newPreference:
        | AppearancePreference
        | ((prevPreference: AppearancePreference) => AppearancePreference),
    ) => {
      const _newPreference =
        newPreference instanceof Function ? newPreference(appearancePref) : newPreference;
      window.prefsStore.setAppearance(_newPreference);
    },
    [appearancePref],
  );

  return (
    <appearancePrefContext.Provider value={appearancePref}>
      <setAppearancePrefContext.Provider value={setAppearancePrefWrapper}>
        {children}
      </setAppearancePrefContext.Provider>
    </appearancePrefContext.Provider>
  );
};
