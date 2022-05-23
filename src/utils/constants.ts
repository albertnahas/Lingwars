import { UserSettings } from "../types/user"

export const maxLevels = 5

export const maxHints = 3

export type ChallengeStatus = "pending" | "started" | "finished" | "aborted"

export const defaultUserSettings: UserSettings = {}
