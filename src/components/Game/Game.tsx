import React, { useEffect, useMemo, useState } from "react";
import "react-h5-audio-player/lib/styles.css";
import { Waveform } from "../../molecules/Waveform/Waveform";
import files from "../../data/files.json";
import _ from "lodash";
import { Alert, Button, Container, Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Language } from "../../types/language";
import {
  allLangs,
  getEval,
  getLanguageCountries,
  getLanguageInfo,
  getLevelLabel,
  getRandomFromSeed,
} from "../../utils/helpers";
import { WorldDiagram } from "../../icons/worldDiagram";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { challengeSelector, setChallenge } from "../../store/challengeSlice";
import firebase from "../../config";
import { userSelector } from "../../store/userSlice";

export const Game = () => {
  let { gameId } = useParams();

  const [lang, setLang] = useState<any>();
  const [langInfo, setLangInfo] = useState<any>();
  const [answer, setAnswer] = useState<any>();
  const [choices, setChoices] = useState<any[]>();

  const [players, setPlayers] = useState<any[]>();

  const [score, setScore] = useState(0);
  const [turn, setTurn] = useState(1);
  const challenge = useSelector(challengeSelector);
  const user = useSelector(userSelector);

  const dispatch = useDispatch();

  const maxLevelTurn = 10;
  const maxLevels = 5;

  const levelLangs = useMemo(
    () =>
      allLangs.slice(
        0,
        (challenge?.level || 0) * (allLangs.length / maxLevels)
      ),
    [challenge]
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

  const langCountries = useMemo<string[]>(
    () => (lang ? getLanguageCountries(lang).map((c) => c.Country) : []),
    [lang]
  );

  useEffect(() => {
    let subscribe: any;
    let subscribePlayers: any;
    if (gameId) {
      subscribe = firebase
        .firestore()
        .collection("challenges")
        .doc(gameId)
        .onSnapshot((querySnapshot: any) => {
          if (!querySnapshot.exists) {
            return;
          }
          const challengeData = querySnapshot.data();
          dispatch(setChallenge({ id: gameId, ...challengeData }));
          subscribePlayers = firebase
            .firestore()
            .collection(`challenges/${gameId}/players`)
            .onSnapshot((querySnapshot: any) => {
              let playersArr: any[] = [];
              querySnapshot.forEach((doc: any) => {
                playersArr.push({ id: doc.id, ...doc.data() });
              });
              setPlayers(playersArr);
            });
        });
    } else {
    }
    return () => {
      if (subscribe) {
        subscribe();
      }
      if (subscribePlayers) {
        subscribePlayers();
      }
    };
  }, [gameId]);

  useEffect(() => {
    if (!challenge) return;
    if (lang) return;
    if (challenge.id && challenge.seed) {
      const random = Math.floor(
        getRandomFromSeed((challenge.seed || 0) + turn) * levelLangs.length
      );
      const randomLang = levelLangs[random];
      setLang(randomLang);
    } else {
      const randomLang = _.sample(levelLangs);
      setLang(randomLang);
    }
  }, [lang, challenge]);

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

  useEffect(() => {
    console.log(challenge);

    if (!gameId || !challenge || !challenge.id || !user || !user.uid) return;
    firebase
      .firestore()
      .collection(`challenges/${gameId}/players`)
      .doc(user.uid)
      .set({
        displayName: user.displayName,
        joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
        score,
        turn,
      });
    console.log("writing data");
  }, [user, turn, score, challenge]);

  const onClickNext = () => {
    setLang(null);
    setChoices([]);
    setAnswer(null);
    setTurn((l) => l + 1);
  };

  const displayGame = !gameId || (players && players?.length > 1);
  const waitingForPlayers = gameId && (!players || players?.length < 2);

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
        {players &&
          players.length > 1 &&
          players.map((p, i) => (
            <Typography
              component="span"
              variant="subtitle1"
              color="text.secondary"
              sx={{ m: 3 }}
            >
              {p.displayName}: {p.score}
            </Typography>
          ))}
        {displayGame && (
          <>
            <Typography
              component="p"
              variant="subtitle1"
              color="primary"
              sx={{ m: 3 }}
            >
              Level: {getLevelLabel(challenge?.level || 0)}
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
          </>
        )}
        {waitingForPlayers &&
          (challenge && challenge.id ? (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h5" color="primary.light">
                Waiting for players to join
              </Typography>
            </Box>
          ) : (
            <Typography component="p" variant="h5" color="error" sx={{ m: 3 }}>
              Invalid game link
            </Typography>
          ))}
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
                  Done! you {getEval(score, turn)}
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
            {langCountries && (
              <Box sx={{ my: 2 }}>
                <WorldDiagram
                  highlights={langCountries}
                  style={{ width: "100%", height: 400 }}
                />
              </Box>
            )}
            {langInfo && (
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
