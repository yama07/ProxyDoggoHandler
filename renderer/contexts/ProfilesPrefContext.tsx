import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import { type ProfilesPreference, profilesPreference } from "$/preference/profilePreference";

export const profilesPrefContext = createContext<ProfilesPreference>(profilesPreference.defaults);

export const setProfilesPrefContext = createContext<Dispatch<SetStateAction<ProfilesPreference>>>(
  () => undefined,
);

type Props = {
  children: React.ReactNode;
};

export const ProfilesPrefProvider: React.FC<Props> = ({ children }) => {
  const [profilesPref, setProfilesPref] = useState<ProfilesPreference>(profilesPreference.defaults);

  useEffect(() => {
    (async () => setProfilesPref(await window.prefsStore.getProfiles()))();

    window.prefsStore.onProfilesDidChange((newValue, oldValue) => setProfilesPref(newValue));

    return () => {
      window.prefsStore.onProfilesDidChange(undefined);
    };
  }, []);

  const setProfilesPrefWrapper = useCallback(
    (
      newPreference:
        | ProfilesPreference
        | ((prevPreference: ProfilesPreference) => ProfilesPreference),
    ) => {
      const _newPreference =
        newPreference instanceof Function ? newPreference(profilesPref) : newPreference;
      window.prefsStore.setProfiles(_newPreference);
    },
    [profilesPref],
  );

  return (
    <profilesPrefContext.Provider value={profilesPref}>
      <setProfilesPrefContext.Provider value={setProfilesPrefWrapper}>
        {children}
      </setProfilesPrefContext.Provider>
    </profilesPrefContext.Provider>
  );
};
