import { AppCacheProvider } from "@mui/material-nextjs/v14-pagesRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import type { AppProps } from "next/app";
import Head from "next/head";

import PreferenceLayout from "~/components/PreferenceLayout";
import { theme } from "~/lib/theme";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  return (
    <AppCacheProvider {...props}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <PreferenceLayout>
          <Component {...pageProps} />
        </PreferenceLayout>
      </ThemeProvider>
    </AppCacheProvider>
  );
}
