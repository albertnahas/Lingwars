import { FC, useMemo } from "react";
// import "react-h5-audio-player/lib/styles.css";
import _ from "lodash";
import {
  Alert,
  Avatar,
  Button,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { getEval } from "../../utils/helpers";
import { Round } from "../Round/Round";
import { Player, Score } from "../../types/challenge";
import { User } from "../../types/user";
import { UserCircle as UserCircleIcon } from "../../icons/user-circle";
import { PlayerChip } from "./partials/PlayerChip";

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
  onAnswer,
  error,
}) => {
  const maxScore = useMemo(() => {
    if (!players || players.length < 2) return user?.displayName;
    const mappedPlayers = players?.map((p: Player) => {
      return { displayName: p?.displayName, score: p?.score?.timed };
    });
    return _.maxBy(mappedPlayers, "score")?.displayName;
  }, [players]);

  const isGameDone = useMemo(
    () =>
      players &&
      challenge &&
      challenge.id &&
      players.every((p) => p.turn >= (challenge.rounds || 10)),
    [players, challenge]
  );

  const displayGame = !error && (!challenge || !challenge.id || challenge.full);

  const waitingForPlayers = challenge && challenge.id && !challenge.full;

  const renderPlayers = () => (
    <Stack
      direction="row"
      sx={{ justifyContent: "center", flexWrap: "wrap", gap: 2 }}
    >
      {players?.map((p, i) => (
        <PlayerChip player={p} key={i} isWinning={maxScore === p.displayName} />
      ))}
    </Stack>
  );

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

        {players && isGameDone && (
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
        {displayGame && players && renderPlayers()}

        {lang && displayGame && !isGameDone && (
          <Box sx={{ my: 2 }}>
            <Round lang={lang} choices={choices} onAnswer={onAnswer} />
            <Divider sx={{ my: 3 }} />
          </Box>
        )}
        {waitingForPlayers && challenge && challenge.id && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h5" color="primary.light">
              Waiting for players to join
            </Typography>
          </Box>
        )}
        {!!error && <Alert severity="error">{error}</Alert>}

        {showAnswer && (
          <>
            {turn < (challenge.rounds || 10) && (
              <Button variant="contained" sx={{ mt: 1 }} onClick={onClickNext}>
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
          </>
        )}
      </Container>
    </>
  );
};

interface Props {
  score: Score;
  turn: number;
  user?: User | null;
  challenge: any;
  players?: any[];
  onClickNext: () => void;
  showAnswer: boolean;
  lang: any;
  choices?: any[];
  onAnswer: (answer: any) => void;
  error?: string;
}
