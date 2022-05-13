import { UserSettings } from "../types/user";

export const userPlaceholderPhoto =
    'https://monstar-lab.com/global/wp-content/uploads/sites/11/2019/04/male-placeholder-image.jpeg';
export const PUBLIC_DOMAIN_URL = 'https://raw.githubusercontent.com/wrkout/exercises.json/master/exercises/'
// export const PUBLIC_DOMAIN_URL = 'https://raw.githubusercontent.com/wrkout/exercises.json/master/exercises/Barbell_Curl/exercise.json'
// https://raw.githubusercontent.com/wrkout/exercises.json/master/exercises/Barbell_Curl/images/0.jpg



export const workoutPlaces = [
    "all",
    "home",
    "gym",
    "crossfit",
]

export const nonWeightedEquipments = [
    "body only",
    "bands",
    "foam roll",
]
export const noRepsCategory = [
    "cardio",
]

export const equipmentsPlaces = {
    'body only': ["home"],
    'machine': ["gym"],
    'other': [],
    'foam roll': ["crossfit", "home"],
    'kettlebells': ["crossfit"],
    'dumbbell': ["gym", "crossfit"],
    'cable': ["gym"],
    'barbell': ["gym", "crossfit"],
    'medicine ball': ["crossfit"],
    'bands': ["crossfit", "home"],
    'exercise ball': ["crossfit"],
    'e-z curl bar': ["crossfit", "gym"],
}

export const splits = [
    "push",
    "pull",
    "legs",
    "core",
    "arms",
    "upper",
    "lower",
    "full",
    "biceps",
    "triceps",
    "back",
    "chest",
    "shoulders",
]

export const muscles = {
    "hamstrings": ["legs", "lower"],
    "quadriceps": ["legs", "lower"],
    "calves": ["legs", "lower"],
    "glutes": ["legs", "lower"],
    "abductors": ["legs", "lower"],
    "adductors": ["legs", "lower"],
    "biceps": ["arms", "pull", "upper", "biceps"],
    "triceps": ["arms", "push", "upper", "triceps"],
    "forearms": ["arms", "pull"],
    "abdominals": ["core", "lower", "abdominals"],
    "middle back": ["pull", "upper", "back"],
    "lower back": ["pull", "upper", "back"],
    "lats": ["pull", "upper", "back"],
    "traps": ["pull", "upper", "back"],
    "chest": ["push", "upper", "chest"],
    "shoulders": ["push", "upper", "shoulders"],
}


export const goalCateogries = {
    "general": [],
    "strength": [],
    "muscle": [],
    "endurance": [],
}

export const defaultUserSettings: UserSettings = {
    autofillVolume: true,
    applyRecommendation: true,
    autostartSet: false,
    warmupTimer: true,
    warmupTime: 5,
    restTimer: true,
    progressiveOverload: true,
}