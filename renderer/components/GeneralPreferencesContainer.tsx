import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
} from "@mui/material";
import React from "react";

import {
  generalPreferenceContext,
  setGeneralPreferenceContext,
} from "../contexts/GeneralPreferenceContext";
import { upstreamsPreferenceContext } from "../contexts/UpstreamsPreferencesContext";
import { toDogIconStyleType } from "./DogBreadsIcon";
import TrayIconStyleToggleButtonGroup from "./TrayIconStyleToggleButtonGroup";

const GeneralPreferencesContainer: React.FC = () => {
  const generalPreferences = React.useContext(generalPreferenceContext);
  const setGeneralPreferences = React.useContext(setGeneralPreferenceContext);
  const upstreamsPreferens = React.useContext(upstreamsPreferenceContext);
  const selectedUpstream =
    upstreamsPreferens.upstreams[upstreamsPreferens.selectedIndex];

  const onChangeHandler = React.useCallback(
    (preferences: Partial<GeneralPreferenceType>) => {
      setGeneralPreferences((prev) => {
        const newPreferences = { ...prev, ...preferences };
        window.store.setGeneralPreference(newPreferences);
        return newPreferences;
      });
    },
    [setGeneralPreferences]
  );

  return (
    <form noValidate autoComplete="off">
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={generalPreferences.isOpenAtStartup}
                onClick={(e: object) => {
                  onChangeHandler({ isOpenAtStartup: e["target"]["checked"] });
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
                checked={generalPreferences.isLaunchProxyServerAtStartup}
                onClick={(e: object) => {
                  onChangeHandler({
                    isLaunchProxyServerAtStartup: e["target"]["checked"],
                  });
                }}
                color="primary"
              />
            }
            label="アプリケーション起動時にプロキシサーバを立ち上げる"
          />
        </Grid>

        <Grid item xs={12} sx={{ mb: (theme) => theme.spacing(2) }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">トレイアイコンのスタイル</FormLabel>
            <TrayIconStyleToggleButtonGroup
              iconId={selectedUpstream.icon}
              value={
                toDogIconStyleType(generalPreferences.trayIconStyle) ?? "lineal"
              }
              onChange={(value) => {
                onChangeHandler({ trayIconStyle: value });
              }}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">メニューアイコンのスタイル</FormLabel>
            <TrayIconStyleToggleButtonGroup
              iconId={selectedUpstream.icon}
              value={
                toDogIconStyleType(generalPreferences.menuIconStyle) ?? "lineal"
              }
              onChange={(value) => {
                onChangeHandler({ menuIconStyle: value });
              }}
            />
          </FormControl>
        </Grid>
      </Grid>
    </form>
  );
};

export default GeneralPreferencesContainer;
