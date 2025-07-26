import * as z from "zod";

export const proxyPreferenceSchema = z.object({
  port: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "このフィールドを入力してください。"
          : "有効な値を入力してください。",
    })
    .int("有効な値を入力してください。")
    .min(0, "値は0以上にする必要があります。")
    .max(65535, "値は65535以下にする必要があります。"),
  verboseLogging: z.boolean(),
  isLaunchProxyServerAtStartup: z.boolean(),
  ignoreUpstreamProxyCertificate: z.boolean(),
});

export type ProxyPreference = z.infer<typeof proxyPreferenceSchema>;

const defaults: ProxyPreference = {
  isLaunchProxyServerAtStartup: true,
  verboseLogging: false,
  port: 8080,
  ignoreUpstreamProxyCertificate: false,
};

export const proxyPreference = {
  defaults,
};
