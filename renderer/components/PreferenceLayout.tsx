import React from "react";
import { Box, CssBaseline } from "@mui/material";
import AppDrawer from "./AppDrawer";
import AppHeader from "./AppHeader";

const PreferenceLayout: React.FC = ({ children }) => {
  return (
    <Box
      component="nav"
      sx={{ display: "flex", WebkitUserSelect: "none", height: "100vh" }}
    >
      <CssBaseline />

      <AppHeader />

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
