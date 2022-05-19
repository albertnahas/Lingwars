import _ from "lodash";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import firebase from "../config";
import { removeUser, setUser, setServerUser } from "../store/userSlice";
import { State } from "../types/state";
import { User } from "../types/user";
import { defaultUserSettings } from "../utils/constants";

export const useCurrentUser = () => {
  const dispatch = useDispatch();

  const serverUser = useSelector((state: State) => state.user.serverValue);
  const oldRealTimeDb = firebase.database();
  const onlineRef = oldRealTimeDb.ref(".info/connected"); // Get a reference to the list of connections

  useEffect(() => {
    if (!serverUser) {
      return;
    }

    const user = serverUser;
    firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .get()
      .then((doc: any) => {
        if (!doc.exists) {
          firebase
            .firestore()
            .collection("users")
            .doc(user.uid)
            .set({
              displayName: user.displayName,
              photoURL: user.photoURL,
              uid: user.uid,
              messagingToken: user.messagingToken || null,
            });
        } else {
          onlineRef.on("value", (snapshot) => {
            oldRealTimeDb
              .ref(`/status/${user.uid}`)
              .onDisconnect() // Set up the disconnect hook
              .set("offline") // The value to be set for this key when the client disconnects
              .then(() => {
                // Set the Firestore User's online status to true
                firebase.firestore().collection("users").doc(user.uid).set(
                  {
                    online: true,
                  },
                  { merge: true }
                );

                // Let's also create a key in our real-time database
                // The value is set to 'online'
                oldRealTimeDb.ref(`/status/${user.uid}`).set("online");
              });
          });
          if (!doc.data().messagingToken && user.messagingToken) {
            doc.ref.update({ messagingToken: user.messagingToken });
          }
        }
      })
      .catch((error: any) => {
        console.log("Error getting document:", error);
      });

    const subscribe = firebase
      .firestore()
      .collection("users")
      .doc(serverUser?.uid)
      .onSnapshot((querySnapshot: any) => {
        const updatedUser = querySnapshot.data();
        const settings = { ...defaultUserSettings, ...updatedUser?.settings };
        dispatch(setUser({ ...updatedUser, settings }));
      });

    return () => {
      subscribe?.();
      onlineRef.off();
    };
  }, [serverUser]);

  const signOutUser = () => {
    dispatch(removeUser());
  };

  return { signOutUser };
};
