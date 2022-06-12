import { FC, useMemo, useState } from "react"
import {
  Container,
  Box,
  Grid,
  Button,
  Paper,
  Typography,
  Chip,
} from "@mui/material"
import { useSelector } from "react-redux"
import ModalDialog from "../../molecules/ModalDialog/ModalDialog"
import { DeleteAccountForm } from "./DeleteAccountForm"
import { userSelector } from "../../store/userSlice"
import { useUser } from "../../hooks/useUser"
import { ProfilePhoto } from "./partials/ProfilePhoto/ProfilePhoto"
import { EditableDisplay } from "./partials/EditableDisplay/EditableDisplay"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import LogoutIcon from "@mui/icons-material/Logout"

import moment from "moment"
import { ProgressRing } from "../../atoms/ProgressRing/ProgressRing"
import { ProgressLine } from "../../atoms/ProgressLine/ProgressLine"
import { getLv } from "../../utils/helpers"

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

  const lastPlayed = useMemo(() => {
    var currentTimestamp = moment(new Date()).format("HH:mm:ss")
    return user?.lastPlayedAt
      ? moment
          .duration(
            moment(currentTimestamp, "HH:mm:ss").diff(
              moment(user?.lastPlayedAt?.toDate(), "HH:mm:ss")
            )
          )
          .humanize() + " ago"
      : "No games yet"
  }, [user])

  const lvInfo = useMemo(() => {
    return getLv(user?.xp)
  }, [user])

  return (
    <Container aria-label="profile container" maxWidth="sm">
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
        <Grid sx={{ textALign: "center" }} xs={12} container>
          <Grid xs={4} item>
            <Typography color="text.secondary" variant="body1">
              Streak
            </Typography>
            <Typography color="info.main" variant="h4">
              {user?.streak || 0}
            </Typography>
          </Grid>
          <Grid xs={4} item>
            <Typography color="text.secondary" variant="body1">
              Games
            </Typography>
            <Typography color="info.main" variant="h4">
              {user?.gamesPlayed || 0}
            </Typography>
          </Grid>
          <Grid xs={4} item>
            <Typography color="text.secondary" variant="body1">
              Languages
            </Typography>
            <Typography color="info.main" variant="h4">
              {user?.languages?.length || 0}
            </Typography>
          </Grid>
        </Grid>
        <Grid xs={6} item>
          <Paper
            elevation={12}
            sx={{
              p: 2,
              backgroundColor: "info.light",
              color: "#fff",
              textAlign: "left",
            }}
          >
            <Grid sx={{ alignItems: "center" }} container>
              <Grid xs={9} item>
                <Typography variant="caption">Last played</Typography>
                <Typography variant="body2">{lastPlayed}</Typography>
              </Grid>
              <Grid xs={3} item>
                <AccessTimeIcon fontSize="large" sx={{ opacity: 0.4 }} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid xs={6} item>
          <Paper
            elevation={6}
            sx={{
              p: 2,
              backgroundColor: "secondary.light",
              color: "#fff",
              textAlign: "left",
            }}
          >
            <Grid sx={{ alignItems: "center" }} container>
              <Grid xs={9} item>
                <Typography variant="caption">Accuracy</Typography>
                <Typography variant="body1">
                  {Math.round((user?.accuracy || 0) * 100)}%
                </Typography>
              </Grid>
              <Grid xs={3} item>
                <ProgressRing
                  size={35}
                  color="#fff"
                  value={(user?.accuracy || 0) * 100}
                  thickness={3}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid xs={12} item>
          <Paper
            elevation={6}
            sx={{
              p: 2,
              textAlign: "left",
            }}
          >
            <Grid sx={{ alignItems: "center" }} container>
              <Grid xs={8} item>
                <Chip
                  color="secondary"
                  sx={{ fontWeight: "bold", color: "white", mr: 1 }}
                  size="small"
                  label={`LV${lvInfo?.lv}`}
                />

                <Typography
                  color="text.secondary"
                  variant="caption"
                  component="span"
                >
                  XP {user?.xp}/{lvInfo?.next}
                </Typography>
                <ProgressLine
                  variant="determinate"
                  value={lvInfo?.progress}
                  color="secondary"
                  sx={{ my: 1 }}
                />
                <Typography
                  color="text.secondary"
                  component="div"
                  variant="caption"
                >
                  {lvInfo?.next - (user?.xp || 0)} to LV{lvInfo?.lv + 1}
                </Typography>
              </Grid>
              <Grid xs={1} item></Grid>
              <Grid xs={3} item>
                <Typography color="secondary" variant="h6">
                  {lvInfo?.progress}%
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid xs={12} sx={{ mt: 4 }} item>
          <Button
            onClick={signOut}
            color="warning"
            size="small"
            variant="outlined"
            endIcon={<LogoutIcon />}
          >
            Sign out
          </Button>
        </Grid>

        <Grid xs={12} item>
          <Button
            onClick={() => setOpenDeleteAccount(true)}
            color="error"
            size="small"
            variant="text"
            sx={{ my: 1 }}
          >
            Delete Account
          </Button>
        </Grid>
      </Grid>
      <ModalDialog
        maxWidth="sm"
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
