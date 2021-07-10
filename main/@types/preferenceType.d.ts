type PreferenceType = {
  general: GeneralPreferenceType,
  proxies: ProxiesPreferenceType,
};

type GeneralPreferenceType = {
  port: number,
  verbose: boolean,
};

type ProxiesPreferenceType = {
  selectedIndex: number,
  upstreams: [UpstreamType],
};

type UpstreamType = {
  name: string,
  icon: string,
  connectionSetting?: ConnectionSettingType,
};

type ConnectionSettingType = {
  host: string,
  port: number,
  credentials?: {
    user: string,
    password: string,
  }
};
