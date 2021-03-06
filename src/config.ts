// Import the functions you need from the SDKs you need
import firebase from "firebase"
import "firebase/storage"
import "firebase/messaging"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtVXwmmTFsT6ohl06zew8k-6c_8CmV7Zg",
  authDomain: "lingwars-2ee8b.firebaseapp.com",
  databaseURL: "https://lingwars-2ee8b-default-rtdb.firebaseio.com",
  projectId: "lingwars-2ee8b",
  storageBucket: "lingwars-2ee8b.appspot.com",
  messagingSenderId: "1032612550540",
  appId: "1:1032612550540:web:a07dc1a13b9f239f6d28a9",
  measurementId: "G-8MDJN04EXZ",
}

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
} else {
  firebase.app() // if already initialized, use that one
}
if (window.location.hostname === "localhost") {
  firebase.auth().useEmulator("http://localhost:9099")
  firebase.firestore().useEmulator("localhost", 8081)
  firebase.firestore().settings({
    experimentalForceLongPolling: true,
    merge: true,
  })
  firebase.functions().useEmulator("localhost", 5001)
  firebase.database().useEmulator("localhost", 9000)
  firebase.storage().useEmulator("localhost", 9199)
}
let messaging: any

try {
  messaging = firebase.messaging()
} catch (error) {
  console.log(error)
}

export const getToken = () => {
  if (!messaging) return
  return messaging
    .getToken({
      vapidKey:
        "BB-ZtExWjS9k8CCdK1gMs-adp2YAzKC7jAK53xD4BgiFP--4AvHUt3ZPI0oKeg1ALVz7VY85mEVNkAF_Dm45B2I",
    })
    .then((currentToken: any) => {
      if (currentToken) {
        return currentToken
        // Track the token -> client mapping, by sending to backend server
        // show on the UI that permission is secured
      } else {
        return undefined
        // shows on the UI that permission is required
      }
    })
    .catch((err: any) => {
      console.log("An error occurred while retrieving token. ", err)
      // catch error while creating client token
    })
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging &&
      messaging.onMessage((payload: any) => {
        resolve(payload)
      })
  })

export default firebase
