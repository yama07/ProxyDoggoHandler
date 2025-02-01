import * as z from "zod";

import { dogIconIdSchema } from "$/icon/dogIcon";

export const credentialSchema = z.object({
  user: z
    .string()
    .nonempty("このフィールドを入力してください。")
    .max(128, { message: "128文字以下で入力してください。" }),
  password: z
    .string()
    .nonempty("このフィールドを入力してください。")
    .max(128, { message: "128文字以下で入力してください。" }),
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
  protocol: z.enum(["direct"]),
});
export const proxyConnectionSchema = z.object({
  protocol: z.enum(["http", "https", "socks4", "socks4a", "socks5", "socks5h"]),
  host: z
    .string()
    .nonempty("このフィールドを入力してください。")
    .max(128, "128文字以下で入力してください。"),
  port: z
    .number({
      required_error: "このフィールドを入力してください。",
      invalid_type_error: "有効な値を入力してください。",
    })
    .int("有効な値を入力してください。")
    .min(0, "値は0以上にする必要があります。")
    .max(65535, "値は65535以下にする必要があります。"),
  credential: credentialSchema.optional(),
});
export type ProxyConnectionSetting = z.infer<typeof proxyConnectionSchema>;

const connectionSettingSchema = z.discriminatedUnion("protocol", [
  directConnectionSchema,
  proxyConnectionSchema,
]);

export type ConnectionSetting = z.infer<typeof connectionSettingSchema>;

export const profileSchema = z.object({
  name: z.string(),
  icon: dogIconIdSchema,
  connectionSetting: connectionSettingSchema,
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
