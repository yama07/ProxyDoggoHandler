import React from "react";
import { AppBar, styled, Toolbar, Typography } from "@mui/material";

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
          height: (theme) => theme.spacing(10),
          verticalAlign: "middle",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            textAlign: "center",
          }}
        >
          Proxy Doggo Handler
        </Typography>
      </Toolbar>
    </DraggableAppBar>
  );
};

export default AppHeader;
