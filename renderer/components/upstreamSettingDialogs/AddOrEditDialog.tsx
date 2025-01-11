import {
  Box,
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
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";

import { dogIconIds } from "$/icon/dogIcon";
import { type Profile, protocolIds, protocols } from "$/preference/profilePreference";

import DogBreadsIcon from "../DogBreadsIcon";

type Props = {
  oldUpstream?: Profile;
  onDismiss: () => void;
  onConfirm: (newUpstream: Profile) => void;
};

const AddOrEditDialog: React.FC<Props> = (props: Props) => {
  const defaultValues: Profile & { needsAuth: boolean } =
    props.oldUpstream === undefined
      ? {
          icon: "001-dog",
          name: "",
          connectionSetting: { protocol: "direct" },
          needsAuth: false,
        }
      : {
          ...props.oldUpstream,
          needsAuth:
            props.oldUpstream.connectionSetting.protocol !== "direct" &&
            props.oldUpstream.connectionSetting.credentials !== undefined,
        };

  const { trigger, handleSubmit, watch, control } = useForm({
    criteriaMode: "all",
    shouldUseNativeValidation: false,
    defaultValues,
  });

  const protocol = watch("connectionSetting.protocol");
  const needsAuth = watch("needsAuth");

  const onClose = useCallback(() => {
    props.onDismiss();
  }, [props]);

  const onSubmit = useCallback(
    (formData: typeof defaultValues) => {
      const { needsAuth, ...newProfile } = formData;

      if (
        !needsAuth &&
        (newProfile.connectionSetting.protocol === "http" ||
          newProfile.connectionSetting.protocol === "socks")
      ) {
        newProfile.connectionSetting.credentials = undefined;
      }

      props.onConfirm(newProfile);
      props.onDismiss();
    },
    [props],
  );

  return (
    <Dialog open onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent sx={{ p: (theme) => theme.spacing(4) }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={2}>
              <Controller
                control={control}
                name="icon"
                render={({ field }) => (
                  <FormControl variant="standard" sx={{ display: "flex" }}>
                    <InputLabel id="icon-select-label" sx={{ pt: (theme) => theme.spacing(1) }}>
                      Icon
                    </InputLabel>
                    <Select
                      {...field}
                      MenuProps={{ sx: { maxHeight: "90%" } }}
                      sx={{ pt: (theme) => theme.spacing(1) }}
                    >
                      {dogIconIds.map((iconId) => (
                        <MenuItem value={iconId} key={iconId}>
                          <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <DogBreadsIcon iconId={iconId} style="lineal" />
                          </Box>
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
                  <TextField {...field} variant="standard" margin="dense" label="Name" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Controller
                control={control}
                name="connectionSetting.protocol"
                render={({ field }) => (
                  <FormControl variant="standard" sx={{ display: "flex" }}>
                    <InputLabel id="protocol-select-label" sx={{ pt: (theme) => theme.spacing(1) }}>
                      Protocol
                    </InputLabel>
                    <Select {...field} sx={{ pt: (theme) => theme.spacing(1) }}>
                      {protocolIds.map((protocolId) => (
                        <MenuItem value={protocolId} key={protocolId}>
                          {protocols[protocolId].label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <Controller
                control={control}
                name="connectionSetting.host"
                rules={
                  protocol !== "direct" ? {} : { required: "このフィールドを入力してください。" }
                }
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    variant="standard"
                    margin="dense"
                    label="Host"
                    placeholder="example.com"
                    error={error != null}
                    helperText={error != null ? error.message : null}
                    fullWidth
                    required={protocol !== "direct"}
                    disabled={protocol === "direct"}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Controller
                control={control}
                name="connectionSetting.port"
                rules={
                  protocol === "direct"
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
                    label="Port"
                    type="number"
                    InputProps={{ inputProps: { min: 0, max: 65535 } }}
                    error={error != null}
                    helperText={error != null ? error.message : null}
                    fullWidth
                    required={protocol !== "direct"}
                    disabled={protocol === "direct"}
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
                        disabled={protocol === "direct"}
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
                    name="connectionSetting.credentials.user"
                    rules={{ required: "このフィールドを入力してください。" }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        variant="standard"
                        margin="dense"
                        label="Login"
                        placeholder="alex@example.com"
                        error={error != null}
                        helperText={error != null ? error.message : null}
                        fullWidth
                        required
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="connectionSetting.credentials.password"
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
                        helperText={error != null ? error.message : null}
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
