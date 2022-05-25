import firebase from "../config"
import { ChallengeStatus } from "../utils/constants"

export interface Challenge {
  id?: string
  uid?: string
  level?: number
  rounds?: number
  seed?: number
  status?: ChallengeStatus
  createdAt?: firebase.firestore.Timestamp
  finishedAt?: firebase.firestore.Timestamp
  scores?: object
  players?: number
  live?: boolean
  full?: boolean
  rematchRequested?: boolean
}

export interface Player {
  id?: string
  displayName: string
  photoURL: string
  joinedAt: firebase.firestore.Timestamp
  timedScore: number
  accuracy: number
  turn: number
  roundsScore: RoundScore[]
}

export interface RoundScore {
  turn?: number
  correct?: boolean
  time?: number
}

export interface ChallengeSetup {
  players?: number
  level?: number
  rounds?: number
  live?: boolean
}
