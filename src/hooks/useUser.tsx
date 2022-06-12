import firebase from "../config"
import { User } from "../types/user"

export const useUser = () => {
  const updateUser = (user: User) => {
    return new Promise((resolve, reject) => {
      const usersRef = firebase.firestore().collection("users").doc(user.uid)
      return usersRef
        .get()
        .then((docSnapshot) => {
          if (docSnapshot.exists) {
            usersRef.update({ ...user })
            resolve(true)
          } else {
            reject(false)
          }
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  const deleteAccount = () => {
    const user = firebase.auth().currentUser
    return user?.delete()
  }

  return { updateUser, deleteAccount }
}
