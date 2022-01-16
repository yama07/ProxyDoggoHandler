import { Box, BoxProps, Button } from "@mui/material";
import React from "react";
import { windowControlContext } from "../contexts/WindowControlContext";
import {
  CloseIcon,
  MaximizeIcon,
  MinimizeIcon,
  RestoreIcon,
} from "./WindowControlIcon";

const WindowControl: React.FC<BoxProps> = (props: BoxProps) => {
  const { minimize, maximize, restore, close, isMaximized } =
    React.useContext(windowControlContext);

  return (
    <Box {...props}>
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
    </Box>
  );
};

export default WindowControl;
