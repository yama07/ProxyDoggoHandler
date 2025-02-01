import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import type { Profile } from "$/preference/profilePreference";

type Props = {
  profile: Profile;
  onDismiss: () => void;
  onConfirm: () => void;
};

const DeleteDialog: React.FC<Props> = ({ profile, onDismiss, onConfirm }: Props) => {
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
        <DialogContentText noWrap>{profile.name}</DialogContentText>
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
