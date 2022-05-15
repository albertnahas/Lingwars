import React, { FC, useEffect, useMemo, useState } from "react";
import "react-h5-audio-player/lib/styles.css";
import { Waveform } from "../../molecules/Waveform/Waveform";
import files from "../../data/files.json";
import _ from "lodash";
import { Alert, Button, Container, Divider, IconButton, Tooltip, Typography } from "@mui/material";
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { Box } from "@mui/system";
import { Language } from "../../types/language";
import { getLanguageCountries, getLanguageInfo } from "../../utils/helpers";
import { WorldDiagram } from "../../icons/worldDiagram";
import { Timer } from "../../atoms/Timer/Timer";

export const Round: FC<Props> = ({ lang, choices, onAnswer }) => {
  const [langInfo, setLangInfo] = useState<any>();
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [answer, setAnswer] = useState<any>();
  const [time, setTime] = useState(0);

  const langUrl = useMemo<string>(
    () =>
      lang
        ? `../data/audio/${_.sample(
            files.filter((f) => f.split("/")[0] === lang.name)
          )}`
        : "",
    [lang]
  );

  const langCountries = useMemo<string[]>(
    () => (lang ? getLanguageCountries(lang).map((c) => c.Country) : []),
    [lang]
  );

  useEffect(() => {
    if (!lang) return;
    getLanguageInfo(lang)
      .then((res) => res.json())
      .then((res) => {
        for (const page in res.query.pages) {
          setLangInfo(res.query.pages[page]);
        }
      });
  }, [lang]);

  useEffect(() => {
    if (!answer) return;
    onAnswer(answer, time);
    setShowHint(false);
  }, [answer]);

  const onTimerChange = (t: number) => {
    setTime(t);
  };

  const handleHint = (s: string) => {
    let split = s.split('.');
    return `${split[1].replace(langInfo.title, "this language")}.`;
  }

  return (
    <>
      <Container>
        <Box sx={{ mb: 2 }}>
          <Typography
            color="secondary.light"
            variant="h2"
            sx={{ textAlign: "center" }}
          >
            <Timer onTimeChange={onTimerChange} active={true} />
          </Typography>
          <Typography
            color="secondary.light"
            variant="body2"
            sx={{ textAlign: "center" }}
          >
            {/* round score: {Math.round(100 / (time || 1))} */}
          </Typography>
        </Box>
        <Waveform url={langUrl} />
        {!answer && (
          <Tooltip title="Give me a hint" placement="left" arrow>
            <IconButton onClick={() => setShowHint(sh => !sh)} >
              <TipsAndUpdatesIcon />
            </IconButton>
          </Tooltip>
        )}
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
            {handleHint(langInfo.extract)}
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
              <>
                <Typography variant="h6" sx={{ my: 2, textAlign: "center" }}>
                  {langInfo.title}
                </Typography>
                <Typography variant="body2" sx={{ my: 1 }}>
                  {langInfo.extract}
                </Typography>
              </>
            )}
          </>
        )}
      </Container>
    </>
  );
};

interface Props {
  lang: any;
  choices?: any[];
  onAnswer: (answer: any, time?: number) => void;
}
