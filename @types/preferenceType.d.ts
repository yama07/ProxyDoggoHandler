type PreferenceType = {
  general: GeneralPreferenceType;
  proxy: ProxyPreferenceType;
  upstreams: UpstreamsPreferenceType;
};

type GeneralPreferenceType = {
  isOpenAtStartup: boolean;
};

type ProxyPreferenceType = {
  port: number;
  verbose: boolean;
};

type UpstreamsPreferenceType = {
  selectedIndex: number;
  upstreams: UpstreamType[];
};

type UpstreamType = {
  name: string;
  icon: string;
  connectionSetting?: ConnectionSettingType;
};

type ConnectionSettingType = {
  host: string;
  port: number;
  credentials?: {
    user: string;
    password: string;
  };
};
