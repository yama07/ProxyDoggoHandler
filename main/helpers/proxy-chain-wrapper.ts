import ProxyChain from "proxy-chain";

type ProxyServerStatus = "stopped" | "running";

let server: any = undefined;
let upstreamProxyUrl: string | undefined = undefined;
let proxyServerEndpoint: string | undefined = undefined;
let status: ProxyServerStatus = "stopped";
let onStatusChangeCallback: ((status: ProxyServerStatus) => void) | undefined;

export const initializeProxyServer = (params: ProxyPreferenceType) => {
  closePorxyPort();

  proxyServerEndpoint = `http://localhost:${params.port}`;
  server = new ProxyChain.Server({
    port: params.port,
    verbose: params.verbose,
    prepareRequestFunction: () => {
      return {
        upstreamProxyUrl: upstreamProxyUrl,
      };
    },
  });
};

export const listenProxyPort = () => {
  server?.listen(() => {
    console.log(`Proxy server is listening on port ${server.port}`);
    status = "running";
    onStatusChangeCallback ?? onStatusChangeCallback("running");
  });
};

export const closePorxyPort = () => {
  server?.close(true, () => {
    console.log("Proxy server was closed.");
    status = "stopped";
    onStatusChangeCallback ?? onStatusChangeCallback("stopped");
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
    upstreamProxyUrl = `http://${credential}${params.host}:${params.port}`;
  } else {
    upstreamProxyUrl = null;
  }
};

export const getProxyServerEndpoint = (): string | undefined =>
  proxyServerEndpoint;

export const isProxyServerRunning = (): boolean => status == "running";

export const onProxyStatusDidChange = (
  callback: (status: ProxyServerStatus) => void
) => {
  onStatusChangeCallback = callback;
};
