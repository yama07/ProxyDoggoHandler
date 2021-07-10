import { contextBridge } from 'electron';
import ProxyChain from 'proxy-chain';
import Store from 'electron-store';

contextBridge.exposeInMainWorld('proxyChain', {
  init: () => { init(); },
  listen: () => { listen(); },
  close: () => { close(); },
});

contextBridge.exposeInMainWorld('store', {
  getGeneralPreference: (): GeneralPreferenceType => { return getGeneralPreference(); },
  setGeneralPreference: (preference: GeneralPreferenceType) => {
    setGeneralPreferenceType(preference);
  },
  getProxiesPreference: (): ProxiesPreferenceType => { return getProxiesPreference(); },
  setProxiesPreference: (preference: ProxiesPreferenceType) => {
    setProxiesPreference(preference);
    updateUpstreamProxyUrl();
  },
});


const store = new Store<PreferenceType>({
  defaults: {
    general: { port: 8080, verbose: false },
    proxies: {
      selectedIndex: 0,
      upstreams: [{ name: "Dynamic", icon: "001-dog", connectionSetting: null }]
    }
  },
});

const getGeneralPreference = () => {
  return store.get("general");
};

const setGeneralPreferenceType = (preference: GeneralPreferenceType) => {
  store.set("general", preference);
};

const getProxiesPreference = () => {
  return store.get("proxies");
};
const setProxiesPreference = (preference: ProxiesPreferenceType) => {
  store.set("proxies", preference);
};


let server: any = null;
let upstreamProxyUrl: string | null = null;

const init = () => {
  close();

  const preference = getGeneralPreference();
  console.log(`exec init: port: ${preference.port}, verbose: ${preference.verbose}`);
  server = new ProxyChain.Server({
    port: preference.port,
    verbose: preference.verbose,
    prepareRequestFunction: ({ request, username, password, hostname, port, isHttp, connectionId }) => {
      return {
        upstreamProxyUrl: upstreamProxyUrl
      };
    },
  });
};

const listen = () => {
  server?.listen(() => {
    console.log(`Proxy server is listening on port ${8000}`);
  });
};

const close = () => {
  server?.close(true, () => {
    console.log('Proxy server was closed.');
  });
  server = null;
};

const updateUpstreamProxyUrl = () => {
  const preference = getProxiesPreference();
  const upstream = preference.upstreams[preference.selectedIndex];

  const setting = upstream.connectionSetting
  if (setting) {
    let credential: string = "";
    if (setting?.credentials) {
      const user = encodeURI(setting.credentials.user);
      const password = encodeURI(setting.credentials.password);
      credential = `${user}:${password}@`;
    }
    upstreamProxyUrl = `http://${credential}${setting.host}:${setting.port}`
  } else {
    upstreamProxyUrl = null
  }
};
