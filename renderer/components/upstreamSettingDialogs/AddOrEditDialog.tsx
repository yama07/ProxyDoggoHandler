import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";

import DogBreadsIcon, { DogIconIds } from "../DogBreadsIcon";

type Props = {
  oldUpstream?: UpstreamType;
  onDismiss: () => void;
  onConfirm: (newUpstream: UpstreamType) => void;
};

const AddOrEditDialog: React.FC<Props> = (props: Props) => {
  // 設定自体は与えられているが、接続情報が設定されていない場合は、
  // ダイレクトアクセスの設定とみなす
  const isDirectAccessSetting: boolean =
    props.oldUpstream && !props.oldUpstream.connectionSetting;

  const oldConnectionSetting = props.oldUpstream?.connectionSetting;
  const oldCredentials = oldConnectionSetting?.credentials;

  const { trigger, handleSubmit, watch, control } = useForm({
    criteriaMode: "all",
    shouldUseNativeValidation: false,
    defaultValues: {
      iconId: props.oldUpstream?.icon ?? "001-dog",
      name: props.oldUpstream?.name ?? "",
      host: isDirectAccessSetting
        ? "Direct access (no proxy)"
        : oldConnectionSetting?.host ?? "",
      port: isDirectAccessSetting ? 0 : oldConnectionSetting?.port ?? 80,
      needsAuth: oldCredentials != null,
      user: oldCredentials?.user ?? "",
      password: oldCredentials?.password ?? "",
    },
  });
  const needsAuth = watch("needsAuth");

  const onClose = React.useCallback(() => {
    props.onDismiss();
  }, [props]);

  const onSubmit = React.useCallback(
    (formData) => {
      const newUpstream: UpstreamType = {
        icon: formData.iconId,
        name: formData.name,
        connectionSetting: isDirectAccessSetting
          ? null
          : {
              host: formData.host,
              port: formData.port,
              credentials: formData.needsAuth
                ? { user: formData.user, password: formData.password }
                : null,
            },
      };
      props.onConfirm(newUpstream);
      props.onDismiss();
    },
    [isDirectAccessSetting, props]
  );

  return (
    <Dialog open onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent sx={{ p: (theme) => theme.spacing(4) }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={2}>
              <Controller
                control={control}
                name="iconId"
                render={({ field }) => (
                  <FormControl variant="standard" sx={{ display: "flex" }}>
                    <InputLabel id="icon-select-label">Icon</InputLabel>
                    <Select {...field} MenuProps={{ sx: { maxHeight: "90%" } }}>
                      {DogIconIds.map((iconId) => (
                        <MenuItem value={iconId} key={iconId}>
                          <DogBreadsIcon iconId={iconId} style="lineal" />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={10}>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant="standard"
                    margin="dense"
                    label="Name"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                control={control}
                name="host"
                rules={
                  isDirectAccessSetting
                    ? {}
                    : { required: "このフィールドを入力してください。" }
                }
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    variant="standard"
                    margin="dense"
                    label="Host"
                    placeholder="example.com"
                    error={error != null}
                    helperText={error != null ? error["message"] : null}
                    fullWidth
                    required={!isDirectAccessSetting}
                    disabled={isDirectAccessSetting}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                control={control}
                name="port"
                rules={
                  isDirectAccessSetting
                    ? {}
                    : {
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
                      }
                }
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    variant="standard"
                    margin="dense"
                    label="Port number"
                    type="number"
                    InputProps={{ inputProps: { min: 0, max: 65535 } }}
                    error={error != null}
                    helperText={error != null ? error["message"] : null}
                    fullWidth
                    required={!isDirectAccessSetting}
                    disabled={isDirectAccessSetting}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="needsAuth"
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={field.value}
                        color="primary"
                        disabled={isDirectAccessSetting}
                      />
                    }
                    label="Authentication"
                  />
                )}
              />
            </Grid>
            {needsAuth && (
              <>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="user"
                    rules={{ required: "このフィールドを入力してください。" }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        variant="standard"
                        margin="dense"
                        label="Login"
                        placeholder="alex@example.com"
                        error={error != null}
                        helperText={error != null ? error["message"] : null}
                        fullWidth
                        required
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="password"
                    rules={{ required: "このフィールドを入力してください。" }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        variant="standard"
                        margin="dense"
                        label="Password"
                        type="password"
                        placeholder="P@ssw0rd"
                        error={error != null}
                        helperText={error != null ? error["message"] : null}
                        fullWidth
                        required
                      />
                    )}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            px: (theme) => theme.spacing(4),
            pb: (theme) => theme.spacing(4),
          }}
        >
          <Button
            sx={{ textTransform: "none" }}
            variant="outlined"
            color="primary"
            autoFocus
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            sx={{ textTransform: "none" }}
            type="submit"
            variant="contained"
            color="primary"
            onClick={() => {
              trigger();
            }}
          >
            OK
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddOrEditDialog;
