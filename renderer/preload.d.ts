import type { PrefsStoreApi, PrefsWindowApi, SystemApi } from "#/preload";

declare global {
  interface Window {
    system: SystemApi;
    prefsWindow: PrefsWindowApi;
    prefsStore: PrefsStoreApi;
  }
}
