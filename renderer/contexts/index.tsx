import { AppearancePrefProvider } from "./AppearancePrefContext";
import { ProfilesPrefProvider } from "./ProfilesPrefContext";
import { ProxyPrefProvider } from "./ProxyPrefContext";

type Props = {
  children: React.ReactNode;
};

export const PreferenceProvider: React.FC<Props> = ({ children }) => {
  return (
    <AppearancePrefProvider>
      <ProxyPrefProvider>
        <ProfilesPrefProvider>{children}</ProfilesPrefProvider>
      </ProxyPrefProvider>
    </AppearancePrefProvider>
  );
};
