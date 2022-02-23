import {
  AppBar,
  AppBarProps,
  Box,
  Toolbar,
  Typography,
  styled,
} from "@mui/material";
import React from "react";

const DraggableAppBar = styled(AppBar)({ WebkitAppRegion: "drag" });

const AppHeader: React.FC<AppBarProps> = (props: AppBarProps) => {
  const { sx, ...other } = props;
  return (
    <DraggableAppBar
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        background: (theme) => theme.palette.primary.main,
        color: (theme) => theme.palette.primary.contrastText,
        ...sx,
      }}
      {...other}
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
            gap: (theme) => theme.spacing(1),
            height: "100%",
            width: "100%",
          }}
        >
          <img
            src="/images/app-icon-w.png"
            alt="app-log"
            draggable={false}
            height="50%"
          />
          <Typography variant="h6">Proxy Doggo Handler</Typography>
        </Box>
      </Toolbar>
    </DraggableAppBar>
  );
};

export default AppHeader;
