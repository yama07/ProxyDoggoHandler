import React from "react";
import {
  Theme,
  createStyles,
  DialogTitle,
  DialogContentText,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme: Theme) => {
  const baseMargin = 3;
  return createStyles({
    title: {
      paddingTop: theme.spacing(baseMargin),
      paddingLeft: theme.spacing(baseMargin),
      paddingRight: theme.spacing(baseMargin),
    },
    content: {
      padding: theme.spacing(baseMargin),
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

  const classes = useStyles({});
  return (
    <Dialog open onClose={handleClose}>
      <DialogTitle className={classes.title}>
        {"設定を削除してよろしいですか？"}
      </DialogTitle>
      <DialogContent className={classes.content}>
        <DialogContentText>{upstream.name}</DialogContentText>
      </DialogContent>

      <DialogActions className={classes.actions}>
        <Button
          className={classes.button}
          variant="outlined"
          color="primary"
          autoFocus
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          className={classes.button}
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
