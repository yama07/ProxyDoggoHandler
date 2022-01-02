import React from "react";
import {
  FormControlLabel,
  Checkbox,
  capitalize,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Grid,
} from "@mui/material";
import { DogIconStyles, DogIconStyleType } from "./DogBreadsIcon";

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

        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">トレイアイコンのスタイル:</FormLabel>
            <RadioGroup
              row
              value={trayIconStyle}
              onChange={(event) => {
                setTrayIconStyle(toDogIconStyle(event.target.value));
              }}
            >
              {availableDogIconStyles.map((iconStyle) => (
                <FormControlLabel
                  key={iconStyle}
                  value={iconStyle}
                  control={<Radio color="primary" />}
                  label={getIconStyleLabel(iconStyle)}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">
              メニューアイコンのスタイル:
            </FormLabel>
            <RadioGroup
              row
              value={menuIconStyle}
              onChange={(event) => {
                setMenuIconStyle(toDogIconStyle(event.target.value));
              }}
            >
              {availableDogIconStyles.map((iconStyle) => (
                <FormControlLabel
                  key={iconStyle}
                  value={iconStyle}
                  control={<Radio color="primary" />}
                  label={getIconStyleLabel(iconStyle)}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
    </form>
  );
};

export default GeneralPreferencesContainer;
