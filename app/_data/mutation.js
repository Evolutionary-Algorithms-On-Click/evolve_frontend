export const mutationList = ["mutShuffleIndexes", "mutFlipBit"];

export const validateMutation = (mutation) => {
    return mutationList.includes(mutation);
};

export const mutationData = [
    {
        name: "mutShuffleIndexes",
        description: "Shuffle the attributes of the individual",
    },
    {
        name: "mutFlipBit",
        description: "Flip the value of the attributes of the input individual",
    },
];
