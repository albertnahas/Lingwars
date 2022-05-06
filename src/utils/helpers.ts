// const langs_e = langs.map(lan => {
//     var l = pop.find(p => p.language.match(lan.name))
//     if (l) return { ...l, ...lan }
//     return lan
// })

import { Language } from "../types/language";
import countries from "../data/countries.json"

const wikipediaURL = 'https://en.wikipedia.org/w/api.php?format=json&action=query&origin=*&prop=extracts&exintro&explaintext&redirects=1&titles=';

export const getLevelLabel = (level: number) => {
    switch (level) {
        case 1:
            return "Easy";
        case 2:
            return "Medium";
        case 3:
            return "Hard";
        case 4:
            return "Expert";
        default:
            return "Impossible";
    }
};

export const getLanguageCountries = (language?: Language) => {
    return countries.filter(c => c["Official language"].split(';').find(l => language?.["all names"].split(';').find(name => name === l)))
}

export const getLanguageInfo = (language?: Language) => {
    return fetch(wikipediaURL + encodeURIComponent(`${language?.name} language`), {
        method: "GET"
    })
}