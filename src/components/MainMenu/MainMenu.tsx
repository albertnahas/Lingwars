import React, { FC, useEffect } from "react"
import { Box, Button, Stack, Typography, Zoom } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { ChallengeDialog } from "../../molecules/ChallengeDialog/ChallengeDialog"
import { useDispatch } from "react-redux"
import { GameDialog } from "../../molecules/GameDialog/GameDialog"
import { setChallenge } from "../../store/challengeSlice"
import { ChallengeSetup } from "../../types/challenge"
import { useChallengeSetup } from "../../hooks/useChallengeSetup"
import ModalDialog from "../../molecules/ModalDialog/ModalDialog"

const defaultChallengeSetup = { level: 1, players: 1, live: false }

export var MainMenu: FC<Props> = function (props) {
  const navigate = useNavigate()

  const [initialSetup, setInitialSetup] = React.useState<ChallengeSetup>()

  const { challenge, pairing, createChallenge, requestChallenge } =
    useChallengeSetup()

  const [openLevelsDialog, setOpenLevelsDialog] = React.useState(false)
  const [openChallengeDialog, setOpenChallengeDialog] = React.useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (challenge) {
      if (challenge.live) {
        onStartChallenge()
      } else {
        setOpenChallengeDialog(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge])

  useEffect(() => {
    if (initialSetup) {
      setOpenLevelsDialog(true)
    }
  }, [initialSetup])

  const onCreateGame = (setup?: ChallengeSetup) => {
    setOpenLevelsDialog(false)
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
        aria-label="Lingwars"
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
        <GameDialog
          setup={initialSetup}
          open={openLevelsDialog}
          onClose={onCreateGame}
        />
      )}
      {challenge && (
        <ChallengeDialog
          challengeId={challenge?.id}
          open={openChallengeDialog}
          onClose={onStartChallenge}
        />
      )}
      <ModalDialog open={pairing} setOpen={() => {}}>
        <div>Pairing...</div>
      </ModalDialog>
    </Box>
  )
}

interface Props {}
