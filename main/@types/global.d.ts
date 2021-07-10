declare global {
    interface Window {
        proxyChain: IProxyChain,
        store: IStore,
    }
}

export interface IProxyChain {
    init: (params: GeneralPreferenceType) => void;
    listen: () => void,
    close: () => void,
    updateUpstreamProxyUrl: (params?: ConnectionSettingType) => void,
}

export interface IStore {
    getGeneralPreference: () => GeneralPreferenceType,
    setGeneralPreference: (GeneralPreferenceType) => void,
    getProxiesPreference: () => ProxiesPreferenceType,
    setProxiesPreference: (ProxiesPreferenceType) => void,
}
