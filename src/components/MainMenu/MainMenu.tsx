import React, { FC, useEffect, useState } from "react"
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
import { setChallenge } from "../../store/challengeSlice"
import { ChallengeSetup } from "../../types/challenge"
import { useChallengeSetup } from "../../hooks/useChallengeSetup"
import ModalDialog from "../../molecules/ModalDialog/ModalDialog"
import { ChallengeLinkDialog } from "../../molecules/ChallengeLinkDialog/ChallengeLinkDialog"

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
      dispatch(setChallenge({ ...setup }))
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

  const onStartChallenge = () => {
    navigate(`/play/${challenge?.id}`)
  }

  return (
    <Box>
      <Zoom in={true}>
        <img
          alt="Spinning eart"
          width="200"
          src="https://r2.community.samsung.com/t5/image/serverpage/image-id/2858216iF966CF430D380489/image-size/large?v=v2&px=999"
        />
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
        >
          Single Player
        </Button>
        <Button
          color="primary"
          aria-label="multi player"
          variant="outlined"
          onClick={onClickMultiplayer}
        >
          Multiplayer
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
        open={pairing}
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
          <Typography variant="h5" color="primary">
            Pairing
          </Typography>
          <CircularProgress />
          <Typography variant="subtitle1" color="text.secondary">
            Please wait while we're finding your challengers...
          </Typography>
        </Stack>
      </ModalDialog>
    </Box>
  )
}

interface Props {}
