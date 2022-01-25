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
import { Controller, useForm } from "react-hook-form";
import ProxyUsageCard from "./ProxyUsageCard";
import {
  proxyPreferenceContext,
  setProxyPreferenceContext,
} from "../contexts/ProxyPreferenceContext";

const ProxyPreferencesContainer: React.FC = () => {
  const proxyPreferences = React.useContext(proxyPreferenceContext);
  const setProxyPreferences = React.useContext(setProxyPreferenceContext);

  const [examplePort, setExamplePort] = React.useState(proxyPreferences.port);

  const { handleSubmit, control } = useForm<ProxyPreferenceType>({
    criteriaMode: "all",
    shouldUseNativeValidation: false,
    defaultValues: proxyPreferences,
  });

  const onApply = React.useCallback(
    (formData: ProxyPreferenceType) => {
      setProxyPreferences(formData);
      setExamplePort(formData.port);
    },
    [setProxyPreferences]
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
                  helperText={error != null ? error["message"] : null}
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              control={control}
              name="verbose"
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      checked={field.value}
                      color="primary"
                    />
                  }
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

export default ProxyPreferencesContainer;
