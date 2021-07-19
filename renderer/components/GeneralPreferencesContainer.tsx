import React from "react";
import { Theme, makeStyles, createStyles } from "@material-ui/core/styles";
import {
  TextField,
  Toolbar,
  FormControlLabel,
  Switch,
  Button,
  Divider,
} from "@material-ui/core";

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
      marginLeft: theme.spacing(2),
    },
  });
});

const DEFAULT_PROXY_SERVER_PORT = 8080;

const GeneralPreferencesContainer: React.FC = () => {
  const [port, setPort] = React.useState(DEFAULT_PROXY_SERVER_PORT);
  const [verbose, setVerbose] = React.useState(false);

  React.useEffect(() => {
    const generalPreferencePromise = window.store.getGeneralPreference();
    generalPreferencePromise.then(
      (generalPreference: GeneralPreferenceType) => {
        setPort(generalPreference.port);
        setVerbose(generalPreference.verbose);
      }
    );
  }, []);

  const handleChange = React.useCallback(() => {
    const params = { port: port, verbose: verbose };
    window.store.setGeneralPreference(params);
    const proxyChain = window.proxyChain;
    proxyChain.init(params);
    proxyChain.listen();
  }, [port, verbose]);

  const classes = useStyles({});
  return (
    <main className={classes.content}>
      <Toolbar />

      <form noValidate autoComplete="off" className={classes.form}>
        <TextField
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{ inputProps: { min: 0, max: 65535 } }}
          fullWidth
          value={port}
          label="Port where the proxy server will listen"
          onChange={(e) => {
            setPort(parseInt(e.target.value) || DEFAULT_PROXY_SERVER_PORT);
          }}
        />

        <FormControlLabel
          control={
            <Switch
              checked={verbose}
              onClick={(e: object) => {
                setVerbose(e["target"]["checked"]);
              }}
              name="checkedB"
              color="primary"
            />
          }
          label="Verbose logging mode"
        />
      </form>

      <div className={classes.formComponents}>
        <Divider className={classes.divider} />
        <div className={classes.formButtons}>
          <Button className={classes.button} variant="outlined" color="primary">
            Cancel
          </Button>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={() => {
              handleChange();
            }}
          >
            Apply & Restart
          </Button>
        </div>
      </div>
    </main>
  );
};

export default GeneralPreferencesContainer;
