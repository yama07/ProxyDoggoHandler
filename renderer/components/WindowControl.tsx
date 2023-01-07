import { Box, BoxProps, Button, styled } from "@mui/material";
import React from "react";

import { windowControlContext } from "~/contexts/WindowControlContext";

import {
  CloseIcon,
  MaximizeIcon,
  MinimizeIcon,
  RestoreIcon,
} from "./WindowControlIcon";

const UndraggableBox = styled(Box)({ WebkitAppRegion: "no-drag" });

const WindowControl: React.FC<BoxProps> = (props: BoxProps) => {
  const { minimize, maximize, restore, close, isMaximized } =
    React.useContext(windowControlContext);

  const { sx, ...other } = props;

  return (
    <UndraggableBox
      sx={{
        position: "absolute",
        top: 0,
        right: 0,
        ...sx,
      }}
      {...other}
    >
      <Button
        variant="contained"
        disableRipple
        disableElevation
        sx={{
          minWidth: 0,
          px: (theme) => theme.spacing(2),
        }}
        onClick={() => minimize()}
      >
        <MinimizeIcon sx={{ width: 12 }} />
      </Button>

      {isMaximized ? (
        <Button
          variant="contained"
          disableRipple
          disableElevation
          sx={{
            minWidth: 0,
            px: (theme) => theme.spacing(2),
          }}
          onClick={() => restore()}
        >
          <RestoreIcon sx={{ width: 12 }} />
        </Button>
      ) : (
        <Button
          variant="contained"
          disableRipple
          disableElevation
          sx={{
            minWidth: 0,
            px: (theme) => theme.spacing(2),
          }}
          onClick={() => maximize()}
        >
          <MaximizeIcon sx={{ width: 12 }} />
        </Button>
      )}

      <Button
        variant="contained"
        disableRipple
        disableElevation
        sx={{
          minWidth: 0,
          px: (theme) => theme.spacing(2),
          "&:hover": {
            backgroundColor: "red",
          },
        }}
        onClick={() => close()}
      >
        <CloseIcon sx={{ width: 12 }} />
      </Button>
    </UndraggableBox>
  );
};

export default WindowControl;
