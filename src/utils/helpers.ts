/* eslint-disable no-mixed-operators */
// const langs_e = langs.map(lan => {
//     var l = pop.find(p => p.language.match(lan.name))
//     if (l) return { ...l, ...lan }
//     return lan
// })

import { Language } from "../types/language"
import countries from "../data/countries.json"
import languages from "../data/languages.json"
import files from "../data/files.json"
import _ from "lodash"
import { MedalType } from "../icons/Medal/Medal"

const wikipediaURL =
  "https://en.wikipedia.org/w/api.php?format=json&action=query&origin=*&prop=extracts&exintro&explaintext&redirects=1&titles="

const avatarURL = "https://avatars.dicebear.com/api/identicon/"

const defaultLanguage: Language = {
  name: "default",
}

export const allLangs = _.sortBy<Language>(
  Array.from(new Set(files.map((f) => f.split("/")[0])))
    .map((l) => l.replace("_", " "))
    .map(
      (l) =>
        (languages as Language[]).find(
          (lan) => lan["all names"]?.split(";").filter((n) => n === l).length
        ) || defaultLanguage
    )
    .filter((l) => l.name !== "default"),
  "rank"
)

export const generateLangChoices = (
  levelLangs?: Language[],
  lang?: Language
) => {
  if (!lang) return []
  let langChoices = _.sampleSize(levelLangs, 4)
  while (langChoices.find((l) => l?.code1 === lang.code1)) {
    langChoices = _.sampleSize(levelLangs, 4)
  }
  langChoices.push(lang)
  return _.shuffle(langChoices)
}

export const getAvatarURL = () => {
  const seed = Math.round(Math.random() * 99999)
  return `${avatarURL}${seed}.svg`
}

export const getLevelLabel = (level: number) => {
  switch (level) {
    case 1:
      return "Easy"
    case 2:
      return "Medium"
    case 3:
      return "Hard"
    case 4:
      return "Expert"
    default:
      return "Impossible"
  }
}

export const gameEvals: {
  medal: MedalType
  message: string
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning"
}[] = [
  { medal: "grey", message: "way to go", color: "error" },
  { medal: "blue", message: "You still have a lot to learn", color: "warning" },
  { medal: "silver", message: "You have a good knowledge!", color: "primary" },
  { medal: "purple", message: "You are a polyglot!!", color: "primary" },
  { medal: "gold", message: "You are unstoppable!!!", color: "success" },
]

export const getEval = (accuracy: number) => {
  switch (true) {
    case accuracy < 0.2:
      return gameEvals[0]
    case accuracy < 0.4:
      return gameEvals[1]
    case accuracy < 0.6:
      return gameEvals[2]
    case accuracy < 0.8:
      return gameEvals[3]
    default:
      return gameEvals[4]
  }
}

export const getLv = (xp?: number) => {
  const factor = 150
  let n = factor,
    lv = 1

  while (n <= (xp || 0)) {
    n += Math.round(factor * Math.pow(lv, 1.5))
    lv++
  }

  return {
    lv,
    next: n,
    progress: Math.round(((xp || 0) * 100) / (n || 1)),
  }
}

// mulberry32
export const getRandomFromSeed = (a: number) => {
  var t = (a += 0x6d2b79f5)
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

export const getLanguageCountries = (language?: Language) => {
  return countries.filter((c) =>
    c["Official language"]
      .split(";")
      .find((l) =>
        language?.["all names"]?.split(";").find((name) => name === l)
      )
  )
}

export const getLanguageInfo = (language?: Language) => {
  return fetch(
    wikipediaURL + encodeURIComponent(`${language?.name} language`),
    {
      method: "GET",
    }
  )
}
