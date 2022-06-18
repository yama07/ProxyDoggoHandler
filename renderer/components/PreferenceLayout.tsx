import { Box, CssBaseline } from "@mui/material";
import React from "react";

import { systemPropertiesContext } from "../contexts/SystemPropertiesContext";
import AppDrawer from "./AppDrawer";
import AppHeader from "./AppHeader";
import WindowControl from "./WindowControl";

type Props = {
  children: React.ReactNode;
};

const PreferenceLayout: React.FC<Props> = ({ children }) => {
  const { isMacos } = React.useContext(systemPropertiesContext);

  return (
    <Box
      component="nav"
      sx={{ display: "flex", WebkitUserSelect: "none", height: "100vh" }}
    >
      <CssBaseline />

      <AppHeader sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} />

      {!isMacos && (
        <WindowControl sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }} />
      )}

      <AppDrawer />

      <Box
        component="main"
        sx={{ flexGrow: 1, pt: (theme) => theme.spacing(8) }}
      >
        <Box sx={{ p: 4, height: "100%" }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default PreferenceLayout;
