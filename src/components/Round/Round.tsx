import React, { FC, useEffect, useMemo, useState } from "react"
import { Waveform } from "../../molecules/Waveform/Waveform"
import files from "../../data/files.json"
import _ from "lodash"
import { Alert, Button, Container, Typography } from "@mui/material"
import { Box, styled } from "@mui/system"
import { getLanguageCountries, getLanguageInfo } from "../../utils/helpers"
import { WorldDiagram } from "../../icons/worldDiagram"
import { Timer } from "../../atoms/Timer/Timer"
import { LanguageInfo } from "../../molecules/LanguageInfo/LanguageInfo"
import { HintButton } from "../../atoms/HintButton/HintButton"

export const BoxContainer = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

export const Round: FC<Props> = ({ lang, choices, onAnswer }) => {
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
    onAnswer(answer, time)
    setShowHint(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer])

  const onTimerChange = (t: number) => {
    setTime(t)
  }

  const onActive = () => {
    setActive(true)
  }

  return (
    <Container>
      <Box sx={{ mb: 2 }}>
        <Typography
          color="secondary.light"
          variant="h2"
          sx={{ textAlign: "center" }}
        >
          <Timer onTimeChange={onTimerChange} active={active} />
        </Typography>
        <Typography
          color="secondary.light"
          variant="body2"
          sx={{ textAlign: "center" }}
        >
          {/* round score: {Math.round(100 / (time || 1))} */}
        </Typography>
      </Box>
      <BoxContainer>
        <Waveform url={langUrl} onActive={onActive} />
        {!answer && active && (
          <HintButton disabled={showHint} onClick={() => setShowHint(true)} />
        )}
      </BoxContainer>
      {choices &&
        !answer &&
        choices?.map(
          (c) =>
            c && (
              <Button
                key={c.name}
                variant="outlined"
                sx={{ m: 1 }}
                onClick={() => setAnswer(c)}
              >
                {c.name}
              </Button>
            )
        )}
      {langInfo && showHint && (
        <Alert sx={{ mt: 2 }} severity="info">
          {hint}
        </Alert>
      )}
      {answer && (
        <>
          <Alert
            severity={answer.code1 === lang.code1 ? "success" : "error"}
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
    </Container>
  )
}

interface Props {
  lang: any
  choices?: any[]
  onAnswer: (answer: any, time?: number) => void
}
