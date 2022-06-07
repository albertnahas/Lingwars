import { FC, useEffect, useState } from "react"
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
  Zoom,
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import {
  ChallengeSetupDialog,
  defaultChallengeSetup,
} from "../../molecules/ChallengeSetupDialog/ChallengeSetupDialog"
import { setChallengeSetup } from "../../store/challengeSlice"
import { ChallengeSetup } from "../../types/challenge"
import { PairingStatus, useChallengeSetup } from "../../hooks/useChallengeSetup"
import ModalDialog from "../../molecules/ModalDialog/ModalDialog"
import { ChallengeLinkDialog } from "../../molecules/ChallengeLinkDialog/ChallengeLinkDialog"
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded"
import PersonRoundedIcon from "@mui/icons-material/PersonRounded"
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded"

export var MainMenu: FC<Props> = function (props) {
  const navigate = useNavigate()

  const [initialSetup, setInitialSetup] = useState<ChallengeSetup>()

  const {
    challenge,
    pairing,
    createChallenge,
    requestChallenge,
    cancelRequest,
  } = useChallengeSetup()

  const [openSetupDialog, setOpenSetupDialog] = useState(false)
  const [openChallengeLinkDialog, setOpenChallengeLinkDialog] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    if (challenge) {
      if (challenge.live) {
        onStartChallenge()
      } else {
        setOpenChallengeLinkDialog(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge])

  useEffect(() => {
    if (initialSetup) {
      setOpenSetupDialog(true)
    }
  }, [initialSetup])

  const onCreateGame = (setup?: ChallengeSetup) => {
    setOpenSetupDialog(false)
    setInitialSetup(undefined)

    if (!setup || !setup.level) return

    if (setup.players === 1) {
      dispatch(setChallengeSetup({ ...setup }))
      navigate(`/play`)
    } else {
      if (!setup.live) {
        createChallenge(setup)
      } else {
        requestChallenge(setup)
      }
    }
  }

  const onClickSinglePlayer = () => {
    setInitialSetup({ ...defaultChallengeSetup })
  }

  const onClickMultiplayer = () => {
    setInitialSetup({ ...defaultChallengeSetup, players: 2 })
  }

  const onClickLearn = () => {
    navigate(`/learn`)
  }
  const onStartChallenge = () => {
    navigate(`/play/${challenge?.id}`)
  }

  return (
    <Box>
      <Zoom in={true}>
        <Box sx={{ m: 4 }}>
          <img
            alt="Spinning eart"
            style={{ filter: "drop-shadow(-10px 20px 20px rgba(0,0,0,0.2))" }}
            width="150"
            src="/assets/imgs/earth.webp"
          />
        </Box>
      </Zoom>
      <Typography
        variant="h4"
        aria-label="lingwars"
        color="primary"
        sx={{ mb: 4 }}
      >
        Main Menu
      </Typography>
      <Stack
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        spacing={2}
      >
        <Button
          color="primary"
          aria-label="single player"
          variant="outlined"
          onClick={onClickSinglePlayer}
          startIcon={<PersonRoundedIcon />}
        >
          Single Player
        </Button>
        <Button
          color="primary"
          aria-label="multi player"
          variant="outlined"
          onClick={onClickMultiplayer}
          startIcon={<PeopleAltRoundedIcon />}
        >
          Multiplayer
        </Button>
        <Button
          color="primary"
          aria-label="learn"
          variant="outlined"
          onClick={onClickLearn}
          startIcon={<MenuBookRoundedIcon />}
        >
          Learn
        </Button>
      </Stack>
      {initialSetup && (
        <ChallengeSetupDialog
          setup={initialSetup}
          open={openSetupDialog}
          onClose={onCreateGame}
        />
      )}
      {challenge && (
        <ChallengeLinkDialog
          challengeId={challenge?.id}
          open={openChallengeLinkDialog}
          onClose={onStartChallenge}
        />
      )}
      <ModalDialog
        open={pairing !== PairingStatus.STALE}
        maxWidth="sm"
        onClose={cancelRequest}
        actions={
          <>
            <Button
              color="primary"
              aria-label="cancel pairing"
              variant="text"
              onClick={cancelRequest}
            >
              Cancel
            </Button>
          </>
        }
      >
        <Stack
          aria-label="pairing"
          sx={{ textAlign: "center", alignItems: "center" }}
          spacing={2}
        >
          {pairing === PairingStatus.PAIRING && (
            <>
              <Typography variant="h5" color="primary">
                Pairing
              </Typography>
              <CircularProgress />
              <Typography variant="subtitle1" color="text.secondary">
                Please wait while we're finding your challengers...
              </Typography>
            </>
          )}
          {pairing === PairingStatus.CANCELLED && (
            <>
              <Typography variant="h5" color="error">
                Pairing timeout
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Oops!... We couldn't find you challengers at the moment. Please
                try again later or use a different challenge setup.
              </Typography>
            </>
          )}
        </Stack>
      </ModalDialog>
    </Box>
  )
}

interface Props {}
