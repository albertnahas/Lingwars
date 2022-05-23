import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import firebase from "../config"
import { userSelector } from "../store/userSlice"
import { challengeSelector, setChallenge } from "../store/challengeSlice"
import { Challenge, Score } from "../types/challenge"

export const useChallenge = (gameId?: string) => {
  const functions = firebase.functions()
  const dispatch = useDispatch()
  const user = useSelector(userSelector)
  const challenge = useSelector(challengeSelector)

  const [players, setPlayers] = useState<any[]>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    let subscribe: any
    let subscribePlayers: any
    if (gameId) {
      subscribe = firebase
        .firestore()
        .collection("challenges")
        .doc(gameId)
        .onSnapshot((querySnapshot: any) => {
          if (!querySnapshot.exists) {
            setError("The challenge you're trying to join doesn't exist")
            return
          }
          const challengeData = querySnapshot.data()
          if (challengeData.full && !challenge?.id) {
            setError("The challenge you're trying to join is full")
            return
          } else {
            setError(undefined)
          }
          dispatch(setChallenge({ id: gameId, ...challengeData }))
          if (subscribePlayers) {
            subscribePlayers()
          }
          subscribePlayers = firebase
            .firestore()
            .collection(`challenges/${gameId}/players`)
            .onSnapshot((querySnapshot: any) => {
              let playersArr: any[] = []
              querySnapshot.forEach((doc: any) => {
                playersArr.push({ id: doc.id, ...doc.data() })
              })
              setPlayers(playersArr)
            })
        })
    }
    return () => {
      if (subscribe) {
        subscribe()
      }
      if (subscribePlayers) {
        subscribePlayers()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId])

  const writeScore = (score: Score, turn: number) => {
    if (!user || !challenge?.id) {
      return
    }
    firebase
      .firestore()
      .collection(`challenges/${gameId}/players`)
      .doc(user.uid)
      .set({
        id: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL || "",
        joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
        score,
        turn,
      })
      .then(() => {
        if (turn === challenge?.rounds) {
          console.log("checking status after complete")
          checkChallengeStatus()
        }
      })
  }

  const checkChallengeStatus = () => {
    const checkChallengeStatusCallable = functions.httpsCallable(
      "checkChallengeStatus"
    )
    return checkChallengeStatusCallable({ challengeId: gameId })
      .then((res: { data: Challenge }) => {
        return new Promise<{ data: Challenge }>((resolve, reject) => {
          resolve(res)
        })
      })
      .catch((err) => {})
  }

  const leaveChallenge = () => {
    if (gameId) {
      firebase
        .firestore()
        .collection(`challenges/${gameId}/players`)
        .doc(user?.uid)
        .delete()
        .then(() => {
          dispatch(setChallenge(null))
        })
    } else {
      dispatch(setChallenge(null))
    }
  }

  return { players, writeScore, error, leaveChallenge }
}
