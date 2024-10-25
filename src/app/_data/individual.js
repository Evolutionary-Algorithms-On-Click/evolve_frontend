export const individualList = [
    "binaryString",
    "permutation",
    "float",
    "int"
];

export function validateIndividualList(individualList) {
    return individualList.includes(individualList);
}

export const individualData = [
    {
        'name' : 'binaryString',
        'description': 'A random binary string of 0s and 1s.'
    },
    {
        'name': 'permutation',
        'description': 'A permutation of integers to form unique individuals.'
    },
    {
        'name' : 'float',
        'description': 'A floating-point individual with a specified range.'
    },
    {
        'name' : 'int',
        'description' : 'An integer individual within a specified range.'
    }
]


