import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import _ from "lodash"
import { allLangs, getRandomFromSeed } from "../../utils/helpers"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { challengeSelector } from "../../store/challengeSlice"
import { userSelector } from "../../store/userSlice"
import { Game } from "./Game"
import { useChallenge } from "../../hooks/useChallenge"
import { maxHints, maxLevels } from "../../utils/constants"
import { Score } from "../../types/challenge"

export const GameContainer = () => {
  let { gameId } = useParams()

  const [lang, setLang] = useState<any>()
  const [showAnswer, setShowAnswer] = useState<boolean>(false)
  const [score, setScore] = useState<Score>({ accuracy: 0, timed: 0 })
  const [turn, setTurn] = useState(1)
  const {
    players,
    writeScore,
    error,
    leaveChallenge,
    rematch,
    requestRematch,
    cancelRematch,
  } = useChallenge(gameId)
  const hintsUsed = useRef<number>(0)
  const navigate = useNavigate()

  const user = useSelector(userSelector)
  const challenge = useSelector(challengeSelector)

  const levelLangs = useMemo(
    () =>
      allLangs.slice(
        0,
        (challenge?.level || 0) * (allLangs.length / maxLevels)
      ),
    [challenge]
  )

  const choices = useMemo<any[]>(() => {
    if (!lang) return []
    let langChoices = _.sampleSize(levelLangs, 4)
    while (langChoices.find((l) => l?.code1 === lang.code1)) {
      langChoices = _.sampleSize(levelLangs, 4)
    }
    langChoices.push(lang)
    return _.shuffle(langChoices)
  }, [lang, levelLangs])

  useLayoutEffect(() => {
    if (challenge && !gameId && !challenge?.level) {
      navigate("/")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId, challenge])

  useLayoutEffect(() => {
    if (!challenge) return
    if (lang) return
    if (challenge.id && challenge.seed) {
      const random = Math.floor(
        getRandomFromSeed((challenge.seed || 0) + turn) * levelLangs.length
      )
      const randomLang = levelLangs[random]
      setLang(randomLang)
    } else {
      const randomLang = _.sample(levelLangs)
      setLang(randomLang)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, challenge])

  const onAnswer = (answer: any, time?: number, showHint?: boolean) => {
    if (showHint) hintsUsed.current += 1
    if (answer && answer.code1 === lang.code1) {
      const timeScore = Math.round((10 * 10) / (time || 10))
      const finalScore = showHint ? timeScore / 2 : timeScore
      setScore((s) => {
        return {
          accuracy: s.accuracy + 1,
          timed: s.timed + finalScore,
        }
      })
    }
    setShowAnswer(true)
  }

  useEffect(() => {
    if (!gameId || !challenge || !challenge.id || !user || !user.uid) return

    if (players) {
      const currentPlayer = players.find((p) => p.id === user.uid)
      if (
        currentPlayer &&
        currentPlayer.turn === turn &&
        currentPlayer.score &&
        score &&
        currentPlayer.score.timed === score.timed
      ) {
        return
      }
    }
    writeScore(score, turn, hintsUsed.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, turn, score, challenge])

  const onClickNext = () => {
    setLang(null)
    setShowAnswer(false)
    setTurn((l) => l + 1)
  }

  const onReset = () => {
    setLang(null)
    setShowAnswer(false)
    setTurn(0)
    hintsUsed.current = 0
    setScore({ timed: 0, accuracy: 0 })
  }

  const onClickLeave = () => {
    if (rematch) {
      cancelRematch()
    }
    leaveChallenge()
    navigate("/")
  }
  const onClickRematch = () => {
    requestRematch().then(() => onReset())
  }

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
      onClickLeave={onClickLeave}
      onClickRematch={onClickRematch}
      rematch={rematch}
      onAnswer={onAnswer}
      error={error}
      hintsLeft={maxHints - hintsUsed.current}
    />
  )
}
