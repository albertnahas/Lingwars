import firebase from "../config"
import { User } from "../types/user"

export const useUser = () => {
  const updateUser = (user: User) => {
    const usersRef = firebase.firestore().collection("users").doc(user.uid)
    usersRef.get().then((docSnapshot) => {
      if (docSnapshot.exists) {
        usersRef.update({ ...user })
      }
    })
  }

  const deleteAccount = () => {
    const user = firebase.auth().currentUser
    return user?.delete()
  }

  return { updateUser, deleteAccount }
}
