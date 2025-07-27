import { useEffect, useState } from "react";

type SystemProperties = {
  platform?: Awaited<ReturnType<typeof window.system.platform>>;
};

let cache: SystemProperties | undefined;

export const useSystemProperties = (): SystemProperties => {
  const [systemProperties, setSystemProperties] = useState<SystemProperties>(
    cache ?? {
      platform: undefined,
    },
  );

  useEffect(() => {
    if (!cache) {
      (async () => {
        cache = {
          platform: await window.system.platform(),
        };
        setSystemProperties(cache);
      })();
    }
  }, []);

  return systemProperties;
};
