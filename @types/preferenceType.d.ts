// eslint-disable-next-line no-unused-vars
type PreferenceType = {
  general: GeneralPreferenceType;
  proxy: ProxyPreferenceType;
  upstreams: UpstreamsPreferenceType;
};

type GeneralPreferenceType = {
  isOpenAtStartup: boolean;
  isLaunchProxyServerAtStartup: boolean;
  trayIconStyle: string;
  menuIconStyle: string;
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
