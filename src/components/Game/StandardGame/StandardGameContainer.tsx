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
import { StandardGame } from "./StandardGame"
import { maxHints, maxLevels } from "../../../utils/constants"
import { useSelector } from "react-redux"
import { userSelector } from "../../../store/userSlice"
import { challengeSelector } from "../../../store/challengeSlice"
import { useScores } from "../../../hooks/useScores"
import { Language } from "../../../types/language"

const startingTurn = 1

enum StandardGameActionType {
  ANSWER = "ANSWER",
  SUBMIT = "SUBMIT",
  NEXT = "NEXT",
}
interface StandardGameState {
  turn: number
  hintsUsed: number
  timedScore: number
  accuracy: number
  answered: boolean
  submitted: boolean
  correct: boolean
}

const initialGameState: StandardGameState = {
  turn: startingTurn,
  answered: false,
  submitted: false,
  correct: false,
  timedScore: 0,
  accuracy: 0,
  hintsUsed: 0,
}

type StandardGameAction =
  | {
      type: StandardGameActionType.ANSWER
      payload: { isCorrect: boolean; withHint: boolean; time: number }
    }
  | { type: StandardGameActionType.NEXT }
  | { type: StandardGameActionType.SUBMIT }

let gameReducer = (
  state: StandardGameState,
  action: StandardGameAction
): StandardGameState => {
  switch (action.type) {
    case StandardGameActionType.ANSWER:
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
    case StandardGameActionType.NEXT:
      return { ...state, turn: state.turn + 1, answered: false }
    case StandardGameActionType.SUBMIT:
      return { ...state, submitted: true }
    default:
      return state
  }
}

export const StandardGameContainer: FC<Props> = ({ display, players }) => {
  const [lang, setLang] = useState<any>()

  const [
    { turn, hintsUsed, timedScore, accuracy, answered, submitted },
    dispatch,
  ] = useReducer(gameReducer, {
    ...initialGameState,
  })

  const user = useSelector(userSelector)
  const challenge = useSelector(challengeSelector)
  const { writeScore } = useScores()

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
      type: StandardGameActionType.ANSWER,
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
    writeScore(timedScore, accuracy, turn, hintsUsed)
    dispatch({
      type: StandardGameActionType.SUBMIT,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, turn, answered, submitted, timedScore, accuracy, challenge])

  const onClickNext = () => {
    setLang(null)
    dispatch({
      type: StandardGameActionType.NEXT,
    })
  }

  return display ? (
    <StandardGame
      accuracy={accuracy}
      turn={turn}
      user={user}
      challenge={challenge}
      showAnswer={answered}
      lang={lang}
      choices={choices}
      onClickNext={onClickNext}
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
