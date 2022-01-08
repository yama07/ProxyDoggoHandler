import React from "react";
import { AppBar, styled, Toolbar } from "@mui/material";
import { Box } from "@mui/system";

const DraggableAppBar = styled(AppBar)({
  WebkitAppRegion: "drag",
});

const AppHeader: React.FC = () => {
  return (
    <DraggableAppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          height: (theme) => theme.spacing(8),
          verticalAlign: "middle",
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <img
            src="/images/app-logo-w.png"
            alt="app-log"
            draggable={false}
            height="40%"
            max-height="50px"
          />
        </Box>
      </Toolbar>
    </DraggableAppBar>
  );
};

export default AppHeader;
