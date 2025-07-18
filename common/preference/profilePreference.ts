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

export const protocolIds = ["direct", "http", "https", "socks4", "socks5"] as const;
export type ProtocolId = (typeof protocolIds)[number];
export const protocolIdSchema = z.enum(protocolIds);
export const protocols = {
  direct: { label: "Direct" },
  http: { label: "HTTP" },
  https: { label: "HTTPS" },
  socks4: { label: "SOCKS v4" },
  socks5: { label: "SOCKS v5" },
} satisfies Record<ProtocolId, { label: string }>;

export const directConnectionSchema = z.object({
  protocol: z.enum(["direct"]),
});
export type DirectConnectionSetting = z.infer<typeof directConnectionSchema>;

export const httpConnectionSchema = z.object({
  protocol: z.enum(["http", "https"]),
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
  bypass: z.string().max(128, "128文字以下で入力してください。"),
});
export type HttpConnectionSetting = z.infer<typeof httpConnectionSchema>;

export const socksConnectionSchema = z.object({
  protocol: z.enum(["socks4", "socks5"]),
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
  bypass: z.string().max(128, "128文字以下で入力してください。"),
  remoteDns: z.boolean(),
});
export type SocksConnectionSetting = z.infer<typeof socksConnectionSchema>;

const connectionSettingSchema = z.discriminatedUnion("protocol", [
  directConnectionSchema,
  httpConnectionSchema,
  socksConnectionSchema,
]);
export type ConnectionSetting = z.infer<typeof connectionSettingSchema>;

export const isDirectConnectionSetting = (
  value: ConnectionSetting,
): value is DirectConnectionSetting => {
  return value.protocol === "direct";
};
export const isHttpConnectionSetting = (
  value: ConnectionSetting,
): value is HttpConnectionSetting => {
  return value.protocol === "http" || value.protocol === "https";
};
export const isSocksConnectionSetting = (
  value: ConnectionSetting,
): value is SocksConnectionSetting => {
  return value.protocol === "socks4" || value.protocol === "socks5";
};

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
