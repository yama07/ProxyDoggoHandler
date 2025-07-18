import log from "electron-log";
import { Server, redactUrl } from "proxy-chain";

import {
  type ConnectionSetting,
  isDirectConnectionSetting,
  isHttpConnectionSetting,
  isSocksConnectionSetting,
} from "$/preference/profilePreference";
import type { ProxyPreference } from "$/preference/proxyPreference";

import { buildMatcher } from "./globMatcher";

type ProxyServerStatus = "stopped" | "running";

let server: Server | undefined = undefined;
let upstreamProxyUrl: string | undefined = undefined;
let bypassMatcher: ReturnType<typeof buildMatcher> | undefined = undefined;
let status: ProxyServerStatus = "stopped";
let onStatusChangeCallback: ((status: ProxyServerStatus) => void) | undefined;

const initialize = (params: ProxyPreference) => {
  log.debug("Proxy init params:", params);

  server = new Server({
    port: params.port,
    verbose: params.verboseLogging,
    prepareRequestFunction: ({ request, hostname }) => {
      console.debug("Request:", request.method, request.url);

      let upstream: string | undefined = upstreamProxyUrl;
      if (bypassMatcher?.(hostname)) {
        console.debug("Switch to direct access to match the bypass list.");
        upstream = undefined;
      }
      console.debug("upstreamProxyUrl:", upstream);

      return { upstreamProxyUrl: upstream };
    },
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

const setConnectionSetting = (setting: ConnectionSetting) => {
  log.debug("Upstream URl update params:", setting);

  if (isDirectConnectionSetting(setting)) {
    bypassMatcher = undefined;
    upstreamProxyUrl = undefined;
  } else {
    bypassMatcher = buildMatcher(setting.bypass);

    let protocol: string = setting.protocol;
    if (isSocksConnectionSetting(setting) && setting.remoteDns) {
      if (setting.protocol === "socks4") protocol = "socks4a";
      if (setting.protocol === "socks5") protocol = "socks5h";
    }

    let credential = "";
    if (setting.credential) {
      const user = encodeURI(setting.credential.user);
      const password = encodeURI(setting.credential.password);
      credential = `${user}:${password}@`;
    }

    upstreamProxyUrl = `${protocol}://${credential}${setting.host}:${setting.port}`;
    log.debug("New upstream proxy URL:", upstreamProxyUrl);
  }

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
  setConnectionSetting,
  getEndpoint,
  isRunning,
  onStatusDidChange,
};
