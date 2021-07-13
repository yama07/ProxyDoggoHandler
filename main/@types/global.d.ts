declare global {
    interface Window {
        proxyChain: IProxyChain,
        store: IStore,
        app: IApp,
    }
};

export interface IProxyChain {
    init: (params: GeneralPreferenceType) => void;
    listen: () => void,
    close: () => void,
    updateUpstreamProxyUrl: (params?: ConnectionSettingType) => void,
};

export interface IStore {
    getGeneralPreference: () => Promise<GeneralPreferenceType>,
    setGeneralPreference: (GeneralPreferenceType) => void,
    getProxiesPreference: () => Promise<ProxiesPreferenceType>,
    setProxiesPreference: (ProxiesPreferenceType) => void,
};

export interface IApp {
    updateTray: () => void,
};
