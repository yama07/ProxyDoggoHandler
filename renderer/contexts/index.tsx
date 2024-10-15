import { GeneralPrefProvider } from "./GeneralPrefContext";
import { ProxyPrefProvider } from "./ProxyPrefContext";
import { UpstreamsPrefProvider } from "./UpstreamsPrefContext";

type Props = {
  children: React.ReactNode;
};

export const PreferenceProvider: React.FC<Props> = ({ children }) => {
  return (
    <GeneralPrefProvider>
      <ProxyPrefProvider>
        <UpstreamsPrefProvider>{children}</UpstreamsPrefProvider>
      </ProxyPrefProvider>
    </GeneralPrefProvider>
  );
};
