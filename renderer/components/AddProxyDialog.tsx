import React from 'react';
import { Theme, createStyles, Grid, Checkbox, FormControlLabel, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DogBreadsIcon, { DogIconIds } from './DogBreadsIcon';

const useStyles = makeStyles((theme: Theme) => {
    const base_margin = 3;
    return createStyles({
        content: {
            padding: theme.spacing(base_margin),
        },
        formControl: {
            // margin: theme.spacing(10),
            // minWidth: 60,
            display: 'flex',
            // alignItems: 'center',
            // justifyContent: 'center',
        },
    })
});

type Props = {
    isOpen: boolean,
    onDismiss: () => void,
    onConfirm: (icon: string, name: string,
        host: string,
        port: number,
        credentials?: {
            user: string,
            password: string,
        }) => void,
}

const AddProxyDialog: React.FC<Props> = ({ isOpen, onDismiss, onConfirm }: Props) => {
    const [open, setOpen] = React.useState(false);
    const [iconId, setIconId] = React.useState(DogIconIds[0]);
    const [name, setName] = React.useState("");
    const [host, setHost] = React.useState("");
    const [port, setPort] = React.useState(80);
    const [needsAuth, setNeedsAuth] = React.useState(false);
    const [user, setUser] = React.useState("");
    const [password, setPassword] = React.useState("");

    React.useEffect(() => {
        setOpen(isOpen);
        setName("")
        setHost("")
        setPort(80)
        setNeedsAuth(false)
        setUser("")
        setPassword("")
    }, [isOpen]);

    const handleClose = () => {
        setOpen(false);
        onDismiss();
    };

    const classes = useStyles({});
    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogContent className={classes.content}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={2}>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="demo-simple-select-label">Icon</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                defaultValue={DogIconIds[0]}
                                value={iconId}
                                onChange={(e) => { setIconId(e.target.value as string) }}
                            >
                                {DogIconIds.map((iconId) => (
                                    <MenuItem value={iconId} key={iconId}>
                                        <DogBreadsIcon iconId={iconId} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={10}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Name"
                            fullWidth
                            value={name}
                            onChange={(e) => { setName(e.target.value) }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            autoFocus
                            margin="dense"
                            id="host"
                            label="Host"
                            fullWidth
                            value={host}
                            onChange={(e) => { setHost(e.target.value) }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            autoFocus
                            margin="dense"
                            id="port"
                            label="Port number"
                            fullWidth
                            type="number"
                            InputProps={{ inputProps: { min: 0, max: 65535 } }}
                            value={port}
                            onChange={(e) => { setPort(parseInt(e.target.value) ?? 0) }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={needsAuth}
                                    onChange={() => { setNeedsAuth(!needsAuth) }}
                                    name="checkedB"
                                    color="primary"
                                />
                            }
                            label="Authentication"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} hidden={!needsAuth}>
                        <TextField
                            required
                            autoFocus
                            margin="dense"
                            id="user"
                            label="Login"
                            fullWidth
                            value={user}
                            onChange={(e) => { setUser(e.target.value) }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} hidden={!needsAuth}>
                        <TextField
                            required
                            autoFocus
                            margin="dense"
                            id="password"
                            label="Password"
                            fullWidth
                            type="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value) }}

                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={() => { onDismiss() }} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => {
                    onConfirm(iconId, name, host, port,
                        needsAuth ? { user: user, password: password } : null);
                    onDismiss();
                }} color="primary">
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddProxyDialog;
