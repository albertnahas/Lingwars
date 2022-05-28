import { FC, useMemo } from "react"

import _ from "lodash"
import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material"
import { Box } from "@mui/system"
import { getEval } from "../../utils/helpers"
import { Round } from "../Round/Round"
import { Player } from "../../types/challenge"
import { User } from "../../types/user"
import { PlayerChip } from "../../molecules/PlayerChip/PlayerChip"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import RepeatIcon from "@mui/icons-material/Repeat"
import { keyframes } from "@emotion/react"

const pulse = keyframes`
	0% {
		transform: scale(0.95);
		box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.3);
	}

	70% {
		transform: scale(1);
		box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
	}

	100% {
		transform: scale(0.95);
		box-shadow: 0 0 0 0 rgba(0, 0, 255, 0);
	}
  `

export type GameStatus =
  | "loading"
  | "error"
  | "waiting"
  | "started"
  | "finished"

export const Game: FC<Props> = ({
  timedScore,
  accuracy,
  turn,
  user,
  challenge,
  players,
  showAnswer,
  lang,
  choices,
  onClickNext,
  onClickLeave,
  onClickRematch,
  rematch,
  onAnswer,
  error,
  hintsLeft,
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
      players &&
      challenge &&
      challenge.id &&
      players.every((p) => p.turn >= (challenge.rounds || 10)),
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

            {lang && ["started", "finished"].includes(gameStatus) && (
              <Box sx={{ my: 2 }}>
                <Round
                  lang={lang}
                  choices={choices}
                  onAnswer={onAnswer}
                  hintsLeft={hintsLeft}
                />
                <Divider sx={{ my: 3 }} />
              </Box>
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

            {showAnswer && (
              <>
                {turn < (challenge.rounds || 10) && (
                  <Button
                    variant="contained"
                    sx={{ mt: 1 }}
                    onClick={onClickNext}
                    aria-label="next"
                  >
                    Next
                  </Button>
                )}
                {turn >= (challenge.rounds || 10) && (
                  <Box aria-label="done message" sx={{ mt: 2 }}>
                    <Typography variant="h6" color="primary.light">
                      Done! you {getEval(accuracy, turn)}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ mt: 2 }}>
                  {!!accuracy && (
                    <Typography variant="body1">
                      Your score: {accuracy}/{turn}
                    </Typography>
                  )}
                </Box>
                <Divider sx={{ my: 3 }} />
              </>
            )}
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
            <Button
              variant="outlined"
              color="info"
              aria-label="rematch"
              onClick={onClickRematch}
              endIcon={<RepeatIcon />}
              disabled={rematch || players?.length === 1}
              sx={{
                m: 3,
                animation: isAcceptRematch
                  ? `${pulse} 1000ms infinite ease;`
                  : "",
                animationDirection: "alternate",
              }}
            >
              {isAcceptRematch ? "Accept rematch" : "Rematch"}
            </Button>
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
  timedScore: number
  accuracy: number
  turn: number
  user?: User | null
  challenge: any
  players?: any[]
  onClickNext: () => void
  onClickLeave: () => void
  onClickRematch: () => void
  rematch: boolean
  showAnswer: boolean
  lang: any
  choices?: any[]
  onAnswer: (answer: any) => void
  error?: string
  hintsLeft: number
}
