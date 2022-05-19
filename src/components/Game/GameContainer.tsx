import { useEffect, useMemo, useState } from "react";
import _ from "lodash";
import { allLangs, getRandomFromSeed } from "../../utils/helpers";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { challengeSelector } from "../../store/challengeSlice";
import { userSelector } from "../../store/userSlice";
import { Game } from "./Game";
import { useChallenge } from "../../hooks/useChallenge";
import { maxLevels } from "../../utils/constants";
import { Score } from "../../types/challenge";

export const GameContainer = () => {
  let { gameId } = useParams();

  const [lang, setLang] = useState<any>();
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [choices, setChoices] = useState<any[]>();

  const [score, setScore] = useState<Score>({ accuracy: 0, timed: 0 });
  const [turn, setTurn] = useState(1);
  const { players, writeScore, error } = useChallenge(gameId);

  const user = useSelector(userSelector);
  const challenge = useSelector(challengeSelector);

  const levelLangs = useMemo(
    () =>
      allLangs.slice(
        0,
        (challenge?.level || 0) * (allLangs.length / maxLevels)
      ),
    [challenge]
  );

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, challenge]);

  //   useEffect(() => {
  //     if (players && players.length) {
  //       const currentPlayer = players.find((p) => p.id === user?.uid);
  //       if (currentPlayer.turn !== turn) {
  //         setTurn(currentPlayer.turn);
  //       }
  //       if (currentPlayer.score !== score) {
  //         setTurn(currentPlayer.score);
  //       }
  //     }
  //   }, [players]);

  useEffect(() => {
    if (!lang) return;
    let langChoices = _.sampleSize(levelLangs, 4);
    while (langChoices.find((l) => l?.code1 === lang.code1)) {
      langChoices = _.sampleSize(levelLangs, 4);
    }
    langChoices.push(lang);
    setChoices(_.shuffle(langChoices));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const onAnswer = (answer: any, time?: number) => {
    if (answer && answer.code1 === lang.code1) {
      const timeScore = Math.round((10 * 10) / (time || 10));
      setScore((s) => {
        return {
          accuracy: s.accuracy + 1,
          timed: s.timed + timeScore,
        };
      });
    }
    setShowAnswer(true);
  };

  useEffect(() => {
    if (!gameId || !challenge || !challenge.id || !user || !user.uid) return;
    writeScore(score, turn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, turn, score, challenge]);

  const onClickNext = () => {
    setLang(null);
    setChoices([]);
    setShowAnswer(false);
    setTurn((l) => l + 1);
  };

  return (
    <Game
      score={score}
      turn={turn}
      user={user}
      challenge={challenge}
      players={players}
      showAnswer={showAnswer}
      lang={lang}
      choices={choices}
      onClickNext={onClickNext}
      onAnswer={onAnswer}
      error={error}
    />
  );
};
