import Store from "electron-store";

import { type AppearancePreference, appearancePreference } from "$/preference/appearancePreference";
import { type ProfilesPreference, profilesPreference } from "$/preference/profilePreference";
import { type ProxyPreference, proxyPreference } from "$/preference/proxyPreference";

type Preference = {
  appearance: AppearancePreference;
  profiles: ProfilesPreference;
  proxy: ProxyPreference;
};

const defaults: Preference = {
  appearance: appearancePreference.defaults,
  profiles: profilesPreference.defaults,
  proxy: proxyPreference.defaults,
};

let storeInstance: Store<Preference> | undefined;
const getStoreInsance = (): Store<Preference> => {
  if (storeInstance === undefined) {
    storeInstance = new Store<Preference>({ defaults });
  }
  return storeInstance;
};

export const prefsStore = {
  get: <T extends keyof Preference>(key: T): Preference[T] => getStoreInsance().get(key),
  set: <T extends keyof Preference>(key: T, value: Preference[T]) =>
    getStoreInsance().set(key, value),
  onDidChange: <T extends keyof Preference>(
    key: T,
    callback: (newValue?: Preference[T], oldValue?: Preference[T]) => void,
  ): (() => void) => {
    return getStoreInsance().onDidChange(key, callback);
  },
};
