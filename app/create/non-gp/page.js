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
import { deMutationData, mutationData } from "@/app/_data/mutation";
import { deMateData, mateData } from "@/app/_data/mate";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { ConfigureDEParams } from "./_components/chooseDEParams";
import { selectionData } from "@/app/_data/selection";
import { env } from "next-runtime-env";

export default function ConfigureNonGP() {
    const [userData, setUserData] = useState({});

    useEffect(() => {
        if (!localStorage.getItem("id")) {
            window.location.href = "/auth";
            return;
        } else {
            setUserData({
                email: localStorage.getItem("email"),
                userName: localStorage.getItem("userName"),
                fullName: localStorage.getItem("fullName"),
                id: localStorage.getItem("id"),
            });
        }
    }, []);

    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Algorithm Parameters.
    const [chosenAlgo, setChosenAlgo] = useState(null);
    const [mu, setMu] = useState(0);
    const [lambda, setLambda] = useState(0);
    const [crossOverRate, setCrossOverRate] = useState(0.25);
    const [scalingFactor, setScalingFactor] = useState(1);

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

    const validateInput = () => {
        if (!chosenAlgo) {
            alert("Algorithm is required!!");
            return false;
        }
        if (!indGen) {
            alert("Individual generator is required!!");
            return false;
        }
        if (!popFunc) {
            alert("Population function is required!!");
            return false;
        }
        if (!matingFunc) {
            alert("Mating (crossover) function is required!!");
            return false;
        }
        if (!mutateFunc) {
            alert("Mutation function is required!!");
            return false;
        }
        if (!selectFunc) {
            alert("Selection function is required!!");
            return false;
        }
        if (!evalFunc) {
            alert("Evaluation function is required!!");
            return false;
        }
        if (populationSize <= 0 || generations <= 0) {
            alert("Population size and generations must be greater than 0!!");
            return false;
        }
        return true;
    };

    const runAlgorithm = async () => {
        if (!validateInput()) {
            return;
        }
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

        if (
            ![
                "cxPartialyMatched",
                "cxOrdered",
                "cxUniformPartialyMatched",
            ].includes(matingFunc.name)
        ) {
            // individual size should be greater than max random range and datatype not floating point.
            if (indGen === "floatingPoint") {
                alert(
                    `Please select a different type. This is because of the way in which ${matingFunc.name} works.`,
                );
                return;
            }

            if (indSize <= parseInt(randomRangeEnd)) {
                alert(
                    `Please select a valid individual size greater than random range. This is because of the way in which ${matingFunc.name} works.`,
                );
                return;
            }
        }

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
            indpb: 0.05, // TODO: Get this from the user.
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
            crossOverRate: parseFloat(crossOverRate ?? 0.25),
            scalingFactor: parseFloat(scalingFactor ?? 1),
        };

        const response = await fetch(
            (env("NEXT_PUBLIC_BACKEND_BASE_URL") ?? "http://localhost:5002") +
                "/api/ea",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(inputData),
            },
        );

        switch (response.status) {
            case 200:
                let data = await response.json();
                router.push(`/bin/ea/${data.data.runID}`);

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

            {userData.fullName && (
                <div className="mt-4 flex flex-row gap-2 bg-gray-900 rounded-full px-4 text-[#6eff39] items-center">
                    <div className="py-2">
                        <p className="text-xs">
                            {userData.fullName} {"</>"} @{userData.userName}
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = "/auth";
                        }}
                        className="text-[#ff2e2e] font-semibold border-l border-[#ffffff] pl-3 py-2 flex flex-row justify-center items-center"
                    >
                        <LogOut className="mx-1" size={16} />
                    </button>
                </div>
            )}

            <div className="flex flex-row gap-4">
                <Link
                    href="/create"
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

            <div className="flex flex-col md:flex-row mt-24 gap-4 border border-gray-400 rounded-2xl bg-gray-100 bg-opacity-70 p-4">
                <div className="w-full md:w-80 shrink-0">
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
                </div>

                <div className="flex-1 min-w-[300px] border border-gray-400 rounded-2xl p-4 bg-white self-start">
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

                        {chosenAlgo === "de" && currentStep >= 2 && (
                            <ConfigureDEParams
                                phi1={crossOverRate}
                                phi2={scalingFactor}
                                setPhi1={setCrossOverRate}
                                setPhi2={setScalingFactor}
                                currentStep={currentStep}
                                nextStep={3}
                                setCurrentStep={setCurrentStep}
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
                                mateData={
                                    chosenAlgo === "de"
                                        ? deMateData
                                        : indGen === "floatingPoint"
                                          ? mateData.filter(
                                                (mate) =>
                                                    ![
                                                        "cxPartialyMatched",
                                                        "cxOrdered",
                                                        "cxUniformPartialyMatched",
                                                    ].includes(mate.name),
                                            )
                                          : mateData
                                }
                                mateFunc={matingFunc}
                                setMateFunc={setMatingFunc}
                                currentStep={currentStep}
                                nextStep={7}
                                setCurrentStep={setCurrentStep}
                            />
                        )}

                        {currentStep >= 7 && matingFunc && (
                            <ChooseMutationFunction
                                mutationData={
                                    chosenAlgo === "de"
                                        ? deMutationData
                                        : mutationData
                                }
                                mutateFunc={mutateFunc}
                                setMutateFunc={setMutateFunc}
                                currentStep={currentStep}
                                nextStep={8}
                                setCurrentStep={setCurrentStep}
                            />
                        )}

                        {currentStep >= 8 && matingFunc && (
                            <ChooseSelectionFunction
                                selData={
                                    chosenAlgo === "eaMuPlusLambda" ||
                                    chosenAlgo === "eaMuCommaLambda"
                                        ? selectionData.filter(
                                              (sel) =>
                                                  ![
                                                      "selRoulette",
                                                      "selBest",
                                                      "selWorst",
                                                  ].includes(sel.name),
                                          )
                                        : selectionData
                                }
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
                            <div className="mt-4">
                                <button
                                    className="bg-foreground text-background p-2 rounded-lg w-full"
                                    disabled={!validateInput()}
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
