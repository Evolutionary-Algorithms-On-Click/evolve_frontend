export const selectionList = [
    "selTournament",
    "selRoulette",
    "selNSGA2",
    "selSPEA2",
    "selRandom",
    "selBest",
    "selWorst",
    "selStochasticUniversalSampling",
    "selTournamentDCD",
    "selLexicase",
    "selAutomaticEpsilonLexicase",
    "sortNondominated",
    "sortLogNondominated",
]

export function validateSelection(selection) {
    return selectionList.includes(selection)
}

export const selectionData = [
    {
        name: "selTournament",
        description: "Select the best individual among tournsize randomly chosen individuals, k times.",
    },
    {
        name: "selRoulette",
        description: "Select by roulette wheel. The selection probability of an individual is proportional to its fitness.",
    },
    {
        name: "selNSGA2",
        description: "Select the best individual according to the non-dominated sorting of NSGA-II.",
    },
    {
        name: "selSPEA2",
        description: "Select the best individual according to the non-dominated sorting of SPEA2.",
    },
    {
        name: "selRandom",
        description: "Select randomly.",
    },
    {
        name: "selBest",
        description: "Select the best individual.",
    },
    {
        name: "selWorst",
        description: "Select the worst individual.",
    },
    {
        name: "selStochasticUniversalSampling",
        description: "Select by stochastic universal sampling. The selection probability of an individual is proportional to its fitness.",
    },
    {
        name: "selTournamentDCD",
        description: "Select the best individual among tournsize randomly chosen individuals, k times. This selection method is specifically designed for the NSGA-III algorithm.",
    },
    {
        name: "selLexicase",
        description: "Select the best individual according to the lexicase selection.",
    },
    {
        name: "selAutomaticEpsilonLexicase",
        description: "Select the best individual according to the automatic epsilon lexicase selection.",
    },
    {
        name: "sortNondominated",
        description: "Sort the population according to non-dominated sorting.",
    },
    {
        name: "sortLogNondominated",
        description: "Sort the population according to non-dominated sorting. This method logs the non-dominated fronts.",
    },
]