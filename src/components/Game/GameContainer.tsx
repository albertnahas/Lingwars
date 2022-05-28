import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useState,
} from "react"
import _ from "lodash"
import { allLangs, getRandomFromSeed } from "../../utils/helpers"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { challengeSelector } from "../../store/challengeSlice"
import { userSelector } from "../../store/userSlice"
import { Game } from "./Game"
import { useChallenge } from "../../hooks/useChallenge"
import { maxHints, maxLevels } from "../../utils/constants"

enum GameActionType {
  ANSWER = "ANSWER",
  NEXT = "NEXT",
  RESET = "RESET",
}
interface GameState {
  turn: number
  hintsUsed: number
  timedScore: number
  accuracy: number
  answered: boolean
}

type GameAction =
  | {
      type: GameActionType.ANSWER
      payload: { isCorrect: boolean; withHint: boolean; time: number }
    }
  | { type: GameActionType.NEXT }
  | { type: GameActionType.RESET }

let gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case GameActionType.ANSWER:
      return {
        ...state,
        answered: true,
        accuracy: state.accuracy + Number(action.payload.isCorrect),
        hintsUsed: state.hintsUsed + Number(action.payload.withHint),
        timedScore: action.payload.isCorrect
          ? state.timedScore +
            Math.round((10 * 10) / (action.payload.time || 10)) /
              (Number(action.payload.withHint) + 1)
          : state.timedScore,
      }
    case GameActionType.NEXT:
      return { ...state, turn: state.turn + 1, answered: false }
    case GameActionType.RESET:
      return {
        ...state,
        turn: 1,
        answered: false,
        timedScore: 0,
        accuracy: 0,
        hintsUsed: 0,
      }
    default:
      return state
  }
}

export const GameContainer = () => {
  let { gameId } = useParams()

  const [lang, setLang] = useState<any>()

  const [{ turn, hintsUsed, timedScore, accuracy, answered }, dispatch] =
    useReducer(gameReducer, {
      turn: 1,
      hintsUsed: 0,
      timedScore: 0,
      accuracy: 0,
      answered: false,
    })

  const {
    players,
    writeScore,
    error,
    leaveChallenge,
    rematch,
    requestRematch,
    cancelRematch,
  } = useChallenge(gameId)

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
    dispatch({
      type: GameActionType.ANSWER,
      payload: {
        isCorrect: answer && answer.code1 === lang.code1,
        time: time || 1,
        withHint: showHint || false,
      },
    })
  }

  useEffect(() => {
    if (!gameId || !challenge || !challenge.id || !user || !user.uid) return
    if (!answered && turn !== 1) return
    if (players) {
      const currentPlayer = players.find((p) => p.id === user.uid)
      if (
        currentPlayer &&
        currentPlayer.turn === turn &&
        currentPlayer.timedScore === timedScore &&
        currentPlayer.accuracy === accuracy
      ) {
        return
      }
    }
    writeScore(timedScore, accuracy, turn, hintsUsed)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, turn, answered, timedScore, accuracy, challenge])

  const onClickNext = () => {
    setLang(null)
    dispatch({
      type: GameActionType.NEXT,
    })
  }

  const onReset = () => {
    setLang(null)
    dispatch({
      type: GameActionType.RESET,
    })
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
      accuracy={accuracy}
      timedScore={timedScore}
      turn={turn}
      user={user}
      challenge={challenge}
      players={players}
      showAnswer={answered}
      lang={lang}
      choices={choices}
      onClickNext={onClickNext}
      onClickLeave={onClickLeave}
      onClickRematch={onClickRematch}
      rematch={rematch}
      onAnswer={onAnswer}
      error={error}
      hintsLeft={maxHints - hintsUsed}
    />
  )
}
