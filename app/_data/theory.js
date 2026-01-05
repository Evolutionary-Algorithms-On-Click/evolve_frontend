export const theoryData = {
    populationSize: {
        title: "Population Size",
        explanation: "The number of individuals in each generation. A larger population increases genetic diversity and the chance of finding a global optimum but requires more computational power.",
    },
    generations: {
        title: "Generations",
        explanation: "The total number of iterations the evolutionary process will run. More generations allow the population to converge on better solutions but increase execution time.",
    },
    cxpb: {
        title: "Crossover Probability",
        explanation: "The probability that two parent individuals will exchange genetic material. High values promote the recombination of good traits from different individuals.",
    },
    mutpb: {
        title: "Mutation Probability",
        explanation: "The probability that an individual's genes will be randomly altered. This introduces new genetic material, helping the population escape local optima.",
    },
    hof: {
        title: "Hall of Fame",
        explanation: "A special archive that stores the absolute best individuals found throughout the entire run, ensuring that the top solutions are never lost during evolution.",
    },
    mu: {
        title: "Mu (μ)",
        explanation: "The number of individuals to be selected as parents for the next generation. It defines the size of the breeding pool.",
    },
    lambda: {
        title: "Lambda (λ)",
        explanation: "The number of children to be generated in each step. This determines the exploratory capacity of the algorithm per generation.",
    },
    tournamentSize: {
        title: "Tournament Size",
        explanation: "Used in selection: 'k' individuals are picked at random, and the best one wins. A larger tournament size increases selection pressure.",
    },
    phi1: {
        title: "Cognitive Coefficient (φ1)",
        explanation: "In PSO, this scales the influence of a particle's personal best performance on its current velocity.",
    },
    phi2: {
        title: "Social Coefficient (φ2)",
        explanation: "In PSO, this scales the influence of the swarm's global best performance on a particle's current velocity.",
    },
    dimensions: {
        title: "Dimensions",
        explanation: "The number of variables or parameters that the algorithm is trying to optimize simultaneously.",
    },
    algorithmStrategy: {
        title: "Algorithm Strategy",
        explanation: "The high-level logic governing evolution. 'eaSimple' is a basic generational model, while 'eaMuPlusLambda' and 'eaMuCommaLambda' use more advanced selection and replacement mechanics common in Evolution Strategies.",
    },
    psoStrategy: {
        title: "PSO Strategy",
        explanation: "Defines the velocity and position update logic for particles. 'original' uses the standard PSO formulas, while variants like 'multiswarm' or 'speciation' help the algorithm handle more complex optimization landscapes.",
    },
    benchmarkFunction: {
        title: "Benchmark Function",
        explanation: "Mathematical functions used to evaluate optimization performance. Each function (like Ackley, Rastrigin, or Rosenbrock) represents a unique 'landscape' with different challenges for the algorithm to solve.",
    },
    psoBenchmark: {
        title: "Evaluation (Benchmark) Function",
        explanation: "The mathematical landscape the particles are searching. Spheres are simple and unimodal, while Ackley or Rastrigin functions are complex and multimodal, testing the swarm's ability to escape local optima.",
    },
    weights: {
        title: "Weights",
        explanation: "Coefficients that determine the importance of different objectives in the fitness function. If you have multiple goals, weights help the algorithm prioritize between them (e.g., maximizing accuracy vs. minimizing complexity).",
    },
    matingFunction: {
        title: "Mating (Crossover)",
        explanation: "The mechanism of biological recombination. It combines genetic information from two parents to generate offspring, aiming to produce better solutions by merging high-performing traits.",
    },
    mutationFunction: {
        title: "Mutation",
        explanation: "Introduces random changes to individuals. This prevents premature convergence and ensures the algorithm explores new areas of the search space, maintaining genetic diversity.",
    },
    selectionFunction: {
        title: "Selection",
        explanation: "The 'survival of the fittest' phase. It determines which individuals from the current population will be kept as parents for the next generation based on their fitness scores.",
    },
    datasetUrl: {
        title: "Dataset Source",
        explanation: "The raw data used for training and evaluation. In ML tuning, the algorithm uses this data to test how well different model parameters perform.",
    },
    targetColumn: {
        title: "Target Variable",
        explanation: "The specific column in your dataset that you want the model to predict (the dependent variable).",
    },
    mlEvalFunction: {
        title: "ML Evaluation",
        explanation: "The metric used to judge the performance of the machine learning model (e.g., Accuracy, F1-score, or MSE). The EA optimizes this value.",
    },
    individualSize: {
        title: "Individual Size",
        explanation: "The length of the chromosome or the number of genes representing a solution. For example, in bit manipulation, it's the number of bits per individual.",
    },
    minMaxBoundaries: {
        title: "Search Boundaries",
        explanation: "The constraints on the search space. Defines the minimum and maximum values that a gene (or particle position) can take.",
    },
    gpPrimitiveSet: {
        title: "Primitive Set",
        explanation: "The building blocks for Genetic Programs. It includes functions (operators like +, -, *, /) and terminals (constants like 1, 2, or variables like 'x'). Crossing these creates complex tree structures.",
    },
    treeGenerator: {
        title: "Tree Generator",
        explanation: "The algorithm used to create the initial programs. 'genFull' creates balanced trees, while 'genHalfAndHalf' provides a mix of short and deep trees for better diversity.",
    },
    bloatLimits: {
        title: "Bloat Control",
        explanation: "Prevents programs from growing excessively large without improving fitness. By setting a height limit, we ensure the solutions remain computationally efficient and readable.",
    }
};
