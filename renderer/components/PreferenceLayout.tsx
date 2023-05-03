import { Box } from "@mui/material";
import React from "react";

import { PreferenceProvider } from "~/contexts";
import { useSystemProperties } from "~/hooks/useSystemProperties";

import AppDrawer from "./AppDrawer";
import AppHeader from "./AppHeader";
import WindowControl from "./WindowControl";

type Props = {
  children: React.ReactNode;
};

const PreferenceLayout: React.FC<Props> = ({ children }) => {
  const { isMacos } = useSystemProperties();

  return (
    <Box
      component="nav"
      sx={{ display: "flex", WebkitUserSelect: "none", height: "100vh" }}
    >
      <AppHeader sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} />

      {isMacos !== undefined && !isMacos && (
        <WindowControl sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }} />
      )}

      <AppDrawer />

      <Box
        component="main"
        sx={{ flexGrow: 1, pt: (theme) => theme.spacing(8) }}
      >
        <Box sx={{ p: 4, height: "100%" }}>
          <PreferenceProvider>{children}</PreferenceProvider>
        </Box>
      </Box>
    </Box>
  );
};

export default PreferenceLayout;
