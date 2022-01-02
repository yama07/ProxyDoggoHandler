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
  const [port, setPort] = React.useState(DEFAULT_PROXY_SERVER_PORT);
  const [verbose, setVerbose] = React.useState(false);
  const [examplePort, setExamplePort] = React.useState(
    DEFAULT_PROXY_SERVER_PORT
  );

  React.useEffect(() => {
    const proxyPreferencePromise = window.store.getProxyPreference();
    proxyPreferencePromise.then((proxyPreference: ProxyPreferenceType) => {
      setPort(proxyPreference.port);
      setVerbose(proxyPreference.verbose);
      setExamplePort(proxyPreference.port);
    });
  }, []);

  const handleChange = React.useCallback(() => {
    const params: ProxyPreferenceType = { port: port, verbose: verbose };
    window.store.setProxyPreference(params);

    setExamplePort(port);
  }, [port, verbose]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        position: "relative",
        height: "100%",
      }}
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
              value={port}
              label="Port where the proxy server will listen"
              onChange={(e) => {
                setPort(parseInt(e.target.value) || DEFAULT_PROXY_SERVER_PORT);
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={verbose}
                  onClick={(e: object) => {
                    setVerbose(e["target"]["checked"]);
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
              handleChange();
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
