import { GeneralPreferenceProvider } from "./GeneralPreferenceContext";
import { ProxyPreferenceProvider } from "./ProxyPreferenceContext";
import { UpstreamsPreferenceProvider } from "./UpstreamsPreferencesContext";

export const PreferenceProvider: React.FC = ({ children }) => {
  return (
    <GeneralPreferenceProvider>
      <ProxyPreferenceProvider>
        <UpstreamsPreferenceProvider>{children}</UpstreamsPreferenceProvider>
      </ProxyPreferenceProvider>
    </GeneralPreferenceProvider>
  );
};
