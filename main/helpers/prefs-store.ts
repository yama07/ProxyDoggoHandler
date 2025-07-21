import fs from "node:fs";
import path from "node:path";
import Store from "electron-store";

import { type Preference, preferenceSchema } from "$/preference";
import { appearancePreference } from "$/preference/appearancePreference";
import { profilesPreference } from "$/preference/profilePreference";
import { proxyPreference } from "$/preference/proxyPreference";

const defaults: Preference = {
  appearance: appearancePreference.defaults,
  profiles: profilesPreference.defaults,
  proxy: proxyPreference.defaults,
};

let storeInstance: Store<Preference> | undefined;
const getStoreInsance = (): Store<Preference> => {
  if (storeInstance === undefined) {
    storeInstance = new Store<Preference>({ defaults, clearInvalidConfig: true });
  }
  return storeInstance;
};

const getTimestamp = () => {
  const date = new Date();
  const y = date.getFullYear();
  const m = `0${date.getMonth() + 1}`.slice(-2);
  const d = `0${date.getDate()}`.slice(-2);
  const h = `0${date.getHours()}`.slice(-2);
  const min = `0${date.getMinutes()}`.slice(-2);
  const s = `0${date.getSeconds()}`.slice(-2);
  return `${y}${m}${d}${h}${min}${s}`;
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
  archive: () => {
    const oldPath = getStoreInsance().path;
    const newPath = path.join(
      path.dirname(oldPath),
      `${path.basename(oldPath)}_${getTimestamp()}${path.extname(oldPath)}`,
    );
    console.debug(`Rename preference file "${oldPath}" to "{newPath}".`);
    fs.renameSync(oldPath, newPath);
    storeInstance = undefined;
  },
  isValid: (): boolean => {
    const result = preferenceSchema.safeParse(getStoreInsance().store);
    console.debug("Prefs file parse error:", result.error?.message);
    return result.success;
  },
};
