import { Challenge } from "./challenge"
import { User } from "./user"

export interface State {
  user: UserState
  challenge: ChallengeState
  alert: AlertState
  drawer: DrawerState
  feedback: FeedbackState
  snackbar: SnackbarState
}

export interface UserState {
  value?: User | null
  serverValue?: any | null
}
export interface ChallengeState {
  value?: Challenge
}
export interface AlertState {
  title?: string
  message?: string
  open?: boolean
}
export interface DrawerState {
  open?: boolean
}
export interface SnackbarState {
  open?: boolean
  message?: string
  type?: "success" | "warning" | "error"
}
export interface FeedbackState {
  open?: boolean
}
