import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import type { AppProps } from "next/app";
import Head from "next/head";
import React from "react";

import { PreferenceProvider } from "../contexts";
import { SystemPropertiesProvider } from "../contexts/SystemPropertiesContext";
import { WindowControlProvider } from "../contexts/WindowControlContext";
import { theme } from "../lib/theme";

const _app = function (props: AppProps) {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <SystemPropertiesProvider>
          <WindowControlProvider>
            <PreferenceProvider>
              <CssBaseline />
              <Component {...pageProps} />
            </PreferenceProvider>
          </WindowControlProvider>
        </SystemPropertiesProvider>
      </ThemeProvider>
    </React.Fragment>
  );
};

export default _app;
