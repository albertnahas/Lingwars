import * as React from "react";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import { blue } from "@mui/material/colors";
import { getLevelLabel } from "../../utils/helpers";

export interface LevelDialogProps {
  open: boolean;
  selectedValue: number;
  onClose: (value: number) => void;
}

const LEVELS_COUNT = 5;

export function LevelDialog(props: LevelDialogProps) {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: number) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Select difficulty level</DialogTitle>
      <List sx={{ pt: 0 }}>
        {Array.from({ length: LEVELS_COUNT }, (_, i) => i + 1).map((l) => (
          <ListItem button onClick={() => handleListItemClick(l)} key={l}>
            {/* <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar> */}
            <ListItemText primary={getLevelLabel(l)} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}
