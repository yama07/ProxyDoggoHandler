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
import {
  type Profile,
  isDirectConnectionSetting,
  isSocksConnectionSetting,
  profileSchema,
  protocolIds,
  protocols,
} from "$/preference/profilePreference";

import DogBreadsIcon from "../DogBreadsIcon";

type Props = {
  oldProfile?: Profile;
  onDismiss: () => void;
  onConfirm: (newProfile: Profile) => void;
};

type FormData = {
  icon: string;
  name: string;
  connectionSetting: {
    protocol: string;
    host: string;
    port: string;
    needsAuth: boolean;
    credential: {
      user: string;
      password: string;
    };
    bypass: string;
    remoteDns: boolean;
  };
};

const defaultFormData: FormData = {
  icon: "001-dog",
  name: "",
  connectionSetting: {
    protocol: "http",
    host: "",
    port: "",
    needsAuth: false,
    credential: {
      user: "",
      password: "",
    },
    bypass: "localhost,127.0.0.1",
    remoteDns: true,
  },
} as const;

const AddOrEditDialog: React.FC<Props> = (props: Props) => {
  const defaultValues: FormData = props.oldProfile
    ? {
        icon: props.oldProfile.icon,
        name: props.oldProfile.name,
        connectionSetting: isDirectConnectionSetting(props.oldProfile.connectionSetting)
          ? {
              protocol: props.oldProfile.connectionSetting.protocol,
              host: "",
              port: "",
              needsAuth: false,
              credential: {
                user: "",
                password: "",
              },
              bypass: "",
              remoteDns: true,
            }
          : {
              protocol: props.oldProfile.connectionSetting.protocol,
              host: props.oldProfile.connectionSetting.host,
              port: String(props.oldProfile.connectionSetting.port),
              needsAuth: !!props.oldProfile.connectionSetting.credential,
              credential: {
                user: props.oldProfile.connectionSetting.credential?.user ?? "",
                password: props.oldProfile.connectionSetting.credential?.password ?? "",
              },
              bypass: props.oldProfile.connectionSetting.bypass,
              remoteDns: isSocksConnectionSetting(props.oldProfile.connectionSetting)
                ? props.oldProfile.connectionSetting.remoteDns
                : true,
            },
      }
    : defaultFormData;
  const innerResolver = zodResolver(profileSchema);
  const { handleSubmit, watch, control, trigger } = useForm<FormData, unknown, Profile>({
    criteriaMode: "all",
    shouldUseNativeValidation: false,
    defaultValues,
    resolver: (value, context, options) => {
      // フォームの形式とProfileの型が合わないため、
      // データを変換してからzodResolverに渡す
      const data = {
        icon: value.icon,
        name: value.name,
        connectionSetting: {
          protocol: value.connectionSetting.protocol,
          host: value.connectionSetting.host,
          port: value.connectionSetting.port ? Number(value.connectionSetting.port) : undefined,
          credential: value.connectionSetting.needsAuth
            ? { ...value.connectionSetting.credential }
            : undefined,
          bypass: value.connectionSetting.bypass,
          remoteDns: value.connectionSetting.remoteDns,
        },
      };
      // biome-ignore lint/suspicious/noExplicitAny: FormDataとProfileでフィールドを揃えているから問題ないが、もっとスマートな方法を模索中
      return innerResolver(data, context, options as any);
    },
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

            <Grid item xs={12} sm={3}>
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
            <Grid item xs={12} sm={6}>
              <Controller
                control={control}
                name="connectionSetting.host"
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    variant="standard"
                    margin="dense"
                    label="Host"
                    placeholder="example.com"
                    error={!!error}
                    helperText={error?.message}
                    fullWidth
                    required={protocol !== "direct"}
                    disabled={protocol === "direct"}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Controller
                control={control}
                name="connectionSetting.port"
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    variant="standard"
                    margin="dense"
                    label="Port"
                    error={!!error}
                    helperText={error?.message}
                    fullWidth
                    required={protocol !== "direct"}
                    disabled={protocol === "direct"}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
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

            <Grid item xs={12}>
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

            <Grid item xs={12}>
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
                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12} sm={6}>
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

export default AddOrEditDialog;
