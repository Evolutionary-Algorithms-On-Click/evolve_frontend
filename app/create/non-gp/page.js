"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "../../_components/Loader";
import { ChooseAlgo } from "../_components/chooseAlgorithm";
import ChooseWeights from "../_components/chooseWeights";
import ChooseGenerator from "./_components/chooseGenerator";
import { GetIndividualSize } from "./_components/getIndividualSize";
import ChooseInitializationFunction from "../_components/chooseInitializationFunction";
import ChooseMatingFunction from "../_components/chooseMatingFunction";
import ChooseSelectionFunction from "../_components/chooseSelectionFunction";
import ChooseEvalFunction from "./_components/chooseEvaluationFunction";
import ConfigureAlgoParams from "../_components/configureAlgoParams";
import Preview from "../../_components/non-gp/preview";
import ChooseMutationFunction from "../_components/chooseMutateFunction";
import { mutationData } from "@/app/_data/mutation";
import { mateData } from "@/app/_data/mate";
import Link from "next/link";

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
    const [hof, setHof] = useState(5);

    const router = useRouter();

    useEffect(() => {
        if (
            chosenAlgo !== "eaMuPlusLambda" &&
            chosenAlgo !== "eaMuCommaLambda"
        ) {
            if (parameters.length > 0 && currentStep < 3) {
                setCurrentStep(3);
            }
        }
    }, [currentStep]);

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
            algorithm: chosenAlgo.toString(),
            individual: indGen.toString(),
            populationFunction: popFunc.toString(),
            evaluationFunction: evalFunc.toString(),
            populationSize: parseInt(populationSize ?? 5000),
            generations: parseInt(generations ?? 10),
            cxpb: parseFloat(cxpb ?? 0.5),
            mutpb: parseFloat(mutpb ?? 0.2),
            weights: parameters.map((param) => parseFloat(param)),
            individualSize: parseInt(indSize ?? 10),
            indpb: 0.05,
            randomRange: [
                parseInt(randomRangeStart ?? 0),
                parseInt(randomRangeEnd ?? 100),
            ],
            crossoverFunction: matingFunc
                ? matingFunc.toString()
                : "cxOnePoint",
            mutationFunction: mutateFunc ? mutateFunc.toString() : "mutFlipBit",
            selectionFunction: selectFunc
                ? selectFunc.toString()
                : "selRoulette",
            tournamentSize: parseInt(tempTourSize ?? 2),
            mu: parseInt(mu ?? 1),
            lambda_: parseInt(lambda ?? 1),
            hofSize: parseInt(hof ?? 5),
        };

        const response = await fetch(
            (process.env.NEXT_PUBLIC_BACKEND_BASE_URL ??
                "http://localhost:8000") + "/api/runAlgo",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(inputData),
            },
        );

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
                let data = await response.json();
                let executionHistory = localStorage.getItem("executionHistory");

                inputData.runType = "non-gp";
                inputData.runId = data.runId;
                inputData.timestamp = new Date().toISOString();
                data.inputData = inputData;

                if (executionHistory) {
                    executionHistory = JSON.parse(executionHistory);
                    executionHistory.push(data);
                }

                localStorage.setItem(
                    "executionHistory",
                    JSON.stringify(executionHistory ?? [data]),
                );
                localStorage.setItem(data.runId, JSON.stringify(data));

                router.push(`/bin/non-gp/${data.runId}`);

                break;
            default:
                alert("Error running algorithm.");
        }
    };

    return isLoading ? (
        <Loader type={"full"} message={"Running Algorithm..."} />
    ) : (
        <main className="flex flex-col justify-center items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-mono)] p-8">
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-center">
                    Evolve OnClick
                </h1>
                <p>Run and Visualize algorithms with just a click.</p>
            </div>

            <div className="flex flex-row gap-4">
                <Link
                    href="/create/gp"
                    className="rounded-full border border-solid border-black/[.08] transition-colors flex items-center justify-center bg-background text-foreground hover:bg-[#000000] hover:text-background text-sm sm:text-base px-4 py-2 mt-8"
                >
                    ← Go Back
                </Link>
                <Link
                    href="/bin"
                    className="rounded-full border border-solid border-black/[.08] transition-colors flex items-center justify-center bg-background text-foreground hover:bg-[#000000] hover:text-background text-sm sm:text-base px-4 py-2 mt-8"
                >
                    View Previous Runs →
                </Link>
            </div>

            <div className="flex flex-wrap mt-16 gap-4 border border-gray-400 rounded-2xl bg-gray-100 bg-opacity-70">
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
                    currentStep={currentStep}
                    populationSize={populationSize}
                    generations={generations}
                    cxpb={cxpb}
                    mutpb={mutpb}
                    hofSize={hof}
                />

                <div className="border border-gray-400 rounded-2xl p-4 bg-white">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}
                        className="flex flex-col"
                    >
                        <h3 className="text-xl font-bold">
                            Configure Algorithm
                        </h3>
                        <p className="text-sm text-gray-500">Non-GP</p>
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

                        {currentStep >= 4 &&
                            indGen &&
                            randomRangeStart &&
                            randomRangeEnd &&
                            parseInt(randomRangeStart) <=
                                parseInt(randomRangeEnd) && (
                                <GetIndividualSize
                                    indSize={indSize}
                                    setIndSize={setIndSize}
                                    currentStep={currentStep}
                                    nextStep={5}
                                    setCurrentStep={setCurrentStep}
                                />
                            )}

                        {currentStep >= 5 && indSize && (
                            <ChooseInitializationFunction
                                popFunc={popFunc}
                                setPopFunc={setPopFunc}
                                currentStep={currentStep}
                                nextStep={6}
                                setCurrentStep={setCurrentStep}
                            />
                        )}

                        {currentStep >= 6 && popFunc && (
                            <ChooseMatingFunction
                                mateData={mateData}
                                mateFunc={matingFunc}
                                setMateFunc={setMatingFunc}
                                currentStep={currentStep}
                                nextStep={7}
                                setCurrentStep={setCurrentStep}
                            />
                        )}

                        {currentStep >= 7 && matingFunc && (
                            <ChooseMutationFunction
                                mutationData={mutationData}
                                mutateFunc={mutateFunc}
                                setMutateFunc={setMutateFunc}
                                currentStep={currentStep}
                                nextStep={8}
                                setCurrentStep={setCurrentStep}
                            />
                        )}

                        {currentStep >= 8 && matingFunc && (
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

                        {currentStep >= 9 &&
                            selectFunc &&
                            (selectFunc !== "selTournament" ||
                                (selectFunc === "selTournament" &&
                                    tempTourSize > 0)) && (
                                <ChooseEvalFunction
                                    evalFunc={evalFunc}
                                    setEvalFunc={setEvalFunc}
                                    currentStep={currentStep}
                                    nextStep={10}
                                    setCurrentStep={setCurrentStep}
                                />
                            )}

                        {currentStep >= 10 && evalFunc && (
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

                        {currentStep >= 10 && evalFunc && (
                            // TODO: Disable button if any of the fields are absent.
                            <div className="mt-4">
                                <button
                                    className="bg-foreground text-background p-2 rounded-lg w-full"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsLoading(true);
                                        runAlgorithm().then(() => {
                                            setIsLoading(false);
                                        });
                                    }}
                                >
                                    <div className="flex flex-row gap-2 justify-center items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="24px"
                                            viewBox="0 -960 960 960"
                                            width="24px"
                                            fill="#FFFFFF"
                                        >
                                            <path d="M480-80 120-280v-400l360-200 360 200v400L480-80ZM364-590q23-24 53-37t63-13q33 0 63 13t53 37l120-67-236-131-236 131 120 67Zm76 396v-131q-54-14-87-57t-33-98q0-11 1-20.5t4-19.5l-125-70v263l240 133Zm40-206q33 0 56.5-23.5T560-480q0-33-23.5-56.5T480-560q-33 0-56.5 23.5T400-480q0 33 23.5 56.5T480-400Zm40 206 240-133v-263l-125 70q3 10 4 19.5t1 20.5q0 55-33 98t-87 57v131Z" />
                                        </svg>
                                        Execute Algorithm
                                    </div>
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </main>
    );
}
