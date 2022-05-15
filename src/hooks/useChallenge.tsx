import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import firebase from "../config";
import { userSelector } from "../store/userSlice";
import { challengeSelector, setChallenge } from "../store/challengeSlice";
import { maxLevels } from "../utils/constants";
import { allLangs } from "../utils/helpers";
import { Score } from "../types/challenge";

export const useChallenge = (gameId?: string) => {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const challenge = useSelector(challengeSelector);

  const [players, setPlayers] = useState<any[]>();

  useEffect(() => {
    let subscribe: any;
    let subscribePlayers: any;
    if (gameId) {
      subscribe = firebase
        .firestore()
        .collection("challenges")
        .doc(gameId)
        .onSnapshot((querySnapshot: any) => {
          if (!querySnapshot.exists) {
            return;
          }
          const challengeData = querySnapshot.data();
          dispatch(setChallenge({ id: gameId, ...challengeData }));
          subscribePlayers = firebase
            .firestore()
            .collection(`challenges/${gameId}/players`)
            .onSnapshot((querySnapshot: any) => {
              let playersArr: any[] = [];
              querySnapshot.forEach((doc: any) => {
                playersArr.push({ id: doc.id, ...doc.data() });
              });
              setPlayers(playersArr);
            });
        });
    } else {
    }
    return () => {
      if (subscribe) {
        subscribe();
      }
      if (subscribePlayers) {
        subscribePlayers();
      }
    };
  }, [gameId]);

  const writeScore = (score: Score, turn: number) => {
    if (!user) {
      return;
    }
    firebase
      .firestore()
      .collection(`challenges/${gameId}/players`)
      .doc(user.uid)
      .set({
        displayName: user.displayName,
        photoURL: user.photoURL,
        joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
        score,
        turn,
      });
  };

  return { players, writeScore };
};
