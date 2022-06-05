import React from "react"
import { Stack } from "@mui/material"
import { styled } from "@mui/system"

const Wrapper = styled("div")(
  ({ theme }) => `
  display: flex;
  padding: 4px 10px;
  border-radius: 16px;
  background-color: ${theme.palette.primary.main};
  color: #fff;
`
)

const InfoText = styled("span")(`
  margin-right: 8px;
  font-size: 14px;
`)

const InfoBadge = styled("span")(
  ({ theme }) => `
  padding: 4px 10px;
  background-color: ${theme.palette.secondary.main};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  border-radius: 16px;
`
)

const ChallengeInfo = (challenge: any) => {
  const details = [
    {
      text: "Players",
      value: challenge?.players,
    },
    {
      text: "Rounds",
      value: challenge?.rounds,
    },
    {
      text: "Game Variation",
      value: challenge?.variation,
    },
  ]

  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 2,
        mb: 2,
      }}
    >
      {details.map((d) => {
        return (
          <Wrapper key={d.text} aria-label={d.text.toLowerCase()}>
            <InfoText>{d.text}</InfoText>
            <InfoBadge>{d.value}</InfoBadge>
          </Wrapper>
        )
      })}
    </Stack>
  )
}

export default ChallengeInfo
