import * as React from "react";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import {
  Chip,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { setSnackbar } from "../../store/snackbarSlice";

export interface ChallengeDialogProps {
  open: boolean;
  challengeId?: string;
  onClose: () => void;
}

const LEVELS_COUNT = 5;

export function ChallengeDialog(props: ChallengeDialogProps) {
  const { onClose, challengeId, open } = props;

  const dispatch = useDispatch();

  const challengeLink = React.useMemo(
    () => `${window.location.href}play/${challengeId}`,
    [challengeId]
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(challengeLink);
    dispatch(
      setSnackbar({
        open: true,
        message: "Link has been copied!",
        type: "success",
      })
    );
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Challenge link</DialogTitle>

      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Share the link below with your challenger and start
        </DialogContentText>
        <Chip
          label={challengeLink}
          sx={{ mt: 1 }}
          variant="filled"
          onClick={handleCopy}
          onDelete={handleCopy}
          deleteIcon={<ContentCopyIcon style={{ fontSize: 16 }} />}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          Start
        </Button>
      </DialogActions>
    </Dialog>
  );
}
