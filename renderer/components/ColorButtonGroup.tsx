import CircleIcon from "@mui/icons-material/Circle";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import { Box, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import { grey } from "@mui/material/colors";

import type { MonochromeColorId } from "$/icon/iconStyle";

type Props = {
  disabled: boolean;
  color: MonochromeColorId;
  onChange: (newColor: MonochromeColorId) => void;
};

const ColorButtonGroup: React.FC<Props> = ({ disabled, color, onChange }) => {
  return (
    <ToggleButtonGroup
      value={color}
      exclusive
      color="primary"
      onChange={(_, newColor: MonochromeColorId) => {
        if (newColor) {
          onChange(newColor);
        }
      }}
      disabled={disabled}
    >
      <ToggleButton key="black" value="black" sx={{ p: (theme) => theme.spacing(0) }}>
        <Tooltip title="Black">
          <Box
            display="flex"
            sx={{
              width: "100%",
              height: "100%",
              px: (theme) => theme.spacing(2),
              py: (theme) => theme.spacing(1),
            }}
          >
            <CircleIcon sx={{ color: disabled ? grey[400] : grey[900] }} />
          </Box>
        </Tooltip>
      </ToggleButton>
      <ToggleButton key="white" value="white" sx={{ p: (theme) => theme.spacing(0) }}>
        <Tooltip title="White">
          <Box
            display="flex"
            sx={{
              width: "100%",
              height: "100%",
              px: (theme) => theme.spacing(2),
              py: (theme) => theme.spacing(1),
            }}
          >
            <CircleOutlinedIcon sx={{ color: disabled ? grey[400] : grey[900] }} />
          </Box>
        </Tooltip>
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ColorButtonGroup;
