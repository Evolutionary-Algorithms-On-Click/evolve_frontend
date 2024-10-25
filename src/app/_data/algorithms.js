export const algorithmList = [
    "eaSimple",
    "eaMuPlusLambda",
    "eaMuCommaLambda",
    "eaGenerateUpdate",
]

export function validateAlgorithm(algorithm) {
    return algorithmList.includes(algorithm)
}

export const algorithmData = [
    {
        'name': 'eaSimple',
        'description': 'The simplest evolutionary algorithm that uses a generational model.',
        'parameters': {
            'toolbox': 'A Toolbox that contains the evolution operators.',
            'cxpb': 'The probability of mating two individuals.',
            'mutpb': 'The probability of mutating an individual.',
            'ngen': 'The number of generations.',
            'stats': 'A Statistics object that is updated each generation.',
            'halloffame': 'A HallOfFame object that contains the best individuals.',
            'verbose': 'Whether to log the output.',
        },
    },
    {
        'name': 'eaMuPlusLambda',
        'description': 'An evolutionary algorithm that uses a mu+lambda model.',
        'parameters': {
            'toolbox': 'A Toolbox that contains the evolution operators.',
            'mu': 'The number of individuals to select for the next generation.',
            'lambda_': 'The number of children to produce at each generation.',
            'cxpb': 'The probability of mating two individuals.',
            'mutpb': 'The probability of mutating an individual.',
            'ngen': 'The number of generations.',
            'stats': 'A Statistics object that is updated each generation.',
            'halloffame': 'A HallOfFame object that contains the best individuals.',
            'verbose': 'Whether to log the output.',
        },
    },
    {
        'name': 'eaMuCommaLambda',
        'description': 'An evolutionary algorithm that uses a mu,lambda model.',
        'parameters': {
            'toolbox': 'A Toolbox that contains the evolution operators.',
            'mu': 'The number of individuals to select for the next generation.',
            'lambda_': 'The number of children to produce at each generation.',
            'cxpb': 'The probability of mating two individuals.',
            'mutpb': 'The probability of mutating an individual.',
            'ngen': 'The number of generations.',
            'stats': 'A Statistics object that is updated each generation.',
            'halloffame': 'A HallOfFame object that contains the best individuals.',
            'verbose': 'Whether to log the output.',
        },
    },
    {
        'name': 'eaGenerateUpdate',
        'description': 'An evolutionary algorithm that uses a generate-update model.',
        'parameters': {
            'toolbox': 'A Toolbox that contains the evolution operators.',
            'mu': 'The number of individuals to select for the next generation.',
            'lambda_': 'The number of children to produce at each generation.',
            'cxpb': 'The probability of mating two individuals.',
            'mutpb': 'The probability of mutating an individual.',
            'ngen': 'The number of generations.',
            'stats': 'A Statistics object that is updated each generation.',
            'halloffame': 'A HallOfFame object that contains the best individuals.',
            'verbose': 'Whether to log the output.',
        },
    },
]