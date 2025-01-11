import { Box, Button, Checkbox, Divider, FormControlLabel, Grid, TextField } from "@mui/material";
import { useCallback, useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import type { ProxyPreference } from "$/preference/proxyPreference";

import ProxyUsageCard from "~/components/ProxyUsageCard";
import { proxyPrefContext, setProxyPrefContext } from "~/contexts/ProxyPrefContext";

// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
const Proxy: React.FC = () => {
  const proxyPref = useContext(proxyPrefContext);
  const setProxyPref = useContext(setProxyPrefContext);

  const [examplePort, setExamplePort] = useState(proxyPref.port);

  const { handleSubmit, control } = useForm<ProxyPreference>({
    criteriaMode: "all",
    shouldUseNativeValidation: false,
    defaultValues: proxyPref,
  });

  const onApply = useCallback(
    (formData: ProxyPreference) => {
      setProxyPref(formData);
      setExamplePort(formData.port);
    },
    [setProxyPref],
  );

  return (
    <Box
      sx={{
        flexGrow: 1,
        position: "relative",
        height: "100%",
      }}
    >
      <form noValidate autoComplete="off" onSubmit={handleSubmit(onApply)}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Controller
              control={control}
              name="port"
              rules={{
                required: "このフィールドを入力してください。",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "数字を入力してください。",
                },
                min: {
                  value: 0,
                  message: "値は0以上にする必要があります。",
                },
                max: {
                  value: 65535,
                  message: "値は65535以下にする必要があります。",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  variant="standard"
                  margin="dense"
                  label="リクエストを受け付けるポート番号"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ inputProps: { min: 0, max: 65535 } }}
                  error={error != null}
                  helperText={error != null ? error.message : null}
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              control={control}
              name="isLaunchProxyServerAtStartup"
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} color="primary" />}
                  label="アプリケーション起動時にプロキシサーバを立ち上げる"
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              control={control}
              name="verboseLogging"
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} color="primary" />}
                  label="冗長ロギングを有効化する"
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <ProxyUsageCard port={examplePort} />
          </Grid>
        </Grid>

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
              type="submit"
              variant="contained"
              color="primary"
            >
              {"Apply & Restart"}
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default Proxy;
