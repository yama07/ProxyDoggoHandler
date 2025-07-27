import { Box, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";

import type { DogIconId } from "$/icon/dogIcon";
import type { IconStyleId } from "$/icon/iconStyle";
import { iconStyleIds, iconStyles } from "$/icon/iconStyle";

import DogBreadsIcon from "./DogBreadsIcon";

type Props = {
  icon: DogIconId;
  style: IconStyleId;
  onChange: (newStyle: IconStyleId) => void;
};

const TrayIconStyleToggleButtonGroup: React.FC<Props> = ({ icon, style, onChange }) => {
  return (
    <ToggleButtonGroup
      value={style}
      exclusive
      color="primary"
      onChange={(_, newStyle: IconStyleId | undefined) => {
        if (newStyle) {
          onChange(newStyle);
        }
      }}
    >
      {iconStyleIds.map((iconStyleId) => (
        <ToggleButton key={iconStyleId} value={iconStyleId} sx={{ p: (theme) => theme.spacing(0) }}>
          <Tooltip title={iconStyles[iconStyleId].label}>
            <Box
              display="flex"
              sx={{
                width: "100%",
                height: "100%",
                px: (theme) => theme.spacing(4),
                py: (theme) => theme.spacing(1),
              }}
            >
              <DogBreadsIcon iconId={icon} style={iconStyleId} />
            </Box>
          </Tooltip>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default TrayIconStyleToggleButtonGroup;
