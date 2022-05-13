import firebase from '../config';

export interface User {
    age?: number
    complete?: boolean
    displayName?: string
    photoURL?: string
    email?: string
    gender?: 'male' | 'female'
    lastWorkoutAt?: firebase.firestore.Timestamp
    onBoarding?: boolean
    streak?: number
    uid?: string
    messagingToken?: string
    feedback?: boolean

    colorMode?: 'light' | 'dark'

    settings?: UserSettings
}

export interface UserSettings {
    autofillVolume?: boolean
    applyRecommendation?: boolean
    autostartSet?: boolean
    warmupTimer?: boolean
    warmupTime?: number
    restTimer?: boolean
    progressiveOverload?: boolean
}