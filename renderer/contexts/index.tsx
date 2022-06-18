import { GeneralPreferenceProvider } from "./GeneralPreferenceContext";
import { ProxyPreferenceProvider } from "./ProxyPreferenceContext";
import { UpstreamsPreferenceProvider } from "./UpstreamsPreferencesContext";

type Props = {
  children: React.ReactNode;
};

export const PreferenceProvider: React.FC<Props> = ({ children }) => {
  return (
    <GeneralPreferenceProvider>
      <ProxyPreferenceProvider>
        <UpstreamsPreferenceProvider>{children}</UpstreamsPreferenceProvider>
      </ProxyPreferenceProvider>
    </GeneralPreferenceProvider>
  );
};
