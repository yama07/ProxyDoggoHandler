import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Checkbox, Divider, FormControlLabel, Grid, TextField } from "@mui/material";
import { useCallback, useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { type ProxyPreference, proxyPreferenceSchema } from "$/preference/proxyPreference";

import { proxyPrefContext, setProxyPrefContext } from "~/contexts/ProxyPrefContext";

const ProxyServer: React.FC = () => {
  const proxyPref = useContext(proxyPrefContext);
  const setProxyPref = useContext(setProxyPrefContext);

  const { handleSubmit, control } = useForm<ProxyPreference>({
    criteriaMode: "all",
    shouldUseNativeValidation: false,
    defaultValues: proxyPref,
    resolver: zodResolver(proxyPreferenceSchema),
  });

  const onApply = useCallback(
    (formData: ProxyPreference) => {
      setProxyPref(formData);
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
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  variant="standard"
                  margin="dense"
                  label="リクエストを受け付けるポート番号"
                  placeholder="8080"
                  error={!!error}
                  helperText={error?.message}
                  fullWidth
                  onChange={(e) =>
                    field.onChange(
                      !e.target.value || Number.isNaN(Number(e.target.value))
                        ? e.target.value
                        : Number(e.target.value),
                    )
                  }
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
                  label="プロキシサーバの冗長ロギングを有効化する"
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              control={control}
              name="ignoreUpstreamProxyCertificate"
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} color="primary" />}
                  label="上流プロキシの証明書エラーを無視する"
                />
              )}
            />
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

export default ProxyServer;
