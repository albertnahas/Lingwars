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
import { Player, Score } from "../../types/challenge"
import { User } from "../../types/user"
import { PlayerChip } from "../../molecules/PlayerChip/PlayerChip"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"

export type GameStatus =
  | "loading"
  | "error"
  | "waiting"
  | "started"
  | "finished"

export const Game: FC<Props> = ({
  score,
  turn,
  user,
  challenge,
  players,
  showAnswer,
  lang,
  choices,
  onClickNext,
  onClicLeave,
  onAnswer,
  error,
}) => {
  const maxScore = useMemo(() => {
    if (!players || players.length < 2) return user?.displayName
    const mappedPlayers = players?.map((p: Player) => {
      return { displayName: p?.displayName, score: p?.score?.timed }
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
                variant="h5"
                color="success.main"
                sx={{ m: 3 }}
              >
                {maxScore} is the winner!!
              </Typography>
            )}

            {/* render players */}
            {gameStatus === "started" && players && renderPlayers()}

            {lang && gameStatus === "started" && (
              <Box sx={{ my: 2 }}>
                <Round lang={lang} choices={choices} onAnswer={onAnswer} />
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
                  >
                    Next
                  </Button>
                )}
                {turn >= (challenge.rounds || 10) && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" color="primary.light">
                      Done! you {getEval(score.accuracy, turn)}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ mt: 2 }}>
                  {!!score && (
                    <Typography variant="body1">
                      Your score: {score.accuracy}/{turn}
                    </Typography>
                  )}
                </Box>
                <Divider sx={{ my: 3 }} />
              </>
            )}
          </>
        ) : (
          <Box sx={{ my: 5 }}>
            <CircularProgress />
          </Box>
        )}

        <Button
          variant="outlined"
          color="error"
          sx={{ mt: 2 }}
          onClick={onClicLeave}
          endIcon={<ExitToAppIcon />}
        >
          {challenge?.id ? "Leave" : "Return"}
        </Button>
      </Container>
    </>
  )
}

interface Props {
  score: Score
  turn: number
  user?: User | null
  challenge: any
  players?: any[]
  onClickNext: () => void
  onClicLeave: () => void
  showAnswer: boolean
  lang: any
  choices?: any[]
  onAnswer: (answer: any) => void
  error?: string
}
