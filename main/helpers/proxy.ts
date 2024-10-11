import log from "electron-log";
import { Server, redactUrl } from "proxy-chain";

type ProxyServerStatus = "stopped" | "running";

let server: Server | undefined = undefined;
let upstreamProxyUrl: string | undefined = undefined;
let status: ProxyServerStatus = "stopped";
let onStatusChangeCallback: ((status: ProxyServerStatus) => void) | undefined;

const initialize = (params: ProxyPreferenceType) => {
  log.debug("Proxy init params:", params);

  server = new Server({
    port: params.port,
    verbose: params.verbose,
    prepareRequestFunction: () => ({ upstreamProxyUrl }),
  });

  server.on("requestFailed", ({ request, error }) => {
    log.info(`Request ${request.url} failed.`);
    log.error(error);
  });

  log.info("Proxy server is initialized.");
};

const listen = () => {
  log.debug("Attempt to listen proxy port.");

  server?.listen(() => {
    log.info(`Proxy server is listening on port ${server?.port}.`);
    status = "running";
    onStatusChangeCallback?.("running");
  });
};

const close = async () => {
  log.debug("Attempt to close proxy port.");

  await server?.close(true);
  log.info("Proxy server was closed.");
  status = "stopped";
  onStatusChangeCallback?.("stopped");
};

const setUpstreamProxyUrl = (params?: ConnectionSettingType) => {
  log.debug("Upstream URl update params:", params);

  if (params) {
    let credential = "";
    if (params.credentials) {
      const user = encodeURI(params.credentials.user);
      const password = encodeURI(params.credentials.password);
      credential = `${user}:${password}@`;
    }
    upstreamProxyUrl = `http://${credential}${params.host}:${params.port}`;
  } else {
    upstreamProxyUrl = undefined;
  }
  log.debug("New upstream proxy URL:", upstreamProxyUrl);
  log.info(
    `Upstream proxy URL is updated to "${
      upstreamProxyUrl ? redactUrl(upstreamProxyUrl, "****") : "None (direct access mode)"
    }".`,
  );
};

const getEndpoint = (): string | undefined =>
  server ? `http://localhost:${server.port}` : undefined;

const isRunning = (): boolean => status === "running";

const onStatusDidChange = (callback: (status: ProxyServerStatus) => void) => {
  onStatusChangeCallback = callback;
};

export const proxy = {
  initialize,
  listen,
  close,
  setUpstreamProxyUrl,
  getEndpoint,
  isRunning,
  onStatusDidChange,
};
