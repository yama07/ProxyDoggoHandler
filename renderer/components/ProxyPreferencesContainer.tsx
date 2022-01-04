import React from "react";
import {
  TextField,
  FormControlLabel,
  Button,
  Divider,
  Checkbox,
  Grid,
  Box,
} from "@mui/material";
import ProxyUsageCard from "./ProxyUsageCard";

const DEFAULT_PROXY_SERVER_PORT = 8080;

const ProxyPreferencesContainer: React.FC = () => {
  const [isReady, setIsReady] = React.useState(false);

  const [proxyPreferences, setProxyPreferences] =
    React.useState<ProxyPreferenceType>({
      port: DEFAULT_PROXY_SERVER_PORT,
      verbose: false,
    });

  const [examplePort, setExamplePort] = React.useState(
    DEFAULT_PROXY_SERVER_PORT
  );

  React.useEffect(() => {
    (async () => {
      const preferences = await window.store.getProxyPreference();
      setProxyPreferences(preferences);
      setExamplePort(preferences.port);

      setIsReady(true);
    })();
  }, []);

  const handleApply = React.useCallback(() => {
    window.store.setProxyPreference(proxyPreferences);
    setExamplePort(proxyPreferences.port);
  }, [proxyPreferences]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        position: "relative",
        height: "100%",
      }}
      visibility={isReady ? "inherit" : "hidden"}
    >
      <form noValidate autoComplete="off">
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <TextField
              type="number"
              variant="standard"
              InputLabelProps={{ shrink: true }}
              InputProps={{ inputProps: { min: 0, max: 65535 } }}
              fullWidth
              value={proxyPreferences.port}
              label="Port where the proxy server will listen"
              onChange={(e) => {
                setProxyPreferences((prev) => {
                  return {
                    ...prev,
                    port: parseInt(e.target.value) || DEFAULT_PROXY_SERVER_PORT,
                  };
                });
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={proxyPreferences.verbose}
                  onClick={(e: object) => {
                    setProxyPreferences((prev) => {
                      return {
                        ...prev,
                        verbose: e["target"]["checked"],
                      };
                    });
                  }}
                  color="primary"
                />
              }
              label="Verbose logging mode"
            />
          </Grid>

          <Grid item xs={12}>
            <ProxyUsageCard port={examplePort} />
          </Grid>
        </Grid>
      </form>

      <Box
        sx={{
          position: "absolute",
          width: "100%",
          bottom: (theme) => theme.spacing(0),
        }}
      >
        <Divider sx={{ marginBottom: (theme) => theme.spacing(2) }} />
        <Box sx={{ float: "right", mr: (theme) => theme.spacing(2) }}>
          <Button
            sx={{ textTransform: "none" }}
            variant="contained"
            color="primary"
            onClick={() => {
              handleApply();
            }}
          >
            {"Apply & Restart"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProxyPreferencesContainer;
