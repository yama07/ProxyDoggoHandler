import { Checkbox, FormControl, FormControlLabel, FormLabel, Grid, Stack } from "@mui/material";
import { useCallback, useContext } from "react";

import { iconStyles } from "$/icon/iconStyle";
import type { AppearancePreference } from "$/preference/appearancePreference";

import ColorButtonGroup from "~/components/ColorButtonGroup";
import TrayIconStyleToggleButtonGroup from "~/components/TrayIconStyleToggleButtonGroup";
import { appearancePrefContext, setAppearancePrefContext } from "~/contexts/AppearancePrefContext";
import { profilesPrefContext } from "~/contexts/ProfilesPrefContext";
import { usePlatformTheme } from "~/hooks/usePlatformTheme";

const Appearance: React.FC = () => {
  const platformTheme = usePlatformTheme();
  const appearancePref = useContext(appearancePrefContext);
  const setAppearancePref = useContext(setAppearancePrefContext);
  const profilesPreferens = useContext(profilesPrefContext);
  const selectedProfile = profilesPreferens.profiles[profilesPreferens.selectedIndex];

  const onChangeHandler = useCallback(
    (preferences: Partial<AppearancePreference>) => {
      setAppearancePref((prev) => ({ ...prev, ...preferences }));
    },
    [setAppearancePref],
  );

  // 設定読み込みが完了するまでは、何も表示しない
  if (platformTheme === undefined) {
    return;
  }

  return (
    <form noValidate autoComplete="off">
      <Grid container spacing={1}>
        <Grid size={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={appearancePref.isOpenAtStartup}
                onChange={(_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
                  onChangeHandler({ isOpenAtStartup: checked });
                }}
                color="primary"
              />
            }
            label="アプリケーション起動時にウィンドウを表示する"
          />
        </Grid>

        <Grid size={12} sx={{ mb: (theme) => theme.spacing(2) }}>
          <Stack direction="row" spacing={4}>
            <FormControl component="fieldset">
              <FormLabel component="legend">トレイアイコンのスタイル</FormLabel>
              <TrayIconStyleToggleButtonGroup
                icon={selectedProfile.icon}
                style={appearancePref.trayIcon.style}
                onChange={(newStyle) => {
                  onChangeHandler({
                    trayIcon: { style: newStyle, color: appearancePref.trayIcon.color },
                  });
                }}
              />
            </FormControl>
            {platformTheme !== undefined && platformTheme !== "macos" && (
              <FormControl component="fieldset">
                <FormLabel
                  component="legend"
                  disabled={iconStyles[appearancePref.trayIcon.style].colorMode === "color"}
                >
                  トレイアイコンの色
                </FormLabel>
                <ColorButtonGroup
                  disabled={iconStyles[appearancePref.trayIcon.style].colorMode === "color"}
                  color={appearancePref.trayIcon.color}
                  onChange={(newColor) => {
                    onChangeHandler({
                      trayIcon: { style: appearancePref.trayIcon.style, color: newColor },
                    });
                  }}
                />
              </FormControl>
            )}
          </Stack>
        </Grid>

        <Grid size={12}>
          <Stack direction="row" spacing={4}>
            <FormControl component="fieldset">
              <FormLabel component="legend">メニューアイコンのスタイル</FormLabel>
              <TrayIconStyleToggleButtonGroup
                icon={selectedProfile.icon}
                style={appearancePref.menuIcon.style}
                onChange={(newStyle) => {
                  onChangeHandler({
                    menuIcon: { style: newStyle, color: appearancePref.menuIcon.color },
                  });
                }}
              />
            </FormControl>
            {platformTheme !== undefined && platformTheme !== "macos" && (
              <FormControl component="fieldset">
                <FormLabel
                  component="legend"
                  disabled={iconStyles[appearancePref.menuIcon.style].colorMode === "color"}
                >
                  メニューアイコンの色
                </FormLabel>
                <ColorButtonGroup
                  disabled={iconStyles[appearancePref.menuIcon.style].colorMode === "color"}
                  color={appearancePref.menuIcon.color}
                  onChange={(newColor) => {
                    onChangeHandler({
                      menuIcon: { style: appearancePref.menuIcon.style, color: newColor },
                    });
                  }}
                />
              </FormControl>
            )}
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
};

export default Appearance;
