"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "../../_components/Loader";
import { ChooseAlgo } from "./_components/chooseAlgorithm";
import ChooseWeights from "./_components/chooseWeights";
import ChooseGenerator from "./_components/chooseGenerator";
import { GetIndividualSize } from "./_components/getIndividualSize";
import ChoosePopulationFunction from "./_components/choosePopulationFunction";
import ChooseMatingFunction from "./_components/chooseMatingFunction";
import ChooseSelectionFunction from "./_components/chooseSelectionFunction";
import ChooseEvalFunction from "./_components/chooseEvaluationFunction";
import ConfigureAlgoParams from "./_components/configureAlgoParams";
import Preview from "./_components/preview";
import ChooseMutationFunction from "./_components/chooseMutateFunction";

export default function ConfigureNonGP() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Algorithm Parameters.
    const [chosenAlgo, setChosenAlgo] = useState(null);
    const [mu, setMu] = useState(0);
    const [lambda, setLambda] = useState(0);

    // Weights parameters.
    const [parameters, setParameters] = useState([]);

    // Individual Generator.
    const [indGen, setIndGen] = useState(null);
    const [randomRangeStart, setRandomRangeStart] = useState("");
    const [randomRangeEnd, setRandomRangeEnd] = useState("");

    // Individual Size.
    const [indSize, setIndSize] = useState(0);

    // Population Function.
    const [popFunc, setPopFunc] = useState(null);

    // Mating Function.
    const [matingFunc, setMatingFunc] = useState(null);

    // Mutation Function.
    const [mutateFunc, setMutateFunc] = useState(null);

    // Selection Function.
    const [selectFunc, setSelectFunc] = useState(null);
    const [tempTourSize, setTempTourSize] = useState(0);

    // Evaluation Function.
    const [evalFunc, setEvalFunc] = useState(null);

    // Algorithm Parameters.
    const [populationSize, setPopulationSize] = useState(5000);
    const [generations, setGenerations] = useState(10);
    const [cxpb, setCxpb] = useState(0.5);
    const [mutpb, setMutpb] = useState(0.2);
    const [hof, setHof] = useState(0);

    const router = useRouter();

    useEffect(() => {
        if (chosenAlgo !== "eaMuPlusLambda" && chosenAlgo !== "eaMuCommaLambda") {
            if (parameters.length > 0 && currentStep < 3) {
                setCurrentStep(3);
            }
        }
    }, [currentStep])

    const runAlgorithm = async () => {
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

        const response = await fetch((process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? "http://localhost:8000") + "/api/runAlgo", {
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
                let executionHistory = localStorage.getItem("executionHistory");

                data.inputData = inputData

                if (executionHistory) {
                    executionHistory = JSON.parse(executionHistory)
                    executionHistory.push(data)
                }

                localStorage.setItem("executionHistory", JSON.stringify([data]))
                localStorage.setItem(data.runId, JSON.stringify(data))

                router.push(`/bin/${data.runId}`)

                break;
            default:
                alert("Error running algorithm.")
        }
    }

    return isLoading ? <Loader type={"full"} message={"Running Algorithm..."} /> : (
        <main className="items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-mono)] p-8">
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold">
                    Evolve OnClick
                </h1>
                <p>Run and Visualize algorithms with just a click.</p>
            </div>

            <div className="flex flex-wrap mt-16 gap-4">
                <Preview
                    algo={chosenAlgo}
                    parameters={parameters}
                    indGen={indGen}
                    indSize={indSize}
                    popFunc={popFunc}
                    mateFunc={matingFunc}
                    mutateFunc={mutateFunc}
                    selectFunc={selectFunc}
                    evalFunc={evalFunc}
                    tempTourSize={tempTourSize}
                />

                <div className="border border-gray-400 rounded-2xl p-4 min-w-[40%] max-w-[70%]">
                    <form className="flex flex-col">
                        <h3 className="text-xl font-bold">Configure Algorithm</h3>
                        <hr className="my-4" />

                        {currentStep >= 1 && (
                            <ChooseAlgo
                                chosenAlgo={chosenAlgo}
                                setChosenAlgo={setChosenAlgo}
                                currentStep={currentStep}
                                nextStep={2}
                                setCurrentStep={setCurrentStep}
                                mu={mu}
                                setMu={setMu}
                                lambda={lambda}
                                setLambda={setLambda}
                            />
                        )}

                        {currentStep >= 2 && (
                            <ChooseWeights
                                currentStep={currentStep}
                                nextStep={3}
                                setCurrentStep={setCurrentStep}
                                parameters={parameters}
                                setParameters={setParameters}
                            />
                        )}

                        {parameters.length > 0 && currentStep >= 3 && (
                            <ChooseGenerator
                                indGen={indGen}
                                setIndGen={setIndGen}
                                randomRangeStart={randomRangeStart}
                                setRandomRangeStart={setRandomRangeStart}
                                randomRangeEnd={randomRangeEnd}
                                setRandomRangeEnd={setRandomRangeEnd}
                                currentStep={currentStep}
                                setCurrentStep={setCurrentStep}
                                nextStep={4}
                            />
                        )}

                        {currentStep >= 4 && indGen && randomRangeStart && randomRangeEnd && (parseInt(randomRangeStart) <= parseInt(randomRangeEnd)) && (
                            <GetIndividualSize
                                indSize={indSize}
                                setIndSize={setIndSize}
                                currentStep={currentStep}
                                nextStep={5}
                                setCurrentStep={setCurrentStep}
                            />
                        )}

                        {(currentStep >= 5 && indSize) && (
                            <ChoosePopulationFunction
                                popFunc={popFunc}
                                setPopFunc={setPopFunc}
                                currentStep={currentStep}
                                nextStep={6}
                                setCurrentStep={setCurrentStep}
                            />
                        )}

                        {(currentStep >= 6 && popFunc) && (
                            <ChooseMatingFunction
                                mateFunc={matingFunc}
                                setMateFunc={setMatingFunc}
                                currentStep={currentStep}
                                nextStep={7}
                                setCurrentStep={setCurrentStep}
                            />
                        )}

                        {(currentStep >= 7 && matingFunc) && (
                            <ChooseMutationFunction
                                mutateFunc={mutateFunc}
                                setMutateFunc={setMutateFunc}
                                currentStep={currentStep}
                                nextStep={8}
                                setCurrentStep={setCurrentStep}
                            />
                        )}

                        {(currentStep >= 8 && matingFunc) && (
                            <ChooseSelectionFunction
                                selectFunc={selectFunc}
                                setSelectFunc={setSelectFunc}
                                currentStep={currentStep}
                                nextStep={9}
                                setCurrentStep={setCurrentStep}
                                tempTourSize={tempTourSize}
                                setTempTourSize={setTempTourSize}
                            />
                        )}

                        {(currentStep >= 9 && selectFunc && (selectFunc !== "selTournament" || (selectFunc === "selTournament" && tempTourSize > 0))) && (
                            <ChooseEvalFunction
                                evalFunc={evalFunc}
                                setEvalFunc={setEvalFunc}
                                currentStep={currentStep}
                                nextStep={10}
                                setCurrentStep={setCurrentStep}
                            />
                        )}

                        {(currentStep >= 10 && evalFunc) && (
                            <ConfigureAlgoParams
                                populationSize={populationSize}
                                setPopulationSize={setPopulationSize}
                                generations={generations}
                                setGenerations={setGenerations}
                                cxpb={cxpb}
                                setCxpb={setCxpb}
                                mutpb={mutpb}
                                setMutpb={setMutpb}
                                hof={hof}
                                setHof={setHof}
                            />
                        )}

                        {(currentStep >= 9 && evalFunc) && (
                            // TODO: Disable button if any of the fields are absent.
                            <div className="mt-4">
                                <button className="bg-foreground text-background p-2 rounded-lg w-full" onClick={(e) => {
                                    e.preventDefault()
                                    setIsLoading(true)
                                    runAlgorithm().then(() => {
                                        console.log("Algorithm executed.")
                                        setIsLoading(false)
                                    })
                                }}>Execute Algorithm</button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </main>
    );
}