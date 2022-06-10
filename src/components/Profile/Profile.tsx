import { FC, useState } from "react"
import { Container, Box, Grid, Button } from "@mui/material"
import { useSelector } from "react-redux"
import ModalDialog from "../../molecules/ModalDialog/ModalDialog"
import { DeleteAccountForm } from "./DeleteAccountForm"
import { userSelector } from "../../store/userSlice"
import { useUser } from "../../hooks/useUser"
import { ProfilePhoto } from "./partials/ProfilePhoto/ProfilePhoto"
import { EditableDisplay } from "./partials/EditableDisplay/EditableDisplay"

export const Profile: FC<Props> = ({ signOut }) => {
  const user = useSelector(userSelector)
  const [openDeleteAccount, setOpenDeleteAccount] = useState(false)

  const { updateUser } = useUser()

  const [imageAsUrl, setImageAsUrl] = useState<any>(user?.photoURL)

  const onClickSubmitDisplayName = (name?: string) => {
    return updateUser({ ...user, displayName: name || "" })
  }

  const onUploadPhoto = (photoURL: string) => {
    return updateUser({ ...user, photoURL })
  }

  return (
    <Container aria-label="profile container" maxWidth="lg">
      <Grid spacing={2} container>
        <Grid xs={12} item>
          <Box>
            <Box sx={{ mt: 4, mb: 2 }}>
              <ProfilePhoto
                imageAsUrl={imageAsUrl}
                setImageAsUrl={setImageAsUrl}
                onUpload={onUploadPhoto}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <EditableDisplay
                name="displayName"
                label={"Type in the username you want others to see"}
                onSubmit={onClickSubmitDisplayName}
                text={user?.displayName}
              />
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
            sx={{ my: 1 }}
          >
            Delete Account
          </Button>
        </Grid>
      </Grid>
      <ModalDialog
        closeButton={true}
        open={openDeleteAccount}
        setOpen={setOpenDeleteAccount}
      >
        <DeleteAccountForm />
      </ModalDialog>
    </Container>
  )
}

interface Props {
  signOut?: () => void
}
