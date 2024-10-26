export const populationFunctions = [
    "initRepeat",
    // "initIterate",
    // "initCycle"
];

export function validatePopulationFunction(popFunction) {
    return populationFunctions.includes(popFunction);
}

export const populationFunctionData = [
    {
        'name' : 'initRepeat',
        'description' : 'Creates a population by repeating an individual generator function.'
        
    },
    // {
    //     'name' : 'initIterate',
    //     'description': 'Initializes individuals in a population by iterating over an iterable.'
        
    // },
    // {
    //     'name' : 'initCycle',
    //     'description': 'Initializes individuals by cycling through values until the population is filled.'
        
    // }
]


