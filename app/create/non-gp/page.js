"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/app/_components/Loader";
import ChooseAlgorithm from "@/app/create/_components/chooseAlgorithm";
import ChooseWeights from "@/app/create/_components/chooseWeights";
import ChooseInitializationFunction from "@/app/create/_components/chooseInitializationFunction";
import ChooseMatingFunction from "@/app/create/_components/chooseMatingFunction";
import ChooseMutateFunction from "@/app/create/_components/chooseMutateFunction";
import ChooseSelectionFunction from "@/app/create/_components/chooseSelectionFunction";
import ChooseEvaluationFunction from "@/app/create/non-gp/_components/chooseEvaluationFunction";
import ChooseGenerator from "@/app/create/non-gp/_components/chooseGenerator";
import GetIndividualSize from "@/app/create/non-gp/_components/getIndividualSize";
import ChooseDEParams from "@/app/create/non-gp/_components/chooseDEParams";
import ConfigureAlgoParams from "@/app/create/_components/configureAlgoParams";
import DynamicLogo from "@/app/_components/DynamicLogo";
import LightBulbToggle from "@/app/_components/LightBulbToggle";

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
    const [indpb, setIndpb] = useState(0.05);
    const [tournsize, setTournsize] = useState(3);
    const [hofSize, setHofSize] = useState(1);

    const router = useRouter();

    const runAlgorithm = async () => {
        setIsLoading(true);

        const inputData = {
            algorithm: chosenAlgo,
            mu: mu,
            lambda: lambda,
            crossOverRate: crossOverRate,
            scalingFactor: scalingFactor,
            parameters: parameters,
            indGen: indGen,
            randomRangeStart: randomRangeStart,
            randomRangeEnd: randomRangeEnd,
            indSize: indSize,
            popFunc: popFunc,
            matingFunc: matingFunc,
            mutateFunc: mutateFunc,
            selectFunc: selectFunc,
            tempTourSize: tempTourSize,
            evalFunc: evalFunc,
            populationSize: populationSize,
            generations: generations,
            cxpb: cxpb,
            mutpb: mutpb,
            indpb: indpb,
            tournsize: tournsize,
            hofSize: hofSize,
        };

        try {
            const response = await fetch(
                (process.env.NEXT_PUBLIC_BACKEND_BASE_URL ??
                    "http://localhost:5002") + "/api/runs/ea",
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
        } catch (error) {
            console.error("Error running algorithm:", error);
            alert("Failed to run algorithm. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return isLoading ? (
        <Loader type={"full"} message={"Running Algorithm..."} />
    ) : (
        <main className="flex flex-col justify-center items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-mono)] p-8">
            <LightBulbToggle />
            <div className="text-center mb-8">
                <div className="flex items-center justify-center overflow-hidden h-32 mb-4">
                    <DynamicLogo height={320} width={680} className="rounded-md" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-center dark:text-gray-100">
                    Evolve OnClick
                </h1>
                <p className="dark:text-gray-300">Run and Visualize algorithms with just a click.</p>
            </div>

            {userData.fullName && (
                <div className="mt-4 flex flex-row gap-2 bg-gray-900 dark:bg-gray-700 rounded-full px-4 text-[#6eff39] items-center">
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
                        className="text-[#ff2e2e] font-semibold border-l border-[#ffffff] dark:border-gray-500 pl-3 py-2 flex flex-row justify-center items-center"
                    >
                        <LogOut className="mx-1" size={16} />
                    </button>
                </div>
            )}

            <div className="flex flex-col items-center justify-center flex-grow w-fit min-w-[32%]">
                <div className="flex flex-col gap-1 p-4 w-full bg-white dark:bg-gray-800 shadow-sm border border-dashed border-gray-200 dark:border-gray-600 rounded-3xl">
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-gray-100">
                            Configure Non-GP Algorithm
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            Step {currentStep} of 9
                        </p>
                    </div>

                    {currentStep === 1 && (
                        <ChooseAlgorithm
                            chosenAlgo={chosenAlgo}
                            setChosenAlgo={setChosenAlgo}
                            setCurrentStep={setCurrentStep}
                        />
                    )}

                    {currentStep === 2 && (
                        <ChooseWeights
                            parameters={parameters}
                            setParameters={setParameters}
                            setCurrentStep={setCurrentStep}
                        />
                    )}

                    {currentStep === 3 && (
                        <ChooseInitializationFunction
                            indGen={indGen}
                            setIndGen={setIndGen}
                            setCurrentStep={setCurrentStep}
                        />
                    )}

                    {currentStep === 4 && (
                        <GetIndividualSize
                            indSize={indSize}
                            setIndSize={setIndSize}
                            setCurrentStep={setCurrentStep}
                        />
                    )}

                    {currentStep === 5 && (
                        <ChooseMatingFunction
                            matingFunc={matingFunc}
                            setMatingFunc={setMatingFunc}
                            setCurrentStep={setCurrentStep}
                        />
                    )}

                    {currentStep === 6 && (
                        <ChooseMutateFunction
                            mutateFunc={mutateFunc}
                            setMutateFunc={setMutateFunc}
                            setCurrentStep={setCurrentStep}
                        />
                    )}

                    {currentStep === 7 && (
                        <ChooseSelectionFunction
                            selectFunc={selectFunc}
                            setSelectFunc={setSelectFunc}
                            tempTourSize={tempTourSize}
                            setTempTourSize={setTempTourSize}
                            setCurrentStep={setCurrentStep}
                        />
                    )}

                    {currentStep === 8 && (
                        <ChooseEvaluationFunction
                            evalFunc={evalFunc}
                            setEvalFunc={setEvalFunc}
                            setCurrentStep={setCurrentStep}
                        />
                    )}

                    {currentStep === 9 && (
                        <ConfigureAlgoParams
                            populationSize={populationSize}
                            setPopulationSize={setPopulationSize}
                            generations={generations}
                            setGenerations={setGenerations}
                            cxpb={cxpb}
                            setCxpb={setCxpb}
                            mutpb={mutpb}
                            setMutpb={setMutpb}
                            indpb={indpb}
                            setIndpb={setIndpb}
                            tournsize={tournsize}
                            setTournsize={setTournsize}
                            hofSize={hofSize}
                            setHofSize={setHofSize}
                            runAlgorithm={runAlgorithm}
                        />
                    )}
                </div>
            </div>
        </main>
    );
}
