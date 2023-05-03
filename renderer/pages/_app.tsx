import { CacheProvider, EmotionCache } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import type { AppProps } from "next/app";
import Head from "next/head";
import React from "react";

import PreferenceLayout from "~/components/PreferenceLayout";
import createEmotionCache from "~/lib/create-emotion-cache";
import { theme } from "~/lib/theme";

const clientSideEmotionCache = createEmotionCache();

type MyAppProps = AppProps & {
  emotionCache?: EmotionCache;
};

const _app = function (props: MyAppProps) {
  const { Component, pageProps, emotionCache = clientSideEmotionCache } = props;

  React.useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <ThemeProvider theme={theme}>
        <CssBaseline />

        <PreferenceLayout>
          <Component {...pageProps} />
        </PreferenceLayout>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default _app;
