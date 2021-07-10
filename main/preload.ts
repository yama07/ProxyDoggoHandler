import { contextBridge } from 'electron';
import { init, listen, close, updateUpstreamProxyUrl } from './helpers/proxy-chain-wrapper';
import {
  getGeneralPreference, setGeneralPreferenceType,
  getProxiesPreference, setProxiesPreference
} from './helpers/preference-accessor';

contextBridge.exposeInMainWorld('proxyChain', {
  init: (params: GeneralPreferenceType) => { init(params); },
  listen: () => { listen(); },
  close: () => { close(); },
  updateUpstreamProxyUrl: (params?: ConnectionSettingType) => { updateUpstreamProxyUrl(params); },
});

contextBridge.exposeInMainWorld('store', {
  getGeneralPreference: (): GeneralPreferenceType => { return getGeneralPreference(); },
  setGeneralPreference: (preference: GeneralPreferenceType) => { setGeneralPreferenceType(preference); },
  getProxiesPreference: (): ProxiesPreferenceType => { return getProxiesPreference(); },
  setProxiesPreference: (preference: ProxiesPreferenceType) => { setProxiesPreference(preference); },
});
