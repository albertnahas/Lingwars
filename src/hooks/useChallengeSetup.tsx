import React, { useEffect, useRef } from "react"
import firebase from "../config"
import { Challenge, ChallengeSetup } from "../types/challenge"
import { useSelector } from "react-redux"
import { userSelector } from "../store/userSlice"

export const useChallengeSetup = () => {
  const [challenge, setChallenge] = React.useState<Challenge>()
  const [pairing, setPairing] = React.useState<boolean>(false)

  const requrest = useRef()
  const requrestSubscribe = useRef<any>()

  const user = useSelector(userSelector)

  const createChallenge = (setup?: ChallengeSetup) => {
    firebase
      .firestore()
      .collection("challenges")
      .add({
        uid: user?.uid || null,
        rounds: 10,
        ...setup,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(function (docRef: any) {
        console.log("Document written with ID: ", docRef.id)
        setChallenge({ id: docRef.id, ...setup })
      })
      .catch((e: any) => {
        console.log(e)
      })
  }

  const requestChallenge = (setup?: ChallengeSetup) => {
    firebase
      .firestore()
      .collection("requests")
      .add({
        uid: user?.uid || null,
        rounds: 10,
        ...setup,
        waiting: true,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(function (docRef: any) {
        setPairing(true)
        console.log("Document written with ID: ", docRef.id)
        requrest.current = docRef.id
        requrestSubscribe.current = docRef.onSnapshot((querySnapshot: any) => {
          if (!querySnapshot.exists) {
            return
          }
          const requestData = querySnapshot.data()
          if (requestData.challengeId) {
            console.log("Document written with ID: ", requestData.challengeId)
            setPairing(false)
            setChallenge({ id: requestData.challengeId, ...setup })
            requrestSubscribe.current?.()
          }
        })
      })
      .catch((e: any) => {
        console.log(e)
      })
  }

  useEffect(() => {
    return () => {
      requrestSubscribe.current?.()
    }
  }, [])

  const cancelRequest = () => {
    if (requrest.current) {
      firebase
        .firestore()
        .collection("requests")
        .doc(requrest.current)
        .delete()
        .then(() => {
          setPairing(false)
          requrestSubscribe.current?.()
        })
    }
  }

  return {
    challenge,
    pairing,
    createChallenge,
    requestChallenge,
    cancelRequest,
  }
}
