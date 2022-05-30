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

const wikipediaURL =
  "https://en.wikipedia.org/w/api.php?format=json&action=query&origin=*&prop=extracts&exintro&explaintext&redirects=1&titles="

export const allLangs = _.sortBy(
  Array.from(new Set(files.map((f) => f.split("/")[0])))
    .map((l) => l.replace("_", " "))
    .map((l) =>
      languages.find(
        (lan) => lan["all names"].split(";").filter((n) => n === l).length
      )
    ),
  "rank"
)

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

export const getEval = (score: number, turn: number) => {
  switch (true) {
    case score / turn < 0.4:
      return "still have a lot to learn"
    case score / turn < 0.6:
      return "have a good knowledge!"
    case score / turn < 0.8:
      return "are a polyglot!!"
    default:
      return "are unstoppable!!!"
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
