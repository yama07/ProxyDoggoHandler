import { Checkbox, FormControl, FormControlLabel, FormLabel, Grid, Stack } from "@mui/material";
import { useCallback, useContext } from "react";

import type { AppearancePreference } from "$/preference/appearancePreference";

import { iconStyles } from "$/icon/iconStyle";
import ColorButtonGroup from "~/components/ColorButtonGroup";
import TrayIconStyleToggleButtonGroup from "~/components/TrayIconStyleToggleButtonGroup";
import { generalPrefContext, setGeneralPrefContext } from "~/contexts/GeneralPrefContext";
import { upstreamsPrefContext } from "~/contexts/UpstreamsPrefContext";
import { useSystemProperties } from "~/hooks/useSystemProperties";

const General: React.FC = () => {
  const { isMacos } = useSystemProperties();
  const generalPref = useContext(generalPrefContext);
  const setGeneralPref = useContext(setGeneralPrefContext);
  const upstreamsPreferens = useContext(upstreamsPrefContext);
  const selectedUpstream = upstreamsPreferens.profiles[upstreamsPreferens.selectedIndex];

  const onChangeHandler = useCallback(
    (preferences: Partial<AppearancePreference>) => {
      setGeneralPref((prev) => ({ ...prev, ...preferences }));
    },
    [setGeneralPref],
  );

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
                checked={generalPref.isOpenAtStartup}
                onChange={(_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
                  onChangeHandler({ isOpenAtStartup: checked });
                }}
                color="primary"
              />
            }
            label="アプリケーション起動時にウィンドウを表示する"
          />
        </Grid>

        <Grid item xs={12} sx={{ mb: (theme) => theme.spacing(2) }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">トレイアイコンのスタイル</FormLabel>
            <Stack direction="row" spacing={4}>
              <TrayIconStyleToggleButtonGroup
                icon={selectedUpstream.icon}
                style={generalPref.trayIcon.style}
                onChange={(newStyle) => {
                  onChangeHandler({
                    trayIcon: { style: newStyle, color: generalPref.trayIcon.color },
                  });
                }}
              />
              {!isMacos && (
                <ColorButtonGroup
                  disabled={iconStyles[generalPref.trayIcon.style].colorMode === "color"}
                  color={generalPref.trayIcon.color}
                  onChange={(newColor) => {
                    onChangeHandler({
                      trayIcon: { style: generalPref.trayIcon.style, color: newColor },
                    });
                  }}
                />
              )}
            </Stack>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">メニューアイコンのスタイル</FormLabel>
            <Stack direction="row" spacing={4}>
              <TrayIconStyleToggleButtonGroup
                icon={selectedUpstream.icon}
                style={generalPref.menuIcon.style}
                onChange={(newStyle) => {
                  onChangeHandler({
                    menuIcon: { style: newStyle, color: generalPref.menuIcon.color },
                  });
                }}
              />
              {!isMacos && (
                <ColorButtonGroup
                  disabled={iconStyles[generalPref.menuIcon.style].colorMode === "color"}
                  color={generalPref.menuIcon.color}
                  onChange={(newColor) => {
                    onChangeHandler({
                      menuIcon: { style: generalPref.menuIcon.style, color: newColor },
                    });
                  }}
                />
              )}
            </Stack>
          </FormControl>
        </Grid>
      </Grid>
    </form>
  );
};

export default General;
