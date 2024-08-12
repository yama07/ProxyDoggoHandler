import { useEffect, useState } from "react";

type SystemProperties = {
  isMacos?: Awaited<ReturnType<typeof window.system.isMacos>>;
};

let cache: SystemProperties | undefined;

export const useSystemProperties = (): SystemProperties => {
  const [systemProperties, setSystemProperties] = useState<SystemProperties>(
    cache ?? {
      isMacos: undefined,
    },
  );

  useEffect(() => {
    if (!cache) {
      (async () => {
        cache = { isMacos: await window.system.isMacos() };
        setSystemProperties(cache);
      })();
    }
  }, []);

  return systemProperties;
};
