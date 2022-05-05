// const langs_e = langs.map(lan => {
//     var l = pop.find(p => p.language.match(lan.name))
//     if (l) return { ...l, ...lan }
//     return lan
// })

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