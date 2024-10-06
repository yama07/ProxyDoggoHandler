import type { PrefWindowApiType, StoreApiType, SystemApiType } from "#/preload";

declare global {
  interface Window {
    system: SystemApiType;
    prefWindow: PrefWindowApiType;
    store: StoreApiType;
  }
}
