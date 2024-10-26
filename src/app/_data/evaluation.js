export const evalFuncList = ["evalOneMax", "evalProduct", "evalDifference"]

export function validateEvalFunc(evalFunc) {
  return evalFuncList.includes(evalFunc)
}

export const evalFuncData = [
    {
        name: "evalOneMax",
        description: "Count the number of 1s in the individual"
    },
    {
        name: "evalProduct",
        description: "Multiply the values of the individual"
    },
    {
        name: "evalDifference",
        description: "Subtract the values of the individual"
    }
]