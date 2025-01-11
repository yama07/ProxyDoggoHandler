import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import { type ProfilesPreference, profilesPreference } from "$/preference/profilePreference";

export const upstreamsPrefContext = createContext<ProfilesPreference>(profilesPreference.defaults);

export const setUpstreamsPrefContext = createContext<Dispatch<SetStateAction<ProfilesPreference>>>(
  () => undefined,
);

type Props = {
  children: React.ReactNode;
};

export const UpstreamsPrefProvider: React.FC<Props> = ({ children }) => {
  const [upstreamsPref, setUpstreamsPref] = useState<ProfilesPreference>(
    profilesPreference.defaults,
  );

  useEffect(() => {
    (async () => setUpstreamsPref(await window.prefsStore.getUpstreams()))();

    window.prefsStore.onUpstreamsDidChange((newValue, oldValue) => setUpstreamsPref(newValue));

    return () => {
      window.prefsStore.onUpstreamsDidChange(undefined);
    };
  }, []);

  const setUpstreamsPrefWrapper = useCallback(
    (
      newPreference:
        | ProfilesPreference
        | ((prevPreference: ProfilesPreference) => ProfilesPreference),
    ) => {
      const _newPreference =
        newPreference instanceof Function ? newPreference(upstreamsPref) : newPreference;
      window.prefsStore.setUpstreams(_newPreference);
    },
    [upstreamsPref],
  );

  return (
    <upstreamsPrefContext.Provider value={upstreamsPref}>
      <setUpstreamsPrefContext.Provider value={setUpstreamsPrefWrapper}>
        {children}
      </setUpstreamsPrefContext.Provider>
    </upstreamsPrefContext.Provider>
  );
};
