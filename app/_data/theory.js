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
    weights: {
        title: "Weights",
        explanation: "Defines the importance of different objectives. In search, positive weights indicate maximization, while negative weights indicate minimization.",
    },
    dimensions: {
        title: "Dimensions",
        explanation: "The number of variables or parameters that the algorithm is trying to optimize simultaneously.",
    },
    phi1: {
        title: "Cognitive Coefficient (φ1)",
        explanation: "In PSO, this scales the influence of a particle's personal best performance on its current velocity.",
    },
    phi2: {
        title: "Social Coefficient (φ2)",
        explanation: "In PSO, this scales the influence of the swarm's global best performance on a particle's current velocity.",
    },
    individualSize: {
        title: "Individual Size",
        explanation: "The number of elements (genes) within a single solution candidate. This corresponds to the complexity of the solution.",
    },
    gpPrimitiveSet: {
        title: "Primitive Set",
        explanation: "The building blocks for Genetic Programs. It includes functions (operators like +, -, *, /) and terminals (constants or variables).",
    },
    treeGenerator: {
        title: "Tree Generator",
        explanation: "The algorithm used to create the initial programs. 'genFull' creates balanced trees, while 'genHalfAndHalf' provides a mix of short and deep trees.",
    },
    bloatLimits: {
        title: "Bloat Control",
        explanation: "Prevents programs from growing excessively large without improving fitness, ensuring solutions remain efficient.",
    },
    datasetUrl: {
        title: "Dataset URL",
        explanation: "The source location of your training data. For ML tuning, we fetch this data to evaluate the evolved hyperparameter sets.",
    },
    targetColumn: {
        title: "Target Column",
        explanation: "The variable your model is trying to predict (the label or dependent variable).",
    },
    mlEvalFunction: {
        title: "ML Evaluation Function",
        explanation: "The metric (like Accuracy, F1-Score, or MSE) used to determine how well your evolved model performs on the dataset.",
    },
    algorithmStrategy: {
        title: "Algorithm Strategy",
        explanation: "The core evolutionary logic. Simple EA uses a basic generation loop, while Mu+Lambda and Mu,Lambda handle parent-child populations differently based on elitism and survival.",
    },
    matingFunction: {
        title: "Mating (Crossover) Function",
        explanation: "How parent individuals combine their genetic material to create offspring. Standard operators include One-Point, Two-Point, and Uniform crossover.",
    },
    mutationFunction: {
        title: "Mutation Function",
        explanation: "Randomly modifies parts of an individual's genetic code to maintain diversity and find new search areas. Common methods include bit-flip, Gaussian, and shuffle mutation.",
    },
    selectionFunction: {
        title: "Selection Function",
        explanation: "The process of choosing the fittest individuals from the current population to serve as parents for the next generation. Methods like Tournament or Roulette selection favor better solutions while maintaining diversity.",
    },
    initializationFunction: {
        title: "Initialization Function",
        explanation: "Defines how the first generation (population) is created. This could be random tree generation for GP or random value assignments for EAs, ensuring enough diversity to start the search.",
    },
    gpEquation: {
        title: "Target Equation",
        explanation: "The mathematical model your Genetic Program is trying to discover. By defining this, we can calculate the 'Fitness' of each evolved program by comparing its symbolic output to this target.",
    },
    individualGenerator: {
        title: "Individual Generator",
        explanation: "Determines the data format of each individual solution. Floating Point is best for real-valued Optimization, Integers for discrete steps, and Bit-Sets for binary problems.",
    },
    psoBenchmark: {
        title: "Evaluation (Benchmark) Function",
        explanation: "The mathematical landscape the particles are searching. Spheres are simple and unimodal, while Ackley or Rastrigin functions are complex and multimodal, testing the swarm's ability to escape local optima.",
    }
};
