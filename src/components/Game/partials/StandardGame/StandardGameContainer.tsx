import {
  FC,
  useCallback,
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
} from "../../../../utils/helpers"
import { StandardGame } from "./StandardGame"
import { maxHints, maxLevels } from "../../../../utils/constants"
import { useSelector } from "react-redux"
import { userSelector } from "../../../../store/userSlice"
import { challengeSelector } from "../../../../store/challengeSlice"
import { useScores } from "../../../../hooks/useScores"
import { Language } from "../../../../types/language"
import {
  GameActionType,
  gameReducer,
  initialGameState,
  startingTurn,
} from "../../GameReducer"
import { useAnalytics } from "../../../../hooks/useAnalytics"

export const StandardGameContainer: FC<Props> = ({
  display,
  players,
  onComplete,
}) => {
  const [lang, setLang] = useState<any>()
  const { logEvent } = useAnalytics()
  const [
    { turn, hintsUsed, timedScore, accuracy, answered, submitted, languages },
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
    if (!challenge || lang) return
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

  const onAnswer = useCallback(
    (answer: any, time?: number, showHint?: boolean) => {
      dispatch({
        type: GameActionType.ANSWER,
        payload: {
          isCorrect: answer && answer.code1 === lang.code1,
          time: time || 1,
          withHint: showHint || false,
          language: lang,
        },
      })
      logEvent("round_answer", {
        userId: user?.uid,
        language: lang.name,
        answer: answer.name,
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang]
  )

  useEffect(() => {
    if (challenge && answered && turn === challenge.rounds) {
      const langsNames = languages.map((l) => l.name)
      onComplete?.(turn, accuracy, timedScore, langsNames)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answered, turn])

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
      type: GameActionType.SUBMIT,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, turn, answered, submitted, timedScore, accuracy, challenge])

  const onClickNext = useCallback(() => {
    setLang(null)
    dispatch({
      type: GameActionType.NEXT,
    })
  }, [])

  return display ? (
    <StandardGame
      timedScore={timedScore}
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
  onComplete?: (
    turn?: number,
    accuracy?: number,
    score?: number,
    languages?: string[]
  ) => void
}
