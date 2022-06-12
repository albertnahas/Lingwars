import React, { FC, useCallback, useEffect, useMemo, useState } from "react"
import { Waveform } from "../../molecules/Waveform/Waveform"
import files from "../../data/files.json"
import _ from "lodash"
import { Alert, Button, Container, Paper, Typography } from "@mui/material"
import { Box, styled } from "@mui/system"
import { getLanguageCountries, getLanguageInfo } from "../../utils/helpers"
import { WorldDiagram } from "../../icons/worldDiagram"
import { Timer } from "../../atoms/Timer/Timer"
import { LanguageInfo } from "../../molecules/LanguageInfo/LanguageInfo"
import { HintButton } from "../../atoms/HintButton/HintButton"
import { maxHints, roundTimeout } from "../../utils/constants"

export const BoxContainer = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const RoundContainer = styled(Paper)(
  ({ theme }) => `
  padding: ${theme.spacing(3)};
  border-radius: 10px;
`
)

export const Round: FC<Props> = ({ lang, choices, onAnswer, hintsLeft }) => {
  const [langInfo, setLangInfo] = useState<any>()
  const [showInfo, setShowInfo] = useState<boolean>(false)
  const [showHint, setShowHint] = useState<boolean>(false)
  const [answer, setAnswer] = useState<any>()
  const [time, setTime] = useState(0)
  const [active, setActive] = useState<boolean>(false)

  const langUrl = useMemo<string>(
    () =>
      lang
        ? `../data/audio/${_.sample(
            files.filter((f) => f.split("/")[0] === lang.name)
          )}`
        : "",
    [lang]
  )

  const langCountries = useMemo<string[]>(
    () => (lang ? getLanguageCountries(lang).map((c) => c.Country) : []),
    [lang]
  )

  const hint = useMemo<string>(() => {
    if (!langInfo) return ""

    const split = langInfo.extract.split(".")
    return split.length > 0 ? `${split[1].replaceAll(lang.name, "***")}.` : ""
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [langInfo])

  useEffect(() => {
    if (!lang) return

    getLanguageInfo(lang)
      .then((res) => res.json())
      .then((res) => {
        for (const page in res.query.pages) {
          setLangInfo(res.query.pages[page])
        }
      })
  }, [lang])

  useEffect(() => {
    if (!answer) return
    onAnswer(answer, time, showHint)
    setShowHint(false)
    setActive(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer])

  const onTimerChange = useCallback((t: number) => {
    setTime(t)
    if (t === roundTimeout) {
      setActive(false)
      setAnswer(" ")
    }
  }, [])

  const onActive = () => {
    setActive(true)
  }

  const hintsText = `${hintsLeft - 1 !== 0 ? hintsLeft - 1 : "no"} ${
    hintsLeft - 1 === 1 ? "hint" : "hints"
  }`

  const renderChoices = () =>
    choices?.map(
      (c) =>
        c && (
          <Button
            key={c.name}
            variant="outlined"
            aria-label={`${c}-choice`}
            sx={{ m: 1 }}
            onClick={() => setAnswer(c)}
          >
            {c.name}
          </Button>
        )
    )

  const timeColor =
    time >= 25
      ? "error.light"
      : time >= 20
      ? "warning.light"
      : "secondary.light"

  return (
    <Container sx={{ p: 2 }} aria-label="round container">
      <RoundContainer elevation={24}>
        <Box sx={{ mb: 2 }}>
          {time !== roundTimeout && (
            <Typography
              color={timeColor}
              variant="h2"
              sx={{ textAlign: "center" }}
            >
              <Timer onTimeChange={onTimerChange} active={active} />
            </Typography>
          )}
          {time === roundTimeout && (
            <Typography
              color="error.light"
              variant="h6"
              sx={{ textAlign: "center" }}
            >
              Oooops... The time is up!
            </Typography>
          )}
          <Typography
            color="secondary.light"
            variant="body2"
            sx={{ textAlign: "center" }}
          >
            {/* round maximum score: {Math.round(100 / (time || 1))} */}
          </Typography>
        </Box>
        <BoxContainer>
          <Waveform url={langUrl} onActive={onActive} />
          {!answer && active && (
            <HintButton
              disabled={hintsLeft === 0 || showHint}
              onClick={() => setShowHint(true)}
              hintsLeft={hintsLeft}
            />
          )}
        </BoxContainer>
        {choices && !answer && (
          <Box aria-label="choices">{renderChoices()}</Box>
        )}
        {langInfo && showHint && (
          <Alert sx={{ mt: 2, textAlign: "left" }} severity="info">
            <Typography sx={{ mb: 1 }} variant="body2">
              {hint}
            </Typography>
            <Typography
              sx={{ fontWeight: 500 }}
              color="primary.light"
              variant="caption"
            >
              Using hints is limited to {maxHints} per game and deducts your
              round score by half. You have {hintsText} available.
            </Typography>
          </Alert>
        )}

        {answer && (
          <>
            <Alert
              severity={answer.code1 === lang.code1 ? "success" : "error"}
              aria-label="result"
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => setShowInfo((si) => !si)}
                >
                  Learn more
                </Button>
              }
            >
              {lang.name}
            </Alert>
            {langCountries && showInfo && (
              <Box sx={{ my: 2 }}>
                <WorldDiagram
                  highlights={langCountries}
                  style={{ width: "100%", height: 400 }}
                />
              </Box>
            )}
            {langInfo && showInfo && (
              <LanguageInfo name={langInfo.title} info={langInfo.extract} />
            )}
          </>
        )}
      </RoundContainer>
    </Container>
  )
}

interface Props {
  lang: any
  choices?: any[]
  onAnswer: (answer: any, time?: number, showHint?: boolean) => void
  hintsLeft: number
}
