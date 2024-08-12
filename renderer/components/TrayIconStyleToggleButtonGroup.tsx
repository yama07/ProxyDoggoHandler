import { Box, ToggleButton, ToggleButtonGroup, Tooltip, capitalize } from "@mui/material";

import DogBreadsIcon, { type DogIconStyleType, DogIconStyles } from "./DogBreadsIcon";

const getIconStyleLabel = (style: string): string => capitalize(style).replace("-w", " (white)");

type Props = {
  includeWhite: boolean;
  iconId: string;
  value: DogIconStyleType;
  onChange: (value: DogIconStyleType) => void;
};

const TrayIconStyleToggleButtonGroup: React.FC<Props> = ({
  includeWhite,
  iconId,
  value,
  onChange,
}) => {
  const availableDogIconStyles = includeWhite
    ? DogIconStyles.slice()
    : DogIconStyles.filter((v) => !v.endsWith("-w"));

  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      color="primary"
      size="small"
      onChange={(event, value) => onChange(value)}
    >
      {availableDogIconStyles.map((iconStyle) => (
        <ToggleButton key={iconStyle} value={iconStyle} sx={{ p: (theme) => theme.spacing(0) }}>
          <Tooltip title={getIconStyleLabel(iconStyle)}>
            <Box
              display="flex"
              sx={{
                width: "100%",
                height: "100%",
                px: (theme) => theme.spacing(2),
                py: (theme) => theme.spacing(0.6),
              }}
            >
              <Box
                sx={{
                  borderRadius: "10%",
                  background: (theme) =>
                    iconStyle.endsWith("-w") ? theme.palette.primary.main : null,
                  px: (theme) => theme.spacing(2),
                  py: (theme) => theme.spacing(0.4),
                  m: "auto",
                }}
              >
                <DogBreadsIcon iconId={iconId} style={iconStyle} />
              </Box>
            </Box>
          </Tooltip>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default TrayIconStyleToggleButtonGroup;
