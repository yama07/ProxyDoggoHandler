import * as z from "zod";

import {
  isDirectConnectionSetting,
  isSocksConnectionSetting,
  type Profile,
  profileSchema,
} from "$/preference/profilePreference";

export const formValuesSchema = z
  .object({
    icon: z.string(),
    name: z.string(),
    connectionSetting: z.object({
      protocol: z.string(),
      host: z.string(),
      port: z.string(),
      needsAuth: z.boolean(),
      credential: z.object({
        user: z.string(),
        password: z.string(),
      }),
      bypass: z.string(),
      remoteDns: z.boolean(),
    }),
  })
  .transform((value) =>
    value.connectionSetting.protocol === "direct"
      ? {
          icon: value.icon,
          name: value.name,
          connectionSetting: {
            protocol: value.connectionSetting.protocol,
          },
        }
      : {
          icon: value.icon,
          name: value.name,
          connectionSetting: {
            protocol: value.connectionSetting.protocol,
            host: value.connectionSetting.host,
            port: value.connectionSetting.port ? Number(value.connectionSetting.port) : undefined,
            ...(value.connectionSetting.needsAuth
              ? { credential: value.connectionSetting.credential }
              : {}),
            bypass: value.connectionSetting.bypass,
            remoteDns: value.connectionSetting.remoteDns,
          },
        },
  )
  .pipe(profileSchema);

export type FormValues = z.input<typeof formValuesSchema>;

export const defaults: FormValues = {
  icon: "001-dog",
  name: "",
  connectionSetting: {
    protocol: "http",
    host: "",
    port: "",
    needsAuth: false,
    credential: {
      user: "",
      password: "",
    },
    bypass: "localhost,127.0.0.1",
    remoteDns: true,
  },
} as const;

export const profileToFormValues = (profile?: Profile): FormValues =>
  profile
    ? {
        icon: profile.icon,
        name: profile.name,
        connectionSetting: isDirectConnectionSetting(profile.connectionSetting)
          ? {
              protocol: profile.connectionSetting.protocol,
              host: "",
              port: "",
              needsAuth: false,
              credential: {
                user: "",
                password: "",
              },
              bypass: "",
              remoteDns: true,
            }
          : {
              protocol: profile.connectionSetting.protocol,
              host: profile.connectionSetting.host,
              port: String(profile.connectionSetting.port),
              needsAuth: !!profile.connectionSetting.credential,
              credential: {
                user: profile.connectionSetting.credential?.user ?? "",
                password: profile.connectionSetting.credential?.password ?? "",
              },
              bypass: profile.connectionSetting.bypass,
              remoteDns: isSocksConnectionSetting(profile.connectionSetting)
                ? profile.connectionSetting.remoteDns
                : true,
            },
      }
    : defaults;
