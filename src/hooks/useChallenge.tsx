import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import firebase from "../config"
import { userSelector } from "../store/userSlice"
import { setChallenge } from "../store/challengeSlice"
import { Score } from "../types/challenge"

export const useChallenge = (gameId?: string) => {
  const dispatch = useDispatch()
  const user = useSelector(userSelector)

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
          dispatch(setChallenge({ id: gameId, ...challengeData }))
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
    if (!user) {
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
  }

  return { players, writeScore, error }
}
