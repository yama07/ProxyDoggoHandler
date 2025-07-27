import { useContext, useEffect, useState } from "react";
import { appearancePrefContext } from "~/contexts/AppearancePrefContext";
import { useSystemProperties } from "~/hooks/useSystemProperties";

type PlatformTheme = ReturnType<typeof useSystemProperties>["platform"];

export const usePlatformTheme = (): PlatformTheme => {
  const [platformTheme, setPlatformTheme] = useState<PlatformTheme>(undefined);

  const { platform } = useSystemProperties();
  const { frameTheme } = useContext(appearancePrefContext);

  useEffect(() => {
    console.debug("platform =", platform);
    console.debug("frameTheme =", frameTheme);

    if (frameTheme === "system") {
      setPlatformTheme(platform);
    } else {
      setPlatformTheme(frameTheme);
    }
  }, [platform, frameTheme]);

  return platformTheme;
};
