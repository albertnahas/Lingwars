import { useLayoutEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { challengeSelector } from "../../store/challengeSlice"
import { userSelector } from "../../store/userSlice"
import { Game } from "./Game"
import { useChallenge } from "../../hooks/useChallenge"

export const GameContainer = () => {
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

  const onClickLeave = () => {
    if (rematch) {
      cancelRematch()
    }
    leaveChallenge()
    navigate("/")
  }

  const onClickRematch = () => {
    requestRematch()
  }

  return (
    <Game
      user={user}
      challenge={challenge}
      players={players}
      onClickLeave={onClickLeave}
      onClickRematch={onClickRematch}
      rematch={rematch}
      error={error}
    />
  )
}
