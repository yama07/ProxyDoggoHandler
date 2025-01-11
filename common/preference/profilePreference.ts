import * as z from "zod";

import { dogIconIdSchema } from "$/icon/dogIcon";

export const credentialSchema = z.object({
  user: z.string(),
  password: z.string(),
});

export type CredentialType = z.infer<typeof credentialSchema>;

export const protocolIds = [
  "direct",
  "http",
  "https",
  "socks4",
  "socks4a",
  "socks5",
  "socks5h",
] as const;
export type ProtocolId = (typeof protocolIds)[number];
export const protocolIdSchema = z.enum(protocolIds);
export const protocols = {
  direct: { label: "Direct" },
  http: { label: "HTTP" },
  https: { label: "HTTPS" },
  socks4: { label: "SOCKS 4" },
  socks4a: { label: "SOCKS 4a" },
  socks5: { label: "SOCKS 5" },
  socks5h: { label: "SOCKS 5h" },
} satisfies Record<ProtocolId, { label: string }>;

export const directConnectionSchema = z.object({
  protocol: z.literal("direct"),
});
export const proxyConnectionSchema = z.object({
  protocol: z.enum(["http", "https", "socks4", "socks4a", "socks5", "socks5h"]),
  host: z.string(),
  port: z
    .number({ message: "このフィールドを入力してください。" })
    .min(0, "値は0以上にする必要があります。")
    .max(65535, "値は65535以下にする必要があります。")
    .default(8080),
  credentials: credentialSchema.optional(),
});
export type ProxyConnectionSetting = z.infer<typeof proxyConnectionSchema>;

const connectionSettingSchema = z.discriminatedUnion("protocol", [
  directConnectionSchema,
  proxyConnectionSchema,
]);

export type ConnectionSetting = z.infer<typeof connectionSettingSchema>;

export const profileSchema = z.object({
  name: z.string(),
  icon: dogIconIdSchema.default("001-dog"),
  connectionSetting: connectionSettingSchema.default({ protocol: "direct" }),
});

export type Profile = z.infer<typeof profileSchema>;

export const profilesPreferenceSchema = z.object({
  selectedIndex: z.number().nonnegative(),
  profiles: z.array(profileSchema),
});

export type ProfilesPreference = z.infer<typeof profilesPreferenceSchema>;

const defaults: ProfilesPreference = {
  selectedIndex: 0,
  profiles: [{ name: "direct", icon: "001-dog", connectionSetting: { protocol: "direct" } }],
};

export const profilesPreference = {
  defaults,
};
