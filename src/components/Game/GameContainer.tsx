import { useLayoutEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  challengeSelector,
  challengeSetupSelector,
} from "../../store/challengeSlice"
import { userSelector } from "../../store/userSlice"
import { Game } from "./Game"
import { useChallenge } from "../../hooks/useChallenge"
import { ConfirmDialog } from "../../molecules/ConfirmDialog/ConfirmDialog"
import { useUser } from "../../hooks/useUser"
import { setFeedback } from "../../store/feedbackSlice"
import firebase from "../../config"
import { isToday } from "../../utils/utils"
import { UserStats } from "../../types/user"

export const GameContainer = () => {
  const [open, setOpen] = useState(false)

  let { gameId } = useParams()

  const {
    players,
    error,
    leaveChallenge,
    completeChallenge,
    rematch,
    requestRematch,
    cancelRematch,
  } = useChallenge(gameId)

  const { updateUser } = useUser()

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const user = useSelector(userSelector)
  const challenge = useSelector(challengeSelector)
  const challengeSetup = useSelector(challengeSetupSelector)

  useLayoutEffect(() => {
    if ((challenge || !challengeSetup) && !gameId && !challenge?.level) {
      navigate("/")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId, challenge])

  const onLeaveConfirmed = () => {
    if (rematch) {
      cancelRematch()
    }
    leaveChallenge()
    navigate("/")
  }

  const onClickLeave = () => {
    if (players && players.length > 1) {
      setOpen(true)
    } else {
      onLeaveConfirmed()
    }
  }

  const onComplete = (
    turn?: number,
    accuracy?: number,
    score?: number,
    languages?: string[]
  ) => {
    if (!user?.feedback) {
      setTimeout(() => {
        dispatch(setFeedback(true))
      }, 1000)
    }

    const gamesPlayed = user?.gamesPlayed || 0
    const roundsPlayed = user?.roundsPlayed || 0
    const accRatio = (accuracy || 0) / (turn || 1)
    const userAccuracy = user?.accuracy
      ? (user.accuracy * gamesPlayed + (accRatio || 0)) / (gamesPlayed + 1)
      : accRatio || 0
    const xp = (user?.xp || 0) + (score || 0) * (challenge?.level || 0)
    const lifeScore =
      (user?.lifeScore || 0) +
      Math.round(Math.pow(score || 0, 2) / (user?.lifeScore || score || 1))
    const newLanguages = user?.languages
      ? [...user.languages, ...(languages || [])]
      : languages || []

    let streak = user?.streak || 0
    let streakUpdated = false

    if (
      !user?.lastStreakUpdateAt ||
      !isToday(user?.lastStreakUpdateAt.toDate())
    ) {
      streak++
      streakUpdated = true
    }

    const history = user?.history || []
    const newStats: UserStats = {
      gamesPlayed: gamesPlayed + 1,
      roundsPlayed: roundsPlayed + (turn || 0),
      accuracy: Math.round(userAccuracy * 100) / 100,
      xp,
      lifeScore,
      streak,
      languages: newLanguages,
    }

    const historyRecord: UserStats = {
      ...newStats,
      roundsPlayed: turn || 0,
      accuracy: accRatio,
      xp: score || 0,
      level: challenge?.level || 1,
      languages,
    }

    const currDate =
      firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp

    updateUser({
      ...user,
      lastPlayedAt: currDate,
      lastStreakUpdateAt: streakUpdated ? currDate : user?.lastStreakUpdateAt,
      ...newStats,
      history: [
        ...history,
        {
          ...historyRecord,
          statDate: new Date(),
        },
      ],
    }).then(() => {
      if (!players || players.length <= 1) {
        completeChallenge()
      }
    })
  }

  const onClickRematch = () => {
    requestRematch()
  }

  return (
    <>
      <Game
        user={user}
        challenge={challenge || undefined}
        players={players}
        onClickLeave={onClickLeave}
        onClickRematch={onClickRematch}
        onComplete={onComplete}
        rematch={rematch}
        error={error}
      />
      <ConfirmDialog
        title="Are you sure you want to leave?"
        message="By clicking confirm, you will lose the ongoing challenge."
        open={open}
        setOpen={() => setOpen((o) => !o)}
        onConfirm={onLeaveConfirmed}
      />
    </>
  )
}
