import React from "react";
import { Theme, makeStyles, createStyles } from "@material-ui/core/styles";
import {
  Toolbar,
  FormControlLabel,
  Button,
  Divider,
  Checkbox,
  capitalize,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Grid,
} from "@material-ui/core";
import { DogIconStyle } from "./DogBreadsIcon";

const useStyles = makeStyles((theme: Theme) => {
  const baseMargin = 6;
  return createStyles({
    content: {
      flexGrow: 1,
      padding: theme.spacing(baseMargin),
      position: "relative",
      height: "100vh",
    },
    form: {},
    formComponents: {
      position: "absolute",
      right: 0,
      left: 0,
      bottom: theme.spacing(baseMargin / 2),
    },
    formButtons: {
      float: "right",
      marginRight: theme.spacing(baseMargin),
    },
    divider: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    button: {
      textTransform: "none",
    },
  });
});

const GeneralPreferencesContainer: React.FC = () => {
  const [isOpenAtStartup, setIsOpenAtStartup] = React.useState(false);
  const [isLaunchProxyServerAtStartup, setIsLaunchProxyServerAtStartup] =
    React.useState(true);
  const [trayIconStyle, setTrayIconStyle] = React.useState("default");
  const [menuIconStyle, setMenuIconStyle] = React.useState("default");

  React.useEffect(() => {
    const generalPreferencePromise = window.store.getGeneralPreference();
    generalPreferencePromise.then(
      (generalPreference: GeneralPreferenceType) => {
        setIsOpenAtStartup(generalPreference.isOpenAtStartup);
        setIsLaunchProxyServerAtStartup(
          generalPreference.isLaunchProxyServerAtStartup
        );
        setTrayIconStyle(generalPreference.trayIconStyle);
        setMenuIconStyle(generalPreference.menuIconStyle);
      }
    );
  }, []);

  const handleChange = React.useCallback(() => {
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

  const classes = useStyles({});
  return (
    <main className={classes.content}>
      <Toolbar />

      <form noValidate autoComplete="off" className={classes.form}>
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
              <FormLabel component="legend">
                トレイアイコンのスタイル:
              </FormLabel>
              <RadioGroup
                row
                value={trayIconStyle}
                onChange={(event) => {
                  setTrayIconStyle(String(event.target.value));
                }}
              >
                {DogIconStyle.map((iconStyle) => (
                  <FormControlLabel
                    key={iconStyle}
                    value={iconStyle}
                    control={<Radio color="primary" />}
                    label={capitalize(iconStyle)}
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
                  setMenuIconStyle(String(event.target.value));
                }}
              >
                {DogIconStyle.map((iconStyle) => (
                  <FormControlLabel
                    key={iconStyle}
                    value={iconStyle}
                    control={<Radio color="primary" />}
                    label={capitalize(iconStyle)}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      </form>

      <div className={classes.formComponents}>
        <Divider className={classes.divider} />
        <div className={classes.formButtons}>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={() => {
              handleChange();
            }}
          >
            {"Apply"}
          </Button>
        </div>
      </div>
    </main>
  );
};

export default GeneralPreferencesContainer;
