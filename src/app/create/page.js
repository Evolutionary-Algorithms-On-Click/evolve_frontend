"use client";

import { useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import { algorithmData } from "../_data/algorithms"
import { individualData } from "../_data/individual";
import { populationFunctionData } from "../_data/populationFunction";
import { mateData } from "../_data/mate";
import { mutationData } from "../_data/mutation";
import { selectionData } from "../_data/selection";
import { useRouter } from "next/navigation";
import { evalFuncData } from "../_data/evaluation";

export default function CreateInstance() {
    const [currentStep, setCurrentStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)

    const [algo, setAlgo] = useState(null)
    const [mu, setMu] = useState(null)
    const [lambda, setLambda] = useState(null)

    const [parameters, setParameters] = useState([])
    const [tempParamWeight, setTempParamWeight] = useState(null)

    const [indGen, setIndGen] = useState(null)
    const [randomRangeStart, setRandomRangeStart] = useState(null)
    const [randomRangeEnd, setRandomRangeEnd] = useState(null)

    const [indSize, setIndSize] = useState(null)

    const [popFunc, setPopFunc] = useState(null)

    const [mateFunc, setMateFunc] = useState(null)

    const [mutateFunc, setMutateFunc] = useState(null)

    const [selectFunc, setSelectFunc] = useState(null)
    const [k, setK] = useState(null)
    const [tempTourSize, setTempTourSize] = useState(null)
    const isValidSelectFunc = () => {
        if (selectFunc === "selTournament") {
            return tempTourSize ? true : false
        }
        return selectFunc ? true : false
    }

    const [evalFunc, setEvalFunc] = useState(null)

    const [populationSize, setPopulationSize] = useState(5000)
    const [generations, setGenerations] = useState(10)
    const [cxpb, setCxpb] = useState(0.5)
    const [mutpb, setMutpb] = useState(0.2)
    const [hof, setHof] = useState(5)

    const router = useRouter();

    /*
        algorithm: str
        individual: str
        populationFunction: str
        evaluationFunction: str
        populationSize: int
        generations: int
        cxpb: float
        mutpb: float
        weights: tuple
        individualSize: int
        indpb: float
        randomRange: list
        crossoverFunction: str
        mutationFunction: str
        selectionFunction: str
        tournamentSize: Optional[int] = None
        mu: Optional[int] = None
        lambda_: Optional[int] = None
        hofSize: Optional[int] = 1
    */

    const runAlgorithm = async () => {
        const inputData = {
            "algorithm": algo.toString(),
            "individual": indGen.toString(),
            "populationFunction": popFunc.toString(),
            "evaluationFunction": evalFunc.toString(),
            "populationSize": parseInt(populationSize ?? 5000),
            "generations": parseInt(generations ?? 10),
            "cxpb": parseFloat(cxpb ?? 0.5),
            "mutpb": parseFloat(mutpb ?? 0.2),
            "weights": parameters.map((param) => parseFloat(param)),
            "individualSize": parseInt(indSize ?? 10),
            "indpb": 0.05,
            "randomRange": [parseInt(randomRangeStart ?? 0), parseInt(randomRangeEnd ?? 100)],
            "crossoverFunction": mateFunc ? mateFunc.toString() : "cxOnePoint",
            "mutationFunction": mutateFunc ? mutateFunc.toString() : "mutFlipBit",
            "selectionFunction": selectFunc ? selectFunc.toString() : "selRoulette",
            "tournamentSize": parseInt(tempTourSize ?? 2),
            "mu": parseInt(mu ?? 1),
            "lambda_": parseInt(lambda ?? 1),
            "hofSize": parseInt(hof ?? 5)
        }

        const response = await fetch((process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? "http://localhost:8000") +"/api/runAlgo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(inputData)
        });

        /*
        {
            "message": "Run Algorithm",
            "runId": "614ae929-f585-4140-84f8-abaf41644661",
            "data": {
                "generation": [
                ],
                "average": [
                ],
                "minimum": [
                ],
                "maximum": [
                ]
            },
            "plots": {
                "fitnessPlot": "http://localhost:8000/api/plots/614ae929-f585-4140-84f8-abaf41644661/fitness_plot.png",
                "mutationCrossoverEffectPlot": "http://localhost:8000/api/plots/614ae929-f585-4140-84f8-abaf41644661/mutation_crossover_effect.png"
            },
            "population": "http://localhost:8000/api/population/614ae929-f585-4140-84f8-abaf41644661/population.pkl",
            "hallOfFame": [
                {
                    "individual": [
                    ],
                    "fitness": [
                    ]
                }
            ]
        }
        */

        switch (response.status) {
            case 200:
                let data = await response.json()
                let executionHistory = await localStorage.getItem("executionHistory");

                data.inputData = inputData

                if (executionHistory) {
                    executionHistory = JSON.parse(executionHistory)
                    executionHistory.push(data)
                }

                await localStorage.setItem("executionHistory", JSON.stringify([data]))
                await localStorage.setItem(data.runId, JSON.stringify(data))

                router.push(`/bin/${data.runId}`)

                break;
            default:
                alert("Error running algorithm.")
        }
    }

    return isLoading ? 
    (
        <main className="flex flex-col items-center justify-center min-h-screen w-full">
            <CircularProgress color="inherit" />
            <p className="text-xs mt-4">Running Algorithm...</p>
        </main>
    )
    :
    (
        <main className="items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-mono)] p-8">
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold">
                    Evolve OnClick
                </h1>
                <p>Run and Visualize algorithms with just a click.</p>
            </div>

            <div className="flex flex-wrap mt-16 gap-4">
                {/* 
                    Section will have a div representing selected values.
                */}
                <div className="flex flex-col items-start border border-gray-400 rounded-2xl p-4 min-w-16 h-fit md:sticky top-4">
                    <h3 className="text-xl font-bold">Config Summary</h3>
                    <div className="flex flex-col">
                        <div className="mt-4">
                            <h4 className="text-lg font-semibold">Algorithm</h4>
                            <code className="bg-foreground p-1 rounded-lg text-background">{algo || "None"}</code>
                        </div>

                        {currentStep >= 2 ? <hr className="my-4" /> : null}


                        {currentStep >= 2 && (
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold">Weights</h4>
                                {parameters.length > 0 ? (
                                    <table className="w-full text-center">
                                        <tbody>
                                            {parameters.map((param, index) => (
                                                <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                                                    <td className="border-b border-gray-300 p-2">
                                                        <p className="font-bold">{param + ".0"}</p>
                                                        <p className="font-extralight">dim_{index + 1}</p>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (<p>None</p>)}
                            </div>
                        )}

                        {indGen ? <hr className="mt-4" /> : null}


                        {indGen && (
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold">Individual Generator</h4>
                                <code className="bg-foreground p-1 rounded-lg text-background">{indGen}</code>
                            </div>
                        )}

                        {indSize ? <hr className="mt-4" /> : null}

                        {indSize && (
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold">Individual Size</h4>
                                <code className="bg-foreground p-1 rounded-lg text-background">{indSize}</code>
                            </div>
                        )}

                        {popFunc ? <hr className="mt-4" /> : null}

                        {popFunc && (
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold">Population Function</h4>
                                <code className="bg-foreground p-1 rounded-lg text-background">{popFunc}</code>
                            </div>
                        )}

                        {mateFunc ? <hr className="mt-4" /> : null}

                        {mateFunc && (
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold">Mating Function</h4>
                                <code className="bg-foreground p-1 rounded-lg text-background">{mateFunc}</code>
                            </div>
                        )}

                        {mutateFunc ? <hr className="mt-4" /> : null}

                        {mutateFunc && (
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold">Mutation Function</h4>
                                <code className="bg-foreground p-1 rounded-lg text-background">{mutateFunc}</code>
                            </div>
                        )}

                        {selectFunc ? <hr className="mt-4" /> : null}

                        {selectFunc && (
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold">Selection Function</h4>
                                <code className="bg-foreground p-1 rounded-lg text-background">{selectFunc}</code>
                                <p className="font-extralight">K = {k}</p>
                                {selectFunc === "selTournament" && <p className="font-extralight">Tournament Size = {tempTourSize}</p>}
                            </div>
                        )}

                        {evalFunc ? <hr className="mt-4" /> : null}

                        {evalFunc && (
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold">Evaluation Function</h4>
                                <code className="bg-foreground p-1 rounded-lg text-background">{evalFunc}</code>
                            </div>
                        )}

                    </div>
                </div>

                {/* Section will have the dynamic form */}
                <div className="border border-gray-400 rounded-2xl p-4 min-w-[40%] max-w-[70%]">
                    <form className="flex flex-col">
                        <h3 className="text-xl font-bold">Create Instance</h3>

                        <hr className="my-4" />

                        {currentStep >= 1 && (
                            <div className="my-4">
                                <h4 className="text-lg font-bold mb-8">Step 1: Choose Algorithm</h4>
                                {/* grid: each element has a name and description */}
                                <div className="grid grid-cols-2 gap-4 align-top">
                                    {algorithmData.map((algorithm, index) => (
                                        <button onClick={(e) => {
                                            e.preventDefault()
                                            setAlgo(algorithm.name)

                                            if (["eaMuPlusLambda", "eaMuCommaLambda"].includes(algorithm.name) && mu && lambda) {
                                                setCurrentStep(currentStep < 2 ? 2 : currentStep)
                                            } else if (!["eaMuPlusLambda", "eaMuCommaLambda"].includes(algorithm.name)) {
                                                setCurrentStep(currentStep < 2 ? 2 : currentStep)
                                            }
                                        }} key={index} className={"border border-gray-300 p-4 rounded-lg max-w-xl text-left items-start min-w-2/3" + (algo && (algo === algorithm.name) ? " bg-foreground text-background" : "")}>
                                            <h5 className="text-lg font-bold">{algorithm.name}</h5>
                                            <p>{algorithm.description}</p>
                                        </button>
                                    ))}
                                </div>


                                {algo && (algo === "eaMuPlusLambda" || algo === "eaMuCommaLambda") && (
                                    <div className="mt-4">
                                        <h5 className="text-lg font-bold mb-4">Step 1.1: Configure Mu and Lambda</h5>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h6 className="text-lg font-bold mb-4">Mu</h6>
                                                <input type="number" value={mu} className="border border-gray-300 p-2 rounded-lg" placeholder="Enter a number" onChange={(e) => {
                                                    setMu(e.target.value)

                                                    if (lambda && e.target.value) {
                                                        setCurrentStep(currentStep < 2 ? 2 : currentStep)
                                                    }

                                                }} />
                                            </div>
                                            <div>
                                                <h6 className="text-lg font-bold mb-4">Lambda</h6>
                                                <input type="number" value={lambda} className="border border-gray-300 p-2 rounded-lg" placeholder="Enter a number" onChange={(e) => {
                                                    setLambda(e.target.value)

                                                    if (mu && e.target.value) {
                                                        setCurrentStep(currentStep < 2 ? 2 : currentStep)
                                                    }

                                                }} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {currentStep >= 2 && (
                            <div className="mt-4">
                                <h4 className="text-lg font-bold mb-8">Step 2: Parameters to optimize (weights)</h4>
                                {/* Parameter {'name': 'paramName', 'weight': <1.0/-1.0> (maximize/minimize)} 
                                    UI split into two halves, add param to right. left is a list of added params.
                                */}

                                <div className="grid grid-cols-2 gap-8 justify-items-stretch align-top">
                                    <div className="flex flex-col border border-foreground border-solid p-3 rounded-3xl w-full h-fit">
                                        <h5 className="text-lg font-bold mb-3">Add Parameter</h5>

                                        <div className="flex gap-0 items-center my-2">
                                            <button onClick={(e) => {
                                                e.preventDefault()
                                                setTempParamWeight(1.0)
                                            }} className={"p-1 rounded-l-xl w-full border border-foreground" + (tempParamWeight === 1.0 ? " bg-foreground text-background" : "")}>
                                                <p>Maximize</p>
                                                <p className="font-extralight">(weight = +1.0)</p>
                                            </button>
                                            <button onClick={(e) => {
                                                e.preventDefault()
                                                setTempParamWeight(-1.0)
                                            }} className={"p-1 rounded-r-xl w-full border border-foreground" + (tempParamWeight === -1.0 ? " bg-foreground text-background" : "")}>
                                                <p>Minimize</p>
                                                <p className="font-extralight">(weight = -1.0)</p>
                                            </button>
                                        </div>

                                        <button onClick={(e) => {
                                            e.preventDefault()
                                            if (tempParamWeight === null) {
                                                alert("Please select whether to maximize/minimize.")
                                                return
                                            }
                                            setParameters([...parameters, tempParamWeight])
                                            setTempParamWeight(null)
                                        }} className="bg-foreground text-background p-1 rounded-2xl">Add</button>
                                    </div>
                                    <div className="flex flex-col">
                                        <h5 className="text-lg font-bold">Optimization Parameters</h5>

                                        <table className="w-full text-center">
                                            <thead>
                                                <tr>
                                                    <th className="border-b-2 border-gray-300 p-2">Weight</th>
                                                    <th className="border-b-2 border-gray-300 p-2">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {parameters.map((param, index) => (
                                                    <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                                                        <td className="border-b border-gray-300 p-2">
                                                            <p className="font-bold">{param + ".0"}</p>
                                                            <p className="font-extralight">{`dim_${index + 1}`}</p>
                                                        </td>
                                                        <td className="border-b border-gray-300 p-2">
                                                            <button onClick={(e) => {
                                                                e.preventDefault()
                                                                setParameters(parameters.filter((_, i) => i !== index))
                                                                setCurrentStep(currentStep > 2 ? 2 : currentStep)
                                                            }} className="bg-foreground text-background p-1 rounded-lg">Remove</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {parameters.length > 0 && (
                            <div className="mt-16">
                                <h4 className="text-lg font-bold mb-8">Step 3: Choose an individual generator function.</h4>
                                {/* grid: each element has a name and description */}
                                <div className="grid grid-cols-2 gap-4 align-top">
                                    {individualData.map((ind, index) => (
                                        <button onClick={(e) => {
                                            e.preventDefault()
                                            setIndGen(ind.name)

                                            if (["floatingPoint", "integer"].includes(ind.name)) {
                                                setRandomRangeStart(null)
                                                setRandomRangeEnd(null)
                                            } else {
                                                setRandomRangeStart("0")
                                                setRandomRangeEnd("0")
                                                setCurrentStep(currentStep < 3 ? 3 : currentStep)
                                            }

                                        }} key={index} className={"border border-gray-300 p-4 rounded-lg max-w-xl text-left items-start min-w-2/3" + (indGen && (indGen === ind.name) ? " bg-foreground text-background" : "")}>
                                            <h5 className="text-lg font-bold">{ind.name}</h5>
                                            <p>{ind.description}</p>
                                        </button>
                                    ))}
                                </div>

                                {indGen && ["floatingPoint", "integer"].includes(indGen) && (
                                    <div className="mt-4">
                                        <h5 className="text-lg font-bold mb-4">Step 3.1: Random Range</h5>
                                        <div className="flex gap-4">
                                            <input type="number" className="border border-gray-300 p-2 rounded-lg" placeholder="Start" onChange={(e) => {
                                                setRandomRangeStart(e.target.value)

                                                if (randomRangeEnd && e.target.value) {
                                                    setCurrentStep(currentStep < 3 ? 3 : currentStep)
                                                }
                                            }} />
                                            <input type="number" className="border border-gray-300 p-2 rounded-lg" placeholder="End" onChange={(e) => {
                                                setRandomRangeEnd(e.target.value)

                                                if (randomRangeStart && e.target.value) {
                                                    setCurrentStep(currentStep < 3 ? 3 : currentStep)
                                                }
                                            }} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {currentStep >= 3 && randomRangeEnd && randomRangeStart && (
                            <div className="mt-16">
                                <h4 className="text-lg font-bold mb-4">Step 4: Size of the Individual list?</h4>
                                <input type="number" value={indSize} className="border border-gray-300 p-2 rounded-lg" placeholder="Enter a number" onChange={(e) => {
                                    setIndSize(e.target.value)
                                }} />
                            </div>
                        )}

                        {indSize > 0 && (
                            <div className="mt-16">
                                <h4 className="text-lg font-bold mb-4">Step 5: Choose a population function.</h4>
                                {/* grid: each element has a name and description */}
                                <div className="grid grid-cols-2 gap-4 align-top">
                                    {populationFunctionData.map((pop, index) => (
                                        <button onClick={(e) => {
                                            e.preventDefault()
                                            setPopFunc(pop.name)
                                            setCurrentStep(currentStep < 4 ? 4 : currentStep)
                                        }} key={index} className={"border border-gray-300 p-4 rounded-lg max-w-xl text-left items-start min-w-2/3" + (popFunc && (popFunc === pop.name) ? " bg-foreground text-background" : "")}>
                                            <h5 className="text-lg font-bold">{pop.name}</h5>
                                            <p>{pop.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {currentStep >= 4 && (
                            <div className="mt-16">
                                <h4 className="text-lg font-bold mb-4">Step 6: Choose a mating function.</h4>
                                {/* grid: each element has a name and description */}
                                <div className="grid grid-cols-2 gap-4 align-top">
                                    {mateData.map((mate, index) => (
                                        <button onClick={(e) => {
                                            e.preventDefault()
                                            setMateFunc(mate.name)
                                            setCurrentStep(currentStep < 5 ? 5 : currentStep)
                                        }} key={index} className={"border border-gray-300 p-4 rounded-lg max-w-xl text-left items-start min-w-2/3" + (mateFunc && (mateFunc === mate.name) ? " bg-foreground text-background" : "")}>
                                            <h5 className="text-lg font-bold">{mate.name}</h5>
                                            <p>{mate.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {currentStep >= 5 && (
                            <div className="mt-16">
                                <h4 className="text-lg font-bold mb-4">Step 7: Choose a mutation function.</h4>
                                {/* grid: each element has a name and description */}
                                <div className="grid grid-cols-2 gap-4 align-top">
                                    {mutationData.map((mut, index) => (
                                        <button onClick={(e) => {
                                            e.preventDefault()
                                            setMutateFunc(mut.name)
                                            setCurrentStep(currentStep < 6 ? 6 : currentStep)
                                        }} key={index} className={"border border-gray-300 p-4 rounded-lg max-w-xl text-left items-start min-w-2/3" + (mutateFunc && (mutateFunc === mut.name) ? " bg-foreground text-background" : "")}>
                                            <h5 className="text-lg font-bold">{mut.name}</h5>
                                            <p>{mut.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {currentStep >= 6 && (
                            <div className="mt-16">
                                <h4 className="text-lg font-bold mb-4">Step 8: Choose a selection function.</h4>

                                <div className="grid grid-cols-2 gap-4 align-top">
                                    {selectionData.map((sel, index) => (
                                        <button onClick={(e) => {
                                            e.preventDefault()
                                            setSelectFunc(sel.name)
                                            setCurrentStep(currentStep < 7 ? 7 : currentStep)
                                        }} key={index} className={"border border-gray-300 p-4 rounded-lg max-w-xl text-left items-start min-w-2/3" + (selectFunc && (selectFunc === sel.name) ? " bg-foreground text-background" : "")}>
                                            <h5 className="text-lg font-bold">{sel.name}</h5>
                                            <p>{sel.description}</p>
                                        </button>
                                    ))}
                                </div>

                                {/* <div className="mt-4">
                                    <h5 className="text-lg font-bold mb-4">K</h5>
                                    <input type="number" value={k} className="border border-gray-300 p-2 rounded-lg" placeholder="Enter a number" onChange={(e) => {
                                        setK(e.target.value)
                                    }} />
                                </div> */}

                                {selectFunc === "selTournament" && (
                                    <div className="mt-4">
                                        <h5 className="text-lg font-bold mb-4">Tournament Size</h5>
                                        <input type="number" value={tempTourSize} className="border border-gray-300 p-2 rounded-lg" placeholder="Enter a number" onChange={(e) => {
                                            setTempTourSize(e.target.value)
                                        }} />
                                    </div>
                                )}
                            </div>
                        )}

                        {isValidSelectFunc() && (
                            <div className="mt-16">
                                <h4 className="text-lg font-bold mb-4">Step 9: Choose an evaluation function</h4>
                                <div className="grid grid-cols-2 gap-4 align-top">
                                    {evalFuncData.map((evalF, index) => (
                                        <button onClick={(e) => {
                                            e.preventDefault()
                                            setEvalFunc(evalF.name)
                                            setCurrentStep(currentStep < 8 ? 8 : currentStep)
                                        }} key={index} className={"border border-gray-300 p-4 rounded-lg max-w-xl text-left items-start min-w-2/3" + (evalFunc && (evalFunc === evalF.name) ? " bg-foreground text-background" : "")}>
                                            <h5 className="text-lg font-bold">{evalF.name}</h5>
                                            <p>{evalF.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {currentStep >= 8 && (
                            <div className="mt-16">
                                {/* 
                                poputlationSize=5000,
                                generations=10,
                                cxpb=0.5,
                                mutpb=0.2 
                                */}

                                <h4 className="text-lg font-bold mb-4">Step 10: Configure Genetic Algorithm</h4>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h5 className="text-lg font-bold mb-4">Population Size</h5>
                                        <input type="number" value={populationSize} className="border border-gray-300 p-2 rounded-lg" placeholder="Enter a number" onChange={(e) => {
                                            setPopulationSize(e.target.value)
                                        }} />
                                    </div>
                                    <div>
                                        <h5 className="text-lg font-bold mb-4">Generations</h5>
                                        <input type="number" value={generations} className="border border-gray-300 p-2 rounded-lg" placeholder="Enter a number" onChange={(e) => {
                                            setGenerations(e.target.value)
                                        }} />
                                    </div>
                                    <div>
                                        <h5 className="text-lg font-bold mb-4">Crossover Probability</h5>
                                        <input type="number" value={cxpb} className="border border-gray-300 p-2 rounded-lg" placeholder="Enter a number" onChange={(e) => {
                                            setCxpb(e.target.value)
                                        }} />
                                    </div>
                                    <div>
                                        <h5 className="text-lg font-bold mb-4">Mutation Probability</h5>
                                        <input type="number" value={mutpb} className="border border-gray-300 p-2 rounded-lg" placeholder="Enter a number" onChange={(e) => {
                                            setMutpb(e.target.value)
                                        }} />
                                    </div>
                                    <div>
                                        <h5 className="text-lg font-bold mb-4">Hall of Fame Size</h5>
                                        <input type="number" value={hof} className="border border-gray-300 p-2 rounded-lg" placeholder="Enter a number" onChange={(e) => {
                                            setHof(e.target.value)
                                        }} />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <button className="bg-foreground text-background p-2 rounded-lg" onClick={(e) => {
                                        e.preventDefault()
                                        setIsLoading(true)
                                        runAlgorithm().then(() => {
                                            console.log("Algorithm executed.")
                                            setIsLoading(false)
                                        })
                                    }}>Execute Algorithm</button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </main>
    )
}