import React, { useEffect, useMemo, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Waveform } from "../molecules/Waveform/Waveform";
import langauges from "../data/languages.json";
import files from "../data/files.json";
import _ from "lodash";
import { Alert, Button, Container, Typography } from "@mui/material";
import { Box } from "@mui/system";

export const Game = () => {
  const [lang, setLang] = useState<any>();
  const [answer, setAnswer] = useState<any>();
  const [choices, setChoices] = useState<any[]>();

  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);

  const maxLevel = 10;

  const langUrl = useMemo<string>(
    () =>
      lang
        ? `../data/audio/${_.sample(
            files.filter((f) => f.split("/")[0] === lang.name)
          )}`
        : "",
    [lang]
  );

  const availableLanguages = Array.from(
    new Set(files.map((f) => f.split("/")[0]))
  )
    .map((l) => l.replace("_", " "))
    .map((l) => langauges.find((lan) => lan.name === l));

  useEffect(() => {
    if (lang) return;
    const randomLang = _.sample(availableLanguages);
    setLang(randomLang);
  }, [lang]);

  useEffect(() => {
    const langChoices = _.sampleSize(availableLanguages, 4);
    langChoices.push(lang);
    setChoices(_.shuffle(langChoices));
  }, [lang]);

  useEffect(() => {
    if (!answer) return;
    if (answer.name === lang.name) {
      setScore((s) => s + 1);
    }
  }, [answer]);

  const onClickNext = () => {
    setLang(null);
    setChoices([]);
    setAnswer(null);
    setLevel((l) => l + 1);
  };

  const getEval = () => {
    switch (true) {
      case score < 4:
        return "still have a lot to learn";
      case score < 6:
        return "have a good knowledge!";
      case score < 8:
        return "are a polyglot!!";
      default:
        return "are unstoppable!!!";
    }
  };

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
        <Waveform url={langUrl} />
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
        {answer && (
          <>
            <Alert severity={answer.name === lang.name ? "success" : "error"}>
              {lang.name}
            </Alert>
            {level < maxLevel && (
              <Button variant="contained" sx={{ mt: 1 }} onClick={onClickNext}>
                Next
              </Button>
            )}
            {level >= maxLevel && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" color="primary.light">Done! you {getEval()}</Typography>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              {!!score && (
                <Typography variant="body1">
                  Your score: {score}/{level}
                </Typography>
              )}
            </Box>
          </>
        )}
      </Container>
    </>
  );
};
