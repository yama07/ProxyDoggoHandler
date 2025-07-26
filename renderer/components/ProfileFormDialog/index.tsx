import { zodResolver } from "@hookform/resolvers/zod";
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
import { Controller, useForm } from "react-hook-form";

import { dogIconIds } from "$/icon/dogIcon";
import { type Profile, protocolIds, protocols } from "$/preference/profilePreference";

import DogBreadsIcon from "../DogBreadsIcon";
import { type FormValues, formValuesSchema, profileToFormValues } from "./formValues";

type Props = {
  oldProfile?: Profile;
  onDismiss: () => void;
  onConfirm: (newProfile: Profile) => void;
};

const ProfileFormDialog: React.FC<Props> = (props: Props) => {
  const defaultValues: FormValues = profileToFormValues(props.oldProfile);

  const { handleSubmit, watch, control, trigger } = useForm<FormValues, unknown, Profile>({
    criteriaMode: "all",
    shouldUseNativeValidation: false,
    defaultValues,
    resolver: zodResolver(formValuesSchema),
  });

  const protocol = watch("connectionSetting.protocol");
  const needsAuth = watch("connectionSetting.needsAuth");

  const onClose = () => {
    props.onDismiss();
  };

  const onSubmit = (formData: Profile) => {
    props.onConfirm(formData);
    props.onDismiss();
  };

  return (
    <Dialog open onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent sx={{ p: (theme) => theme.spacing(4) }}>
          <Grid container rowSpacing={0} columnSpacing={2}>
            <Grid size={{ xs: 12, sm: 2 }}>
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
            <Grid size={{ xs: 12, sm: 10 }}>
              <Controller
                control={control}
                name="name"
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    variant="standard"
                    margin="dense"
                    label="Name"
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <Controller
                control={control}
                name="connectionSetting.protocol"
                render={({ field }) => (
                  <FormControl variant="standard" sx={{ display: "flex" }}>
                    <InputLabel id="protocol-select-label" sx={{ pt: (theme) => theme.spacing(1) }}>
                      Protocol
                    </InputLabel>
                    <Select
                      {...field}
                      sx={{ pt: (theme) => theme.spacing(1) }}
                      onChange={(e) => {
                        field.onChange(e);
                        if (e.target.value === "direct") {
                          trigger();
                        }
                      }}
                    >
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
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                control={control}
                name="connectionSetting.host"
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    variant="standard"
                    margin="dense"
                    label="Host"
                    placeholder="proxy.example.com"
                    error={!!error}
                    helperText={error?.message}
                    fullWidth
                    required={protocol !== "direct"}
                    disabled={protocol === "direct"}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Controller
                control={control}
                name="connectionSetting.port"
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    variant="standard"
                    margin="dense"
                    label="Port"
                    placeholder="8080"
                    error={!!error}
                    helperText={error?.message}
                    fullWidth
                    required={protocol !== "direct"}
                    disabled={protocol === "direct"}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 12 }}>
              <Controller
                control={control}
                name="connectionSetting.bypass"
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    variant="standard"
                    margin="dense"
                    label="Bypass"
                    placeholder="localhost,127.0.0.1,*.example.com"
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                    disabled={protocol === "direct"}
                  />
                )}
              />
            </Grid>

            <Grid size={12}>
              <Controller
                control={control}
                name="connectionSetting.remoteDns"
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={field.value}
                        color="primary"
                        disabled={protocol !== "socks4" && protocol !== "socks5"}
                      />
                    }
                    label="DNSの名前解決をプロキシ経由で行う"
                  />
                )}
              />
            </Grid>

            <Grid size={12}>
              <Controller
                control={control}
                name="connectionSetting.needsAuth"
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
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    control={control}
                    name="connectionSetting.credential.user"
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        variant="standard"
                        margin="dense"
                        label="Login"
                        placeholder="alex@example.com"
                        error={!!error}
                        helperText={error != null ? error.message : null}
                        fullWidth
                        required={protocol !== "direct"}
                        disabled={protocol === "direct"}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    control={control}
                    name="connectionSetting.credential.password"
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        variant="standard"
                        margin="dense"
                        label="Password"
                        type="password"
                        placeholder="P@ssw0rd"
                        error={!!error}
                        helperText={error != null ? error.message : null}
                        fullWidth
                        required={protocol !== "direct"}
                        disabled={protocol === "direct"}
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
          <Button sx={{ textTransform: "none" }} type="submit" variant="contained" color="primary">
            OK
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProfileFormDialog;
