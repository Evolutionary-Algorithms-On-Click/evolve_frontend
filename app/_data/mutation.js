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

export const deMutationData = [
    {
        name: "DE/rand/1",
        description: "DE/rand/1 mutation strategy",
    },
    {
        name: "DE/rand/2",
        description: "DE/rand/2 mutation strategy",
    },
    {
        name: "DE/best/1",
        description: "DE/best/1 mutation strategy",
    },
    {
        name: "DE/best/2",
        description: "DE/best/2 mutation strategy",
    },
    {
        name: "DE/current-to-best/1",
        description: "DE/current-to-best/1 mutation strategy",
    },
    {
        name: "DE/current-to-rand/1",
        description: "DE/current-to-rand/1 mutation strategy",
    },
    {
        name: "DE/rand-to-best/1",
        description: "DE/rand-to-best/1 mutation strategy",
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
