import firebase from "../config"

export interface User {
  age?: number
  displayName?: string
  photoURL?: string
  email?: string
  gender?: "male" | "female"
  lastPlayedAt?: firebase.firestore.Timestamp
  onBoarding?: boolean
  streak?: number
  uid?: string
  messagingToken?: string
  feedback?: boolean
  gamesPlayed?: number
  colorMode?: "light" | "dark"
  settings?: UserSettings
}

export interface UserSettings { }
