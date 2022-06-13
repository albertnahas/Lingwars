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
import { Container } from "@mui/system"
import { MainMenuOption } from "./partials/MainMenuOption"

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
        <Box sx={{ m: 1 }}>
          <img
            alt="Spinning Earth"
            title="Earth"
            style={{ filter: "drop-shadow(-10px 20px 20px rgba(0,0,0,0.15))" }}
            width="130"
            src="/assets/imgs/earth.webp"
          />
        </Box>
      </Zoom>
      <Typography variant="h4" aria-label="lingwars" color="primary">
        Main Menu
      </Typography>
      <Container
        sx={{
          px: 4,
          background: "url(/assets/imgs/bg.svg)",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
        maxWidth="xs"
      >
        <MainMenuOption
          title={"Single Player"}
          subtitle={"Score as high as you can"}
          image={"/assets/imgs/play-01.svg"}
          onClick={onClickSinglePlayer}
          animate={true}
        />
        <MainMenuOption
          title={"MultiPlayer"}
          subtitle={"Challenge others, and beat them all"}
          image={"/assets/imgs/play-02.svg"}
          onClick={onClickMultiplayer}
          animate={true}
        />
        <MainMenuOption
          title={" Learn"}
          subtitle={"It's all about learning!"}
          image={"/assets/imgs/play-03.svg"}
          onClick={onClickLearn}
          animate={true}
        />
      </Container>
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
