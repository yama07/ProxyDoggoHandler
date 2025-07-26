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

const ProfileDeleteDialog: React.FC<Props> = ({ profile, onDismiss, onConfirm }: Props) => {
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
        プロファイルを削除しますか？
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
          color="error"
          onClick={() => {
            onConfirm();
            onDismiss();
          }}
        >
          削除
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileDeleteDialog;
