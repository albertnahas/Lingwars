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

export const GameContainer = () => {
  const [open, setOpen] = useState(false)

  let { gameId } = useParams()

  const {
    players,
    error,
    leaveChallenge,
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

  const onComplete = () => {
    if (!user?.feedback) {
      setTimeout(() => {
        dispatch(setFeedback(true))
      }, 1000)
    }
    const gamesPlayed = user?.gamesPlayed || 0
    updateUser({
      ...user,
      gamesPlayed: gamesPlayed + 1,
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
