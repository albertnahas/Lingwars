import {
  FC,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useState,
} from "react"
import _ from "lodash"
import {
  allLangs,
  generateLangChoices,
  getRandomFromSeed,
} from "../../../utils/helpers"
import { SpeedGame } from "./SpeedGame"
import { maxHints, maxLevels } from "../../../utils/constants"
import { useSelector } from "react-redux"
import { userSelector } from "../../../store/userSlice"
import { challengeSelector } from "../../../store/challengeSlice"
import { useScores } from "../../../hooks/useScores"
import { Language } from "../../../types/language"

const startingTurn = 1

enum SpeedGameActionType {
  ANSWER = "ANSWER",
  SUBMIT = "SUBMIT",
  NEXT = "NEXT",
}
interface SpeedGameState {
  turn: number
  hintsUsed: number
  timedScore: number
  accuracy: number
  answered: boolean
  submitted: boolean
  correct: boolean
}

const initialGameState: SpeedGameState = {
  turn: startingTurn,
  answered: false,
  submitted: false,
  correct: false,
  timedScore: 0,
  accuracy: 0,
  hintsUsed: 0,
}

type SpeedGameAction =
  | {
      type: SpeedGameActionType.ANSWER
      payload: { isCorrect: boolean; withHint: boolean; time: number }
    }
  | { type: SpeedGameActionType.SUBMIT }
  | { type: SpeedGameActionType.NEXT }

let gameReducer = (
  state: SpeedGameState,
  action: SpeedGameAction
): SpeedGameState => {
  switch (action.type) {
    case SpeedGameActionType.ANSWER:
      return {
        ...state,
        answered: true,
        submitted: false,
        correct: action.payload.isCorrect,
        accuracy: state.accuracy + Number(action.payload.isCorrect),
        hintsUsed: state.hintsUsed + Number(action.payload.withHint),
        timedScore: action.payload.isCorrect
          ? state.timedScore +
            Math.round((10 * 10) / (action.payload.time || 10)) /
              (Number(action.payload.withHint) + 1)
          : state.timedScore,
      }
    case SpeedGameActionType.NEXT:
      return { ...state, turn: state.turn + 1, answered: false, correct: false }
    case SpeedGameActionType.SUBMIT:
      return { ...state, submitted: true }
    default:
      return state
  }
}

export const SpeedGameContainer: FC<Props> = ({ display, players }) => {
  const [lang, setLang] = useState<any>()

  const [
    { turn, hintsUsed, timedScore, accuracy, answered, correct, submitted },
    dispatch,
  ] = useReducer(gameReducer, {
    ...initialGameState,
  })

  const user = useSelector(userSelector)
  const challenge = useSelector(challengeSelector)
  const { writeSpeedScore } = useScores()

  const levelLangs = useMemo<Language[]>(
    () =>
      allLangs.slice(
        0,
        (challenge?.level || 0) * (allLangs.length / maxLevels)
      ),
    [challenge]
  )

  const choices = useMemo<any[]>(() => {
    return generateLangChoices(levelLangs, lang)
  }, [lang, levelLangs])

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
      type: SpeedGameActionType.ANSWER,
      payload: {
        isCorrect: answer && answer.code1 === lang.code1,
        time: time || 1,
        withHint: showHint || false,
      },
    })
  }

  useEffect(() => {
    if (
      !challenge ||
      !challenge.id ||
      !user ||
      (!answered && turn !== startingTurn) ||
      submitted
    ) {
      return
    }

    const next =
      correct ||
      (challenge.roundAnswers &&
        challenge.roundAnswers === (players?.length || 1) - 1) ||
      false
    writeSpeedScore(timedScore, accuracy, next, answered, hintsUsed).then(
      () => {
        // console.log("written")
      }
    )
    dispatch({
      type: SpeedGameActionType.SUBMIT,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    user,
    turn,
    answered,
    correct,
    submitted,
    timedScore,
    accuracy,
    challenge,
  ])

  useEffect(() => {
    if (challenge?.turn && challenge?.turn > turn) {
      handleNext()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge?.turn])

  const handleNext = () => {
    setLang(null)
    dispatch({
      type: SpeedGameActionType.NEXT,
    })
  }

  return display ? (
    <SpeedGame
      accuracy={accuracy}
      turn={turn}
      user={user}
      challenge={challenge}
      showAnswer={answered}
      lang={lang}
      choices={choices}
      onAnswer={onAnswer}
      hintsLeft={maxHints - hintsUsed}
    />
  ) : (
    <></>
  )
}
interface Props {
  display?: boolean
  players?: any[]
}
