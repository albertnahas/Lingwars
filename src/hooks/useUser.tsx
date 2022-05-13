import React from "react";
import { useSelector } from "react-redux";
import firebase from "../config";
import { userSelector } from "../store/userSlice";
import { User } from "../types/user";

export const useUser = () => {
  const currentUser = useSelector(userSelector);

  const updateUser = (user: User) => {
    try {
      if (user.weight != currentUser?.weight) {
        user.weightRecords = [
          ...(user.weightRecords || []),
          {
            weight: user.weight || 0,
            date: firebase.firestore.Timestamp.fromDate(new Date()),
          },
        ];
      }
    } catch (error) {
      console.error(error);
    }

    return firebase
      .firestore()
      .collection("users")
      .doc(user?.uid)
      .update({
        ...user,
      });
  };

  const deleteAccount = () => {
    const user = firebase.auth().currentUser;
    return user?.delete();
  };

  return { updateUser, deleteAccount };
};
