import { Checkbox, FormControl, FormControlLabel, FormLabel, Grid } from "@mui/material";
import { useCallback, useContext } from "react";

import { toDogIconStyleType } from "~/components/DogBreadsIcon";
import TrayIconStyleToggleButtonGroup from "~/components/TrayIconStyleToggleButtonGroup";
import {
  generalPreferenceContext,
  setGeneralPreferenceContext,
} from "~/contexts/GeneralPreferenceContext";
import { upstreamsPreferenceContext } from "~/contexts/UpstreamsPreferencesContext";
import { useSystemProperties } from "~/hooks/useSystemProperties";

const General: React.FC = () => {
  const { isMacos } = useSystemProperties();
  const generalPreferences = useContext(generalPreferenceContext);
  const setGeneralPreferences = useContext(setGeneralPreferenceContext);
  const upstreamsPreferens = useContext(upstreamsPreferenceContext);
  const selectedUpstream = upstreamsPreferens.upstreams[upstreamsPreferens.selectedIndex];

  const onChangeHandler = useCallback(
    (preferences: Partial<GeneralPreferenceType>) => {
      setGeneralPreferences((prev) => {
        const newPreferences = { ...prev, ...preferences };
        window.store.setGeneralPreference(newPreferences);
        return newPreferences;
      });
    },
    [setGeneralPreferences],
  );

  // macの場合はアイコンの色が自動で切り替わるため、白色スタイルのアイコンは不要
  const includeWhite = !isMacos;

  // 設定読み込みが完了するまでは、何も表示しない
  if (isMacos === undefined) {
    return <></>;
  }

  return (
    <form noValidate autoComplete="off">
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={generalPreferences.isOpenAtStartup}
                onChange={(_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
                  onChangeHandler({ isOpenAtStartup: checked });
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
                onChange={(_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
                  onChangeHandler({
                    isLaunchProxyServerAtStartup: checked,
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
              includeWhite={includeWhite}
              iconId={selectedUpstream.icon}
              value={toDogIconStyleType(generalPreferences.trayIconStyle) ?? "lineal"}
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
              includeWhite={includeWhite}
              iconId={selectedUpstream.icon}
              value={toDogIconStyleType(generalPreferences.menuIconStyle) ?? "lineal"}
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

export default General;
