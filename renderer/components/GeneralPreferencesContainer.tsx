import React from "react";
import {
  FormControlLabel,
  Checkbox,
  capitalize,
  FormControl,
  FormLabel,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Tooltip,
} from "@mui/material";
import DogBreadsIcon, {
  DogIconStyles,
  DogIconStyleType,
} from "./DogBreadsIcon";

const toDogIconStyle = (
  value: any,
  defaultStyle: DogIconStyleType = "lineal"
): DogIconStyleType =>
  DogIconStyles.find((style) => style == value) ?? defaultStyle;

const getIconStyleLabel = (style: DogIconStyleType): string =>
  capitalize(style).replace("_inverse", " (white)");

const GeneralPreferencesContainer: React.FC = () => {
  const [isOpenAtStartup, setIsOpenAtStartup] = React.useState(false);
  const [isLaunchProxyServerAtStartup, setIsLaunchProxyServerAtStartup] =
    React.useState(true);
  const [trayIconStyle, setTrayIconStyle] =
    React.useState<DogIconStyleType>("lineal");
  const [menuIconStyle, setMenuIconStyle] =
    React.useState<DogIconStyleType>("lineal");
  const [availableDogIconStyles, setAvailableDogIconStyles] = React.useState(
    DogIconStyles.slice()
  );

  React.useEffect(() => {
    (async () => {
      const generalPreference = await window.store.getGeneralPreference();
      setIsOpenAtStartup(generalPreference.isOpenAtStartup);
      setIsLaunchProxyServerAtStartup(
        generalPreference.isLaunchProxyServerAtStartup
      );
      setTrayIconStyle(toDogIconStyle(generalPreference.trayIconStyle));
      setMenuIconStyle(toDogIconStyle(generalPreference.menuIconStyle));

      if (await window.system.isMacos()) {
        // macの場合はアイコンの色が自動で切り替わるため、反転スタイルは不要
        setAvailableDogIconStyles(
          DogIconStyles.filter((v) => !v.includes("_inverse"))
        );
      }
    })();
  }, []);

  React.useEffect(() => {
    const params: GeneralPreferenceType = {
      isOpenAtStartup: isOpenAtStartup,
      isLaunchProxyServerAtStartup: isLaunchProxyServerAtStartup,
      trayIconStyle: trayIconStyle,
      menuIconStyle: menuIconStyle,
    };
    window.store.setGeneralPreference(params);
  }, [
    isOpenAtStartup,
    isLaunchProxyServerAtStartup,
    trayIconStyle,
    menuIconStyle,
  ]);

  return (
    <form noValidate autoComplete="off">
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isOpenAtStartup}
                onClick={(e: object) => {
                  setIsOpenAtStartup(e["target"]["checked"]);
                }}
                color="primary"
              />
            }
            label="アプリケーション起動時にウィンドウを表示する"
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isLaunchProxyServerAtStartup}
                onClick={(e: object) => {
                  setIsLaunchProxyServerAtStartup(e["target"]["checked"]);
                }}
                color="primary"
              />
            }
            label="アプリケーション起動時にプロキシサーバを立ち上げる"
          />
        </Grid>

        <Grid item xs={12} sx={{ mb: (theme) => theme.spacing(2) }}>
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend">トレイアイコンのスタイル</FormLabel>
            <ToggleButtonGroup
              value={trayIconStyle}
              exclusive
              fullWidth
              color="primary"
              size="small"
              onChange={(event, value) => {
                setTrayIconStyle(toDogIconStyle(value));
              }}
            >
              {availableDogIconStyles.map((iconStyle) => (
                <ToggleButton
                  key={iconStyle}
                  value={iconStyle}
                  sx={{ p: (theme) => theme.spacing(0) }}
                >
                  <Tooltip title={getIconStyleLabel(iconStyle)}>
                    <Box
                      display="flex"
                      sx={{
                        width: "100%",
                        height: "100%",
                        p: (theme) => theme.spacing(0.6),
                      }}
                    >
                      <Box
                        sx={{
                          ...(iconStyle.includes("inverse")
                            ? {
                                borderRadius: "10%",
                                background: (theme) =>
                                  theme.palette.primary.main,
                                px: (theme) => theme.spacing(2),
                                py: (theme) => theme.spacing(0.4),
                              }
                            : {}),
                          m: "auto",
                        }}
                      >
                        <DogBreadsIcon iconId="001-dog" style={iconStyle} />
                      </Box>{" "}
                    </Box>
                  </Tooltip>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend">トレイアイコンのスタイル</FormLabel>
            <ToggleButtonGroup
              value={menuIconStyle}
              exclusive
              fullWidth
              color="primary"
              size="small"
              onChange={(event, value) => {
                setMenuIconStyle(toDogIconStyle(value));
              }}
            >
              {availableDogIconStyles.map((iconStyle) => (
                <ToggleButton
                  key={iconStyle}
                  value={iconStyle}
                  sx={{ p: (theme) => theme.spacing(0) }}
                >
                  <Tooltip title={getIconStyleLabel(iconStyle)}>
                    <Box
                      display="flex"
                      sx={{
                        width: "100%",
                        height: "100%",
                        p: (theme) => theme.spacing(0.6),
                      }}
                    >
                      <Box
                        sx={{
                          ...(iconStyle.includes("inverse")
                            ? {
                                borderRadius: "10%",
                                background: (theme) =>
                                  theme.palette.primary.main,
                                px: (theme) => theme.spacing(2),
                                py: (theme) => theme.spacing(0.4),
                              }
                            : {}),
                          m: "auto",
                        }}
                      >
                        <DogBreadsIcon iconId="001-dog" style={iconStyle} />
                      </Box>{" "}
                    </Box>
                  </Tooltip>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </FormControl>
        </Grid>
      </Grid>
    </form>
  );
};

export default GeneralPreferencesContainer;
