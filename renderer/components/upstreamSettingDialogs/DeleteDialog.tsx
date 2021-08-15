import React from "react";
import { DialogTitle, DialogContentText } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

type Props = {
  upstream: UpstreamType;
  onDismiss: () => void;
  onConfirm: () => void;
};

const DeleteDialog: React.FC<Props> = ({
  upstream,
  onDismiss,
  onConfirm,
}: Props) => {
  const handleClose = () => {
    onDismiss();
  };

  return (
    <Dialog
      open
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Are you sure to delete this setting?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {upstream.name}
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

export default DeleteDialog;
