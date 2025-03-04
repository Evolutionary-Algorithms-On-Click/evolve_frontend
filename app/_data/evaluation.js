export const evalFuncList = ["evalOneMax", "evalProduct", "evalDifference"];

export function validateEvalFunc(evalFunc) {
    return evalFuncList.includes(evalFunc);
}

export const evalFuncData = [
    {
        name: "evalOneMax",
        description: "Count the number of 1s in the individual",
    },
    {
        name: "evalProduct",
        description: "Multiply the values of the individual",
    },
    {
        name: "evalDifference",
        description: "Subtract the values of the individual",
    },
    {
        name: "rand",
        description: "Random search algorithm.",
    },
    {
        name: "plane",
        description: "A simple planar function.",
    },
    {
        name: "sphere",
        description: "The sphere function, a simple convex function.",
    },
    {
        name: "cigar",
        description:
            "The cigar function, a unimodal function with a narrow valley.",
    },
    {
        name: "rosenbrock",
        description:
            "The Rosenbrock function, a non-convex function with a narrow valley.",
    },
    {
        name: "h1",
        description: "h1 function.",
    },
    {
        name: "ackley",
        description:
            "The Ackley function, a multimodal function with a global minimum.",
    },
    {
        name: "bohachevsky",
        description: "The Bohachevsky function, a multimodal function.",
    },
    {
        name: "griewank",
        description:
            "The Griewank function, a multimodal function with a global minimum.",
    },
    {
        name: "rastrigin",
        description:
            "The Rastrigin function, a multimodal function with many local minima.",
    },
    {
        name: "rastrigin_scaled",
        description: "The scaled Rastrigin function.",
    },
    {
        name: "rastrigin_skew",
        description: "The skewed Rastrigin function.",
    },
    {
        name: "schaffer",
        description: "The Schaffer function, a multimodal function.",
    },
    {
        name: "schwefel",
        description:
            "The Schwefel function, a multimodal function with a global minimum far from the origin.",
    },
    {
        name: "himmelblau",
        description:
            "The Himmelblau function, a multimodal function with four local minima.",
    },
];
