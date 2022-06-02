import { FC } from "react"

import { Button, Divider, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { getEval } from "../../../utils/helpers"
import { Round } from "../../Round/Round"
import { User } from "../../../types/user"
import { Challenge } from "../../../types/challenge"

export type StandardGameStatus =
  | "loading"
  | "error"
  | "waiting"
  | "started"
  | "finished"

export const StandardGame: FC<Props> = ({
  accuracy,
  turn,
  challenge,
  showAnswer,
  lang,
  choices,
  onClickNext,
  onAnswer,
  hintsLeft,
}) => {
  return (
    <>
      {lang && (
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

      {showAnswer && (
        <>
          {turn < (challenge?.rounds || 10) && (
            <Button
              variant="contained"
              sx={{ mt: 1 }}
              onClick={onClickNext}
              aria-label="next"
            >
              Next
            </Button>
          )}
          {turn >= (challenge?.rounds || 10) && (
            <Box aria-label="done message" sx={{ mt: 2 }}>
              <Typography variant="h6" color="primary.light">
                Done! you {getEval(accuracy, turn)}
              </Typography>
            </Box>
          )}

          <Box sx={{ mt: 2 }}>
            {!!accuracy && (
              <>
                <Typography variant="body1">
                  Your score: {accuracy}/{turn}
                </Typography>
                <Divider sx={{ my: 3 }} />
              </>
            )}
          </Box>
        </>
      )}
    </>
  )
}

interface Props {
  accuracy: number
  turn: number
  user?: User | null
  challenge?: Challenge | null
  onClickNext: () => void
  showAnswer: boolean
  lang: any
  choices?: any[]
  onAnswer: (answer: any) => void
  hintsLeft: number
}
