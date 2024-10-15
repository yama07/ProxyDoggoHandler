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

export const upstreamsPrefContext = createContext<UpstreamsPreferenceType>(defaultValues);

export const setUpstreamsPrefContext = createContext<
  Dispatch<SetStateAction<UpstreamsPreferenceType>>
>(() => undefined);

type Props = {
  children: React.ReactNode;
};

export const UpstreamsPrefProvider: React.FC<Props> = ({ children }) => {
  const [upstreamsPref, setUpstreamsPref] = useState<UpstreamsPreferenceType>(defaultValues);

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
        | UpstreamsPreferenceType
        | ((prevPreference: UpstreamsPreferenceType) => UpstreamsPreferenceType),
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
