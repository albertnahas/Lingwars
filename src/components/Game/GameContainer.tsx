import { useLayoutEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { challengeSelector } from "../../store/challengeSlice"
import { userSelector } from "../../store/userSlice"
import { Game } from "./Game"
import { useChallenge } from "../../hooks/useChallenge"
import { ConfirmDialog } from "../../molecules/ConfirmDialog/ConfirmDialog"

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

  const navigate = useNavigate()

  const user = useSelector(userSelector)
  const challenge = useSelector(challengeSelector)

  useLayoutEffect(() => {
    if (challenge && !gameId && !challenge?.level) {
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

  const onClickRematch = () => {
    requestRematch()
  }

  return (
    <>
      <Game
        user={user}
        challenge={challenge}
        players={players}
        onClickLeave={onClickLeave}
        onClickRematch={onClickRematch}
        rematch={rematch}
        error={error}
      />
      <ConfirmDialog
        title="Are you sure you want to leave the challenge?"
        message="By clicking confirm, you will lose the ongoing challenge."
        open={open}
        setOpen={() => setOpen((o) => !o)}
        onConfirm={onLeaveConfirmed}
      />
    </>
  )
}
