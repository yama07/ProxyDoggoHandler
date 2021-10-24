import React from "react";
import {
  Theme,
  createStyles,
  Grid,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import DogBreadsIcon, { DogIconIds } from "../DogBreadsIcon";
import { Controller, useForm } from "react-hook-form";

const useStyles = makeStyles((theme: Theme) => {
  const baseMargin = 3;
  return createStyles({
    content: {
      padding: theme.spacing(baseMargin),
    },
    formControl: {
      display: "flex",
    },
    actions: {
      paddingLeft: theme.spacing(baseMargin),
      paddingRight: theme.spacing(baseMargin),
      paddingBottom: theme.spacing(baseMargin),
    },
    button: {
      textTransform: "none",
    },
  });
});

type Props = {
  oldUpstream?: UpstreamType;
  onDismiss: () => void;
  onConfirm: (newUpstream: UpstreamType) => void;
};

const AddOrEditDialog: React.FC<Props> = (props: Props) => {
  const { trigger, handleSubmit, watch, control } = useForm({
    criteriaMode: "all",
    shouldUseNativeValidation: false,
    defaultValues: {
      iconId: props.oldUpstream?.icon ?? "001-dog",
      name: props.oldUpstream?.name ?? "",
      host: props.oldUpstream?.connectionSetting?.host ?? "",
      port: props.oldUpstream?.connectionSetting?.port ?? 80,
      needsAuth: props.oldUpstream?.connectionSetting?.credentials != null,
      user: props.oldUpstream?.connectionSetting?.credentials?.user ?? "",
      password:
        props.oldUpstream?.connectionSetting?.credentials?.password ?? "",
    },
  });
  const needsAuth = watch("needsAuth");

  const onClose = React.useCallback(() => {
    props.onDismiss();
  }, []);

  const onSubmit = React.useCallback((formData) => {
    const newUpstream: UpstreamType = {
      icon: formData.iconId,
      name: formData.name,
      connectionSetting: {
        host: formData.host,
        port: formData.port,
        credentials: formData.needsAuth
          ? { user: formData.user, password: formData.password }
          : null,
      },
    };
    props.onConfirm(newUpstream);
    props.onDismiss();
  }, []);

  const classes = useStyles({});
  return (
    <Dialog open onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="form" noValidate>
        <DialogContent className={classes.content}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={2}>
              <Controller
                control={control}
                name="iconId"
                render={({ field }) => (
                  <FormControl className={classes.formControl}>
                    <InputLabel id="icon-select-label">Icon</InputLabel>
                    <Select {...field}>
                      {DogIconIds.map((iconId) => (
                        <MenuItem value={iconId} key={iconId}>
                          <DogBreadsIcon iconId={iconId} />
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
                  <TextField {...field} margin="dense" label="Name" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                control={control}
                name="host"
                rules={{ required: "このフィールドを入力してください。" }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    margin="dense"
                    label="Host"
                    placeholder="example.com"
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
                name="port"
                rules={{
                  required: "このフィールドを入力してください。",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "数字を入力してください。",
                  },
                  min: { value: 0, message: "値は0以上にする必要があります。" },
                  max: {
                    value: 65535,
                    message: "値は65535以下にする必要があります。",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    margin="dense"
                    label="Port number"
                    type="number"
                    InputProps={{ inputProps: { min: 0, max: 65535 } }}
                    error={error != null}
                    helperText={error != null ? error["message"] : null}
                    fullWidth
                    required
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
        <DialogActions className={classes.actions}>
          <Button
            className={classes.button}
            variant="outlined"
            color="primary"
            autoFocus
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className={classes.button}
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
