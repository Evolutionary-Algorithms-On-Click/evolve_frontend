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

// TODO: Update descriptions.
export const gpMutationData = [
    {
        name: "mutShrink",
        description: "Shrink the tree",
    },
    {
        name: "mutUniform",
        description: "Uniform mutation",
    },
    {
        name: "mutNodeReplacement",
        description: "Replace a node",
    },
    {
        name: "mutEphemeral",
        description: "Ephemeral mutation",
    },
    {
        name: "mutInsert",
        description: "Insert a node",
    },
    {
        name: "mutSemantic",
        description: "Semantic mutation",
    },
];
