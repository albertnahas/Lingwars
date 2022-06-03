import { FC, useMemo } from "react"

import _ from "lodash"
import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material"
import { Box } from "@mui/system"
import { Player } from "../../types/challenge"
import { User } from "../../types/user"
import { PlayerChip } from "../../molecules/PlayerChip/PlayerChip"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import { StandardGameContainer } from "./StandardGame/StandardGameContainer"
import { SpeedGameContainer } from "./SpeedGame/SpeedGameContainer"
import { RematchButton } from "../../atoms/RematchButton/RematchButton"

export type GameStatus =
  | "loading"
  | "error"
  | "waiting"
  | "started"
  | "finished"

export const Game: FC<Props> = ({
  user,
  challenge,
  players,
  onClickLeave,
  onClickRematch,
  rematch,
  error,
}) => {
  const maxScore = useMemo(() => {
    if (!players || players.length < 2) return user?.displayName
    const mappedPlayers = players?.map((p: Player) => {
      return { displayName: p?.displayName, score: p?.timedScore }
    })
    return _.maxBy(mappedPlayers, "score")?.displayName
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players])

  const isGameDone = useMemo(
    () =>
      (players &&
        challenge &&
        challenge.id &&
        players.every((p) => p.turn >= (challenge.rounds || 10))) ||
      (challenge && challenge.id && challenge.status === "finished"),
    [players, challenge]
  )

  const gameStatus = useMemo<GameStatus>(() => {
    if (isGameDone) return "finished"
    if (error) return "error"
    if (!challenge || !challenge.id || challenge.full) return "started"
    if (challenge && challenge.id && !challenge.full) return "waiting"
    return "loading"
  }, [challenge, error, isGameDone])

  const renderPlayers = () => (
    <Stack
      direction="row"
      sx={{ justifyContent: "center", flexWrap: "wrap", gap: 2 }}
    >
      {players?.map((p, i) => (
        <PlayerChip player={p} key={i} isWinning={maxScore === p.displayName} />
      ))}
    </Stack>
  )

  const renderGame = () => {
    switch (challenge?.variation) {
      case "standard":
        return (
          <StandardGameContainer
            display={gameStatus !== "waiting"}
            players={players}
          />
        )
      case "speed":
        return (
          <SpeedGameContainer
            display={gameStatus !== "waiting"}
            players={players}
          />
        )

      default:
        return <></>
    }
  }

  const isAcceptRematch = challenge?.rematchRequested && !rematch

  return (
    <>
      <Container>
        <Typography
          component="h1"
          variant="h2"
          color="text.secondary"
          sx={{ m: 3 }}
        >
          Lingwars
        </Typography>

        {gameStatus !== "loading" ? (
          <>
            {gameStatus === "finished" && (
              <Typography
                component="p"
                aria-label="winner"
                variant="h5"
                color="success.main"
                sx={{ m: 3 }}
              >
                {maxScore} is the winner!!
              </Typography>
            )}

            {["started", "finished"].includes(gameStatus) &&
              players &&
              renderPlayers()}

            {!challenge?.rematchRequested && (
              <Box sx={{ my: 2 }}>{renderGame()}</Box>
            )}
            {gameStatus === "waiting" && (
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="h5"
                  aria-label="waiting for players"
                  color="primary.light"
                >
                  Waiting for players to join
                </Typography>
                <CircularProgress sx={{ my: 4 }} />
              </Box>
            )}

            {gameStatus === "error" && <Alert severity="error">{error}</Alert>}

            {challenge?.rematchRequested && (
              <>
                <Typography
                  component="p"
                  variant="h6"
                  color="primary.light"
                  sx={{ m: 3 }}
                >
                  Rematch request pending
                </Typography>
                <CircularProgress sx={{ mb: 4 }} />
              </>
            )}
          </>
        ) : (
          <Box sx={{ my: 5 }}>
            <CircularProgress />
          </Box>
        )}

        <Stack
          spacing={2}
          sx={{ justifyContent: "center", alignItems: "center" }}
          direction="row"
        >
          {gameStatus === "finished" && players && (
            <RematchButton
              onClick={onClickRematch}
              disabled={rematch || players?.length === 1}
              pulsing={isAcceptRematch}
            />
          )}
          <Button
            variant="outlined"
            color="error"
            aria-label="leave"
            onClick={onClickLeave}
            endIcon={<ExitToAppIcon />}
          >
            {challenge?.id ? "Leave" : "Return"}
          </Button>
        </Stack>
      </Container>
    </>
  )
}

interface Props {
  user?: User | null
  challenge: any
  players?: any[]
  onClickLeave: () => void
  onClickRematch: () => void
  rematch: boolean
  error?: string
}
