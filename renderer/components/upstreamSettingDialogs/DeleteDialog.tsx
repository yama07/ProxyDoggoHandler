import React from "react";
import {
  DialogTitle,
  DialogContentText,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";

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
    <Dialog open onClose={handleClose}>
      <DialogTitle
        sx={{
          p: (theme) => theme.spacing(4),
        }}
      >
        設定を削除してよろしいですか？
      </DialogTitle>
      <DialogContent sx={{ px: (theme) => theme.spacing(4) }}>
        <DialogContentText noWrap>{upstream.name}</DialogContentText>
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
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          sx={{ textTransform: "none" }}
          variant="contained"
          color="primary"
          onClick={() => {
            onConfirm();
            onDismiss();
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
