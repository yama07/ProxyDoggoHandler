import React from "react";
import { Box, CssBaseline } from "@mui/material";
import AppDrawer from "./AppDrawer";
import AppHeader from "./AppHeader";
import WindowControl from "./WindowControl";
import { systemPropertiesContext } from "../contexts/SystemPropertiesContext";

const PreferenceLayout: React.FC = ({ children }) => {
  const { isMacos } = React.useContext(systemPropertiesContext);

  return (
    <Box
      component="nav"
      sx={{ display: "flex", WebkitUserSelect: "none", height: "100vh" }}
    >
      <CssBaseline />

      <AppHeader />

      {!isMacos && (
        <WindowControl
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        />
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
