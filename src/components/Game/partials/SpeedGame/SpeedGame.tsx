import { FC } from "react"

import { Divider, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { getEval } from "../../../../utils/helpers"
import { Round } from "../../../Round/Round"
import { User } from "../../../../types/user"
import { Challenge } from "../../../../types/challenge"

export const SpeedGame: FC<Props> = ({
  accuracy,
  turn,
  challenge,
  showAnswer,
  lang,
  choices,
  onAnswer,
  hintsLeft,
}) => {
  return (
    <>
      {lang && challenge?.status !== "finished" && (
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
  showAnswer: boolean
  lang: any
  choices?: any[]
  onAnswer: (answer: any) => void
  hintsLeft: number
}
