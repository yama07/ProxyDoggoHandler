import { Box } from "@mui/material";

import { PreferenceProvider } from "~/contexts";
import { usePlatformTheme } from "~/hooks/usePlatformTheme";

import AppDrawer from "./AppDrawer";
import AppHeader from "./AppHeader";
import WindowControl from "./WindowControl";

type Props = {
  children: React.ReactNode;
};

const PreferenceLayoutInner: React.FC<Props> = ({ children }) => {
  const platformTheme = usePlatformTheme();

  return (
    <Box sx={{ display: "flex", WebkitUserSelect: "none", height: "100vh", width: "100vw" }}>
      <AppHeader sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} />

      {platformTheme !== undefined && platformTheme !== "macos" && (
        <WindowControl sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }} />
      )}

      <AppDrawer />

      <Box
        component="main"
        sx={{
          p: (theme) => theme.spacing(4),
          pt: (theme) => theme.spacing(12), // AppHeaderの高さ分追加する
          flexGrow: 1,
          height: "100%",
          width: "100%",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

const PreferenceLayout: React.FC<Props> = ({ children }) => {
  return (
    <PreferenceProvider>
      <PreferenceLayoutInner>{children}</PreferenceLayoutInner>
    </PreferenceProvider>
  );
};

export default PreferenceLayout;
