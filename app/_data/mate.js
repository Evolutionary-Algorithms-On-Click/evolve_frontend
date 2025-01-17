export const mateList = [
    "cxOnePoint",
    "cxTwoPoint",
    "cxPartialyMatched",
    "cxOrdered",
    "cxMessyOnePoint",
];

export function validateMateFunction(mateFunction) {
    return mateList.includes(mateFunction);
}

export const mateData = [
    {
        name: "cxOnePoint",
        description: "Executes a one-point crossover on the input individuals.",
    },
    {
        name: "cxTwoPoint",
        description: "Executes a two-point crossover on the input individuals.",
    },
    {
        name: "cxPartialyMatched",
        description:
            "Executes a partially matched crossover on the input individuals.",
    },
    {
        name: "cxOrdered",
        description: "Executes an ordered crossover on the input individuals.",
    },
    {
        name: "cxMessyOnePoint",
        description:
            "Executes a messy one-point crossover on the input individuals.",
    },
];

export const gpMateData = [
    {
        name: "cxOnePoint",
        description: "Executes a one-point crossover on the input individuals.",
    },
    {
        name: "cxOnePointLeafBiased",
        description:
            "Executes a one-point crossover on the input individuals, biased towards leaf nodes.",
    },
    {
        name: "cxSemantic",
        description: "Executes a semantic crossover on the input individuals.",
    },
];
