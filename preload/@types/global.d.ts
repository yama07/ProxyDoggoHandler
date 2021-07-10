declare global {
    interface Window {
        proxyChain: IProxyChain,
        store: IStore,
    }
}

export interface IProxyChain {
    init: () => void;
    listen: () => void,
    close: () => void,
}

export interface IStore {
    getGeneralPreference: () => GeneralPreferenceType,
    setGeneralPreference: (GeneralPreferenceType) => void,
    getProxiesPreference: () => ProxiesPreferenceType,
    setProxiesPreference: (ProxiesPreferenceType) => void,
}
