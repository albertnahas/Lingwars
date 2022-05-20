import { UserSettings } from "../types/user"

export const maxLevels = 5

export type ChallengeStatus = "pending" | "started" | "done" | "aborted"

export const defaultUserSettings: UserSettings = {}
