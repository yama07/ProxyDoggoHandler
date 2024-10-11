import type { PrefsWindowApiType, StoreApiType, SystemApiType } from "#/preload";

declare global {
  interface Window {
    system: SystemApiType;
    prefsWindow: PrefsWindowApiType;
    store: StoreApiType;
  }
}
