import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import firebase from "../config"
import { userSelector } from "../store/userSlice"
import { challengeSelector, setChallenge } from "../store/challengeSlice"
import { Challenge, ChallengeSetup, Player } from "../types/challenge"

export const useChallenge = (gameId?: string) => {
  const functions = firebase.functions()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector(userSelector)
  const challenge = useSelector(challengeSelector)

  const [challengeId, setChallengeId] = useState<string | undefined>(gameId)
  const [players, setPlayers] = useState<Player[]>()
  const [error, setError] = useState<string>()
  const [rematch, setRematch] = useState<boolean>(false)

  const requrest = useRef()
  const requrestSubscribe = useRef<any>()

  useEffect(() => {
    let subscribe: any
    let subscribePlayers: any
    if (challengeId) {
      subscribe = firebase
        .firestore()
        .collection("challenges")
        .doc(challengeId)
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
          dispatch(setChallenge({ id: challengeId, ...challengeData }))
          if (subscribePlayers) {
            subscribePlayers()
          }
          subscribePlayers = firebase
            .firestore()
            .collection(`challenges/${challengeId}/players`)
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
  }, [challengeId, challenge?.id])

  const writeScore = (
    timedScore: number,
    accuracy: number,
    turn: number,
    hintsUsed: number
  ) => {
    if (!user) {
      return
    }

    firebase
      .firestore()
      .collection(`challenges/${challengeId}/players`)
      .doc(user.uid)
      .set({
        id: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL || "",
        joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
        timedScore,
        accuracy,
        hintsUsed,
        turn,
      })
      .then(() => {
        if (turn === challenge?.rounds) {
          checkChallengeStatus()
        }
      })
  }

  const checkChallengeStatus = () => {
    const checkChallengeStatusCallable = functions.httpsCallable(
      "checkChallengeStatus"
    )
    return checkChallengeStatusCallable({ challengeId: challengeId })
      .then((res: { data: Challenge }) => {
        return new Promise<{ data: Challenge }>((resolve, reject) => {
          resolve(res)
        })
      })
      .catch((err) => {})
  }

  const requestRematch = () => {
    return new Promise((resolve, reject) => {
      if (!challenge) reject()
      const setup: ChallengeSetup = challenge as ChallengeSetup
      return firebase
        .firestore()
        .collection("requests")
        .add({
          uid: user?.uid || null,
          ...setup,
          players: players?.length,
          waiting: true,
          rematchId: challengeId,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(function (docRef: any) {
          setRematch(true)
          requrest.current = docRef.id
          requrestSubscribe.current = docRef.onSnapshot(
            (querySnapshot: any) => {
              if (!querySnapshot.exists) {
                return
              }
              const requestData = querySnapshot.data()
              if (requestData.challengeId) {
                console.log(
                  "Document written with ID: ",
                  requestData.challengeId
                )
                setRematch(false)
                setChallengeId(requestData.challengeId)
                navigate(`/play/${requestData.challengeId}`)
                requrestSubscribe.current?.()
                resolve(true)
              }
            }
          )
        })
        .catch((e: any) => {
          console.log(e)
          reject()
        })
    })
  }
  const cancelRematch = () => {
    return new Promise((resolve, reject) => {
      if (!challenge) reject()
      firebase
        .firestore()
        .collection("requests")
        .where("rematchId", "==", challengeId)
        .where("uid", "==", user?.uid)
        .get()
        .then((snapshot: any) => {
          const removeRequestsBatch = firebase.firestore().batch()
          snapshot.docs.forEach((doc: any) => {
            removeRequestsBatch.delete(doc.ref)
          })
          return removeRequestsBatch.commit()
        })
        .then(() => {
          setRematch(false)
          resolve(true)
        })
        .catch((e: any) => {
          console.log(e)
          reject(e)
        })
    })
  }

  const leaveChallenge = () => {
    if (challengeId) {
      firebase
        .firestore()
        .collection(`challenges/${challengeId}/players`)
        .doc(user?.uid)
        .delete()
        .then(() => {
          dispatch(setChallenge(null))
        })
    } else {
      dispatch(setChallenge(null))
    }
  }

  return {
    players,
    writeScore,
    error,
    rematch,
    requestRematch,
    leaveChallenge,
    cancelRematch,
  }
}
