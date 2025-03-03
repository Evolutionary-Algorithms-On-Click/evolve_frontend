export const algorithmList = ["original", "multiswarm", "speciation"];

export function validateAlgorithm(algorithm) {
    return algorithmList.includes(algorithm);
}

export const algorithmData = [
    {
        name: "original",
        description:
            "The original Particle Swarm Optimization algorithm as presented in Ricardo Poli, James Kennedy and Tim Blackwell, “Particle swarm optimization an overview”. Swarm Intelligence. 2007;",
    },
    {
        name: "multiswarm",
        description:
            "Multiswarm Particle Swarm Optimization algorithm as presented in Blackwell, Branke, and Li, 2008, Particle Swarms for Dynamic Optimization Problems.",
    },
    {
        name: "speciation",
        description:
            "Speciation Particle Swarm Optimization algorithm as presented in Li, Blackwell, and Branke, 2006, Particle Swarm with Speciation and Adaptation in a Dynamic Environment.",
    },
];
