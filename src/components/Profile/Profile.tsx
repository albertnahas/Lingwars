import { FC, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Button,
  Avatar,
} from "@mui/material";
import { useSelector } from "react-redux";
import { UserCircle as UserCircleIcon } from "../../icons/user-circle";
import ModalDialog from "../../molecules/ModalDialog/ModalDialog";
import { DeleteAccountForm } from "./DeleteAccountForm";
import { userSelector } from "../../store/userSlice";

export const Profile: FC<Props> = ({ signOut }) => {
  const user = useSelector(userSelector);
  // const [editMode, setEditMode] = useState(false);
  const [openDeleteAccount, setOpenDeleteAccount] = useState(false);

  return (
    <Container maxWidth="lg">
      <Grid spacing={2} container>
        <Grid xs={12} item>
          <Box>
            <Box
              sx={{
                position: "relative",
                margin: "auto",
                boxSizing: "border-box",
              }}
            >
              <Avatar
                sx={{
                  height: 90,
                  width: 90,
                  m: "auto",
                  my: 4,
                }}
                src={user?.photoURL}
                alt="profile photo"
              >
                <UserCircleIcon fontSize="large" />
              </Avatar>
              <Typography variant="h5" color="text.secondary">
                {user?.displayName}
              </Typography>
            </Box>
          </Box>
          {/* <Divider sx={{ mt: 2, mb: 2 }} variant="middle" /> */}
        </Grid>
        <Grid xs={12} item>
          <Button
            onClick={signOut}
            color="warning"
            size="small"
            variant="outlined"
          >
            Sign out
          </Button>
        </Grid>
        <Grid xs={12} item>
          <Button
            onClick={() => setOpenDeleteAccount(true)}
            color="warning"
            size="small"
            variant="text"
          >
            Delete Account
          </Button>
        </Grid>
        {/* <PayPalButtons
                createOrder={(data: any, actions: any) => createOrder(data, actions)}
                onApprove={(data: any, actions: any) => onApprove(data, actions)}
                style={{ layout: "horizontal" }}
            /> */}
      </Grid>
      <ModalDialog
        closeButton={true}
        open={openDeleteAccount}
        setOpen={setOpenDeleteAccount}
      >
        <DeleteAccountForm />
      </ModalDialog>
    </Container>
  );
};

interface Props {
  signOut?: () => void;
}
