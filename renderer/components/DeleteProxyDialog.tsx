import React from "react";
import {
  Theme,
  createStyles,
  Grid,
  Checkbox,
  FormControlLabel,
  DialogTitle,
  DialogContentText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

const useStyles = makeStyles((theme: Theme) => {
  const base_margin = 3;
  return createStyles({
    content: {
      padding: theme.spacing(base_margin),
    },
  });
});

type Props = {
  isOpen: boolean;
  name: string;
  onDismiss: () => void;
  onConfirm: () => void;
};

const DeleteProxyDialog: React.FC<Props> = ({
  isOpen,
  name,
  onDismiss,
  onConfirm,
}: Props) => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
    onDismiss();
  };

  const classes = useStyles({});
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Are you sure to delete this setting?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {" "}
          {name}{" "}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary" autoFocus>
          Cancel
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            onDismiss();
          }}
          color="primary"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteProxyDialog;
