import firebase from "../config"

export interface User extends UserStats {
  uid?: string
  age?: number
  displayName?: string
  photoURL?: string
  email?: string
  gender?: "male" | "female"
  lastPlayedAt?: firebase.firestore.Timestamp
  lastStreakUpdateAt?: firebase.firestore.Timestamp
  onBoarding?: boolean
  feedback?: boolean
  isAnonymous?: boolean
  colorMode?: "light" | "dark"
  settings?: UserSettings
  messagingToken?: string
  history?: UserStats[]
}

export interface UserStats {
  gamesPlayed?: number
  roundsPlayed?: number
  accuracy?: number
  xp?: number
  lifeScore?: number
  streak?: number
  level?: number
  languages?: string[]
  statDate?: Date
}

export interface UserSettings {}
