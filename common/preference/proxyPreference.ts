import * as z from "zod";

export const proxyPreferenceSchema = z.object({
  port: z
    .number({ message: "このフィールドを入力してください。" })
    .min(0, "値は0以上にする必要があります。")
    .max(65535, "値は65535以下にする必要があります。")
    .default(8080),
  verboseLogging: z.boolean(),
  isLaunchProxyServerAtStartup: z.boolean(),
});

export type ProxyPreference = z.infer<typeof proxyPreferenceSchema>;

const defaults: ProxyPreference = {
  isLaunchProxyServerAtStartup: true,
  verboseLogging: false,
  port: 8080,
};

export const proxyPreference = {
  defaults,
};
