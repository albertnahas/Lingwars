import React, { useEffect, useMemo, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Waveform } from "../molecules/Waveform/Waveform";
import langauges from "../data/languages.json";
import files from "../data/files.json";
import _ from "lodash";
import { Alert, Button, Container, Typography } from "@mui/material";

export const Game = () => {
  const [lang, setLang] = useState<any>();
  const [answer, setAnswer] = useState<any>();
  const [choices, setChoices] = useState<any[]>();

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

  useEffect(() => {}, [answer]);

  const onClickNext = () => {
    setLang(null);
    setChoices([]);
    setAnswer(null);
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
        <Waveform url={new URL(langUrl, import.meta.url).href} />
        {choices &&
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
            <Button variant="contained" sx={{ mt: 1 }} onClick={onClickNext}>
              Next
            </Button>
          </>
        )}
      </Container>
    </>
  );
};
