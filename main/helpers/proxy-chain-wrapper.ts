import ProxyChain from 'proxy-chain';

let server: any = null;
let upstreamProxyUrl: string | null = null;

export const init = (params: GeneralPreferenceType) => {
  close();

  console.log(`exec init: port: ${params.port}, verbose: ${params.verbose}`);
  server = new ProxyChain.Server({
    port: params.port,
    verbose: params.verbose,
    prepareRequestFunction: ({ request, username, password, hostname, port, isHttp, connectionId }) => {
      return {
        upstreamProxyUrl: upstreamProxyUrl
      };
    },
  });
};

export const listen = () => {
  server?.listen(() => {
    console.log(`Proxy server is listening on port ${server.port}`);
  });
};

export const close = () => {
  server?.close(true, () => {
    console.log('Proxy server was closed.');
  });
  server = null;
};

export const updateUpstreamProxyUrl = (params?: ConnectionSettingType) => {
  if (params) {
    let credential: string = "";
    if (params?.credentials) {
      const user = encodeURI(params.credentials.user);
      const password = encodeURI(params.credentials.password);
      credential = `${user}:${password}@`;
    }
    upstreamProxyUrl = `http://${credential}${params.host}:${params.port}`
  } else {
    upstreamProxyUrl = null
  }
};
