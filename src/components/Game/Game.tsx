import React, { useEffect, useMemo, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Waveform } from "../../molecules/Waveform/Waveform";
import langauges from "../../data/languages.json";
import files from "../../data/files.json";
import _, { kebabCase } from "lodash";
import { Alert, Button, Container, Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Language } from "../../types/language";
import { getLevelLabel } from "../../utils/helpers";
import { LevelDialog } from "../../molecules/LevelDialog/LevelDialog";

export const Game = () => {
  const [lang, setLang] = useState<any>();
  const [answer, setAnswer] = useState<any>();
  const [choices, setChoices] = useState<any[]>();
  const [openLevelsDialog, setOpenLevelsDialog] = React.useState(true);

  const [score, setScore] = useState(0);
  const [turn, setTurn] = useState(1);
  const [level, setLevel] = useState();

  const maxLevelTurn = 10;
  const maxLevels = 5;

  const allLangs = _.sortBy(
    Array.from(new Set(files.map((f) => f.split("/")[0])))
      .map((l) => l.replace("_", " "))
      .map((l) =>
        langauges.find(
          (lan) => lan["all names"].split(";").filter((n) => n === l).length
        )
      ),
    "rank"
  );

  console.log(langauges.length);
  console.log(
    langauges.filter(
      (l) => l?.rank && !allLangs.find((al) => al?.code1 === l.code1)
    )
  );
  console.log(allLangs.length);
  console.log(allLangs.filter((l) => l?.rank).length);

  const levelLangs = useMemo(
    () => allLangs.slice(0, level * (allLangs.length / maxLevels)),
    [level]
  );

  const langUrl = useMemo<string>(
    () =>
      lang
        ? `../data/audio/${_.sample(
            files.filter((f) => f.split("/")[0] === lang.name)
          )}`
        : "",
    [lang]
  );

  useEffect(() => {
    if (!level) return;
    if (lang) return;
    const randomLang = _.sample(levelLangs);
    setLang(randomLang);
  }, [lang, level]);

  useEffect(() => {
    if (!lang) return;
    let langChoices = _.sampleSize(levelLangs, 4);
    while (langChoices.find((l) => l?.code1 === lang.code1)) {
      langChoices = _.sampleSize(levelLangs, 4);
    }
    langChoices.push(lang);
    setChoices(_.shuffle(langChoices));
  }, [lang]);

  useEffect(() => {
    if (!answer) return;
    if (answer.code1 === lang.code1) {
      setScore((s) => s + 1);
    }
  }, [answer]);

  const onClickNext = () => {
    setLang(null);
    setChoices([]);
    setAnswer(null);
    setTurn((l) => l + 1);
  };

  const onSelectLevel = (l: number) => {
    setLevel(l);
    setOpenLevelsDialog(false);
  };

  const getEval = () => {
    switch (true) {
      case score / turn < 0.4:
        return "still have a lot to learn";
      case score / turn < 0.6:
        return "have a good knowledge!";
      case score / turn < 0.8:
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
        <Typography
          component="p"
          variant="subtitle1"
          color="primary"
          sx={{ m: 3 }}
        >
          Level: {getLevelLabel(level)}
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
        <Divider sx={{ my: 3 }} />

        {answer && (
          <>
            <Alert severity={answer.code1 === lang.code1 ? "success" : "error"}>
              {lang.name}
            </Alert>
            {turn < maxLevelTurn && (
              <Button variant="contained" sx={{ mt: 1 }} onClick={onClickNext}>
                Next
              </Button>
            )}
            {turn >= maxLevelTurn && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" color="primary.light">
                  Done! you {getEval()}
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              {!!score && (
                <Typography variant="body1">
                  Your score: {score}/{turn}
                </Typography>
              )}
            </Box>
          </>
        )}
        <LevelDialog
          selectedValue={level}
          open={openLevelsDialog}
          onClose={onSelectLevel}
        />
      </Container>
    </>
  );
};
