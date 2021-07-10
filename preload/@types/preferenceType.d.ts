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
  upstreams: [
    {
      name: string,
      icon: string,
      connectionSetting?: {
        host: string,
        port: number,
        credentials?: {
          user: string,
          password: string,
        }
      },
    }
  ]
};