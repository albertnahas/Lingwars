// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js")
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js")

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: "AIzaSyBtVXwmmTFsT6ohl06zew8k-6c_8CmV7Zg",
  authDomain: "lingwars-2ee8b.firebaseapp.com",
  databaseURL: "https://lingwars-2ee8b-default-rtdb.firebaseio.com",
  projectId: "lingwars-2ee8b",
  storageBucket: "lingwars-2ee8b.appspot.com",
  messagingSenderId: "1032612550540",
  appId: "1:1032612550540:web:a07dc1a13b9f239f6d28a9",
  measurementId: "G-8MDJN04EXZ",
}

firebase.initializeApp(firebaseConfig)

// Retrieve firebase messaging
const messaging = firebase.messaging()

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
