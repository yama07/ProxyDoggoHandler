import * as z from "zod";

import { appearancePreferenceSchema } from "./appearancePreference";
import { profilesPreferenceSchema } from "./profilePreference";
import { proxyPreferenceSchema } from "./proxyPreference";

export const preferenceSchema = z.object({
  appearance: appearancePreferenceSchema,
  profiles: profilesPreferenceSchema,
  proxy: proxyPreferenceSchema,
});

export type Preference = z.infer<typeof preferenceSchema>;
