import { Box } from "@mui/material";

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
    <Box sx={{ display: "flex", WebkitUserSelect: "none", height: "100vh", width: "100vw" }}>
      <AppHeader sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} />

      {isMacos !== undefined && !isMacos && (
        <WindowControl sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }} />
      )}

      <AppDrawer />

      <Box
        component="main"
        sx={{ flexGrow: 1, pt: (theme) => theme.spacing(8), height: "100%", width: "100%" }}
      >
        <Box sx={{ p: 4, height: "100%", width: "100%" }}>
          <PreferenceProvider>{children}</PreferenceProvider>
        </Box>
      </Box>
    </Box>
  );
};

export default PreferenceLayout;
