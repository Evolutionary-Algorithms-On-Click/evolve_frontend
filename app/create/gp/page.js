"use client";

import Loader from "@/app/_components/Loader";
import { useEffect, useState } from "react";
import { ChooseAlgo } from "../_components/chooseAlgorithm";
import ChoosePrimitiveSet from "./_components/primitive";
import ChooseTreeGeneratorExpression from "./_components/treeGenerator";
import ChooseInitializationFunction from "../_components/chooseInitializationFunction";
import ChooseSelectionFunction from "../_components/chooseSelectionFunction";
import ChooseMutationFunction from "../_components/chooseMutateFunction";
import { gpMutationData } from "@/app/_data/mutation";
import ChooseMatingFunction from "../_components/chooseMatingFunction";
import { gpMateData } from "@/app/_data/mate";
import ChooseWeights from "../_components/chooseWeights";
import ConfigureBloatLimits from "./_components/bloatLimits";
import ConfigureEquation from "./_components/equation";
import ConfigureAlgoParams from "../_components/configureAlgoParams";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PreviewGP from "@/app/_components/gp/preview";
import { LogOut } from "lucide-react";
import { algorithmData } from "@/app/_data/algorithms";
import { treeGeneratorData } from "@/app/_data/treeGenExpression";

// The rest of the code remains unchanged

export default function ConfigureGP() {
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

    // Algorithm Parameters
    const [chosenAlgo, setChosenAlgo] = useState(null);
    const [mu, setMu] = useState(0);
    const [lambda, setLambda] = useState(0);

    // Weights Parameters
    const [parameters, setParameters] = useState([]);

    // Primitive Set Elements
    const [primitiveSet, setPrimitiveSet] = useState([]);

    // Tree Generator Expression
    const [treeGenExpression, setTreeGenExpression] = useState(null);
    const [minHeight, setMinHeight] = useState(1);
    const [maxHeight, setMaxHeight] = useState(2);

    // Individual Generator Function
    const [indGen, setIndGen] = useState(null);

    // Population Generator Function
    const [popFunc, setPopFunc] = useState(null);

    // Selection Function
    const [selectionFunction, setSelectionFunction] = useState(null);
    const [tempTourSize, setTempTourSize] = useState(0);

    // Mutation Function
    const [mutateFunc, setMutateFunc] = useState(null);
    const [mode, setMode] = useState("one");
    const [mutExpr, setMutExpr] = useState(null);
    const [mutMinHeight, setMutMinHeight] = useState(1);
    const [mutMaxHeight, setMutMaxHeight] = useState(2);

    // Mating Function
    const [matingFunc, setMatingFunc] = useState(null);
    const [terminalProb, setTerminalProb] = useState(0.1);

    // Bloat Limits
    const [mateHeightLimit, setMateHeightLimit] = useState(1);
    const [mutateHeightLimit, setMutateHeightLimit] = useState(2);

    // Equation Parameters
    const [degree, setDegree] = useState(0);
    const [coefficients, setCoefficients] = useState([]);
    const [equation, setEquation] = useState("");

    // Algorithm Parameters.
    const [populationSize, setPopulationSize] = useState(200);
    const [generations, setGenerations] = useState(10);
    const [cxpb, setCxpb] = useState(0.5);
    const [mutpb, setMutpb] = useState(0.2);
    const [hof, setHof] = useState(5);

    const router = useRouter();

    const validateInput = () => {
        if (
            ![
                "eaSimple",
                "eaMuPlusLambda",
                "eaMuCommaLambda",
                "eaGenerateUpdate",
            ].includes(chosenAlgo)
        ) {
            alert("Invalid algorithm! Choose a supported GP algorithm.");
            return false;
        }
        if (populationSize <= 0) {
            alert("Population size must be greater than 0!!");
            return false;
        }
        if (generations <= 0) {
            alert("Generations must be greater than 0!!");
            return false;
        }
        if (cxpb < 0 || cxpb > 1) {
            alert("Crossover probability must be between 0 and 1!!");
            return false;
        }
        if (mutpb < 0 || mutpb > 1) {
            alert("Mutation probability must be between 0 and 1!!");
            return false;
        }
        if (!matingFunc) {
            alert("Mating function is required!!");
            return false;
        }
        if (!mutateFunc) {
            alert("Mutation function is required!!");
            return false;
        }
        if (!selectionFunction) {
            alert("Selection function is required!!");
            return false;
        }
        return true;
    };

    const runGPAlgorithm = async () => {
        if (!validateInput()) {
            return;
        }
        /*
        const gpConfig = {
            "algorithm": "eaSimple", // DONE
            "arity": 1, // DONE
            "operators": [
                "add", "sub", "mul", "div", "neg", "cos", "sin"
            ], // DONE
            "argNames": [
                "x"
            ], // DONE
            "individualType": "PrimitiveTree", // DONE
            "expr": "genHalfAndHalf", // DONE
            "min_": 1, // DONE
            "max_": 2, // DONE
            "realFunction": "x**4 + x**3 + x**2 + x",
            "individualFunction": "initIterate", // DONE
            "populationFunction": "initRepeat", // DONE
            "selectionFunction": "selTournament", // DONE
            "tournamentSize": 3, // DONE
            "expr_mut": "genFull", // DONE
            "expr_mut_min": 0, // DONE
            "expr_mut_max": 2, // DONE
            "crossoverFunction": "cxOnePoint", // "cxSemantic" needs ['lf', 'mul', 'add', 'sub'] operators exactly. DONE
            "terminalProb": 0.1, // Only when crossoverFunction is "cxOnePointLeafBiased". Max value is 0.2 that works well. DONE
            "mutationFunction": "mutUniform", // DONE
            "mutationMode": "one", // One of "one" or "all". Only when mutationFunction is "mutEphemeral". // DONE
            "mateHeight": 17, // DONE
            "mutHeight": 17, // DONE
            "weights": [
                1.0
            ], // DONE
            
            "populationSize": 300,
            "generations": 40,
            "cxpb": 0.5,
            "mutpb": 0.1,
            "mu": 1000,
            "lambda_": 4,
            "hofSize": 1
            }
        */
        const inputData = {
            algorithm: chosenAlgo.toString() ?? "eaSimple",
            arity: parseInt(1),
            operators: primitiveSet ?? ["add", "sub", "mul", "div"],
            argNames: ["x"],
            individualType: "PrimitiveTree",
            expr: treeGenExpression ?? "genHalfAndHalf",
            min_: parseInt(minHeight) ?? 10,
            max_: parseInt(maxHeight) ?? 20,
            realFunction: equation.toString() ?? "x**4 + x**3 + x**2 + x",
            individualFunction: indGen.toString() ?? "initIterate",
            populationFunction: popFunc.toString() ?? "initRepeat",
            selectionFunction: selectionFunction.toString() ?? "selTournament",
            tournamentSize: parseInt(tempTourSize) ?? 3,
            expr_mut: mutExpr.toString() ?? "genFull",
            expr_mut_min: parseInt(mutMinHeight) ?? 0,
            expr_mut_max: parseInt(mutMaxHeight) ?? 2,
            crossoverFunction: matingFunc.toString() ?? "cxOnePoint",
            terminalProb: parseFloat(terminalProb) ?? 0.1,
            mutationFunction: mutateFunc.toString() ?? "mutUniform",
            mutationMode: mode.toString() ?? "one",
            mateHeight: parseInt(mateHeightLimit) ?? 17,
            mutHeight: parseInt(mutateHeightLimit) ?? 17,
            weights: parameters.map((x) => parseFloat(x)) ?? [1.0],
            populationSize: parseInt(populationSize) ?? 300,
            generations: parseInt(generations) ?? 40,
            cxpb: parseFloat(cxpb) ?? 0.5,
            mutpb: parseFloat(mutpb) ?? 0.1,
            mu: parseInt(mu) ?? 1,
            lambda_: parseInt(lambda) ?? 1,
            hofSize: parseInt(hof) ?? 1,
            individualSize: 10,
        };

        const response = await fetch(
            (process.env.NEXT_PUBLIC_BACKEND_BASE_URL ??
                "http://localhost:5002") + "/api/gp",
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

                router.push(`/bin/gp/${data.data.runID}`);

                break;
            default:
                alert("Error running algorithm.");
        }
    };

    return isLoading ? (
        <Loader type={"full"} message={"Running Algorithm..."} />
    ) : (
        <main className="flex flex-col justify-center items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-mono)] p-8">
            <div className="text-center">
                <h1 className="text-3xl sm:text-4xl font-bold">
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

            <div className="flex flex-wrap mt-16 gap-4 border border-gray-400 rounded-2xl bg-gray-100 bg-opacity-70">
                <PreviewGP
                    algo={chosenAlgo}
                    parameters={parameters}
                    indGen={indGen}
                    primitiveSet={primitiveSet}
                    treeGenExpression={treeGenExpression}
                    minHeight={minHeight}
                    maxHeight={maxHeight}
                    popFunc={popFunc}
                    selectFunc={selectionFunction}
                    tempTourSize={tempTourSize}
                    mutateFunc={mutateFunc}
                    mode={mode}
                    mutExpr={mutExpr}
                    mutMinHeight={mutMinHeight}
                    mutMaxHeight={mutMaxHeight}
                    matingFunc={matingFunc}
                    terminalProb={terminalProb}
                    mateHeightLimit={mateHeightLimit}
                    mutateHeightLimit={mutateHeightLimit}
                    generations={generations}
                    populationSize={populationSize}
                    cxpb={cxpb}
                    mutpb={mutpb}
                    hofSize={hof}
                    currentStep={currentStep}
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
                        <p className="text-sm text-gray-500">
                            Genetic Programming -{" "}
                            <span className="text-green-500">
                                PrimitiveTree
                            </span>
                        </p>
                        <hr className="my-4" />

                        {currentStep >= 1 && (
                            <ChooseAlgo
                                algoData={algorithmData.filter(
                                    (x) => x.name !== "de",
                                )}
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
                                setCurrentStep={setCurrentStep}
                                nextStep={3}
                                parameters={parameters}
                                setParameters={setParameters}
                            />
                        )}

                        {currentStep >= 3 && (
                            <ChoosePrimitiveSet
                                currentStep={currentStep}
                                setCurrentStep={setCurrentStep}
                                nextStep={4}
                                primitiveSet={primitiveSet}
                                setPrimitiveSet={setPrimitiveSet}
                            />
                        )}

                        {currentStep >= 4 && (
                            <ChooseTreeGeneratorExpression
                                currentStep={currentStep}
                                setCurrentStep={setCurrentStep}
                                nextStep={5}
                                treeGenExpression={treeGenExpression}
                                setTreeGenExpression={setTreeGenExpression}
                                minHeight={minHeight}
                                setMinHeight={setMinHeight}
                                maxHeight={maxHeight}
                                setMaxHeight={setMaxHeight}
                            />
                        )}

                        {currentStep >= 5 && (
                            <ChooseInitializationFunction
                                title="Step 5: Choose an Individual Generator Function."
                                currentStep={currentStep}
                                setCurrentStep={setCurrentStep}
                                nextStep={6}
                                popFunc={indGen}
                                setPopFunc={setIndGen}
                            />
                        )}

                        {currentStep >= 6 && (
                            <ChooseInitializationFunction
                                title="Step 6: Choose a Population Generator Function."
                                currentStep={currentStep}
                                setCurrentStep={setCurrentStep}
                                nextStep={7}
                                popFunc={popFunc}
                                setPopFunc={setPopFunc}
                            />
                        )}

                        {currentStep >= 7 && (
                            <ChooseSelectionFunction
                                title="Step 7: Choose a Selection Function."
                                currentStep={currentStep}
                                setCurrentStep={setCurrentStep}
                                nextStep={8}
                                selectFunc={selectionFunction}
                                setSelectFunc={setSelectionFunction}
                                tempTourSize={tempTourSize}
                                setTempTourSize={setTempTourSize}
                            />
                        )}

                        {currentStep >= 8 && (
                            <ChooseMutationFunction
                                title="Step 8: Choose a Mutation Function."
                                mutationData={gpMutationData}
                                currentStep={currentStep}
                                setCurrentStep={setCurrentStep}
                                nextStep={9}
                                mutateFunc={mutateFunc}
                                setMutateFunc={setMutateFunc}
                                mode={mode}
                                setMode={setMode}
                            />
                        )}

                        {currentStep >= 9 && (
                            <ChooseTreeGeneratorExpression
                                title="Step 9: Choose a Mutation Generator Tree Expression."
                                currentStep={currentStep}
                                setCurrentStep={setCurrentStep}
                                nextStep={10}
                                treeGenExpression={mutExpr}
                                setTreeGenExpression={setMutExpr}
                                minHeight={mutMinHeight}
                                setMinHeight={setMutMinHeight}
                                maxHeight={mutMaxHeight}
                                setMaxHeight={setMutMaxHeight}
                                treeGenList={
                                    treeGenExpression == "genFull"
                                        ? treeGeneratorData.filter(
                                              (x) => x.name !== "genFull",
                                          )
                                        : treeGeneratorData
                                }
                            />
                        )}

                        {currentStep >= 10 && (
                            <ChooseMatingFunction
                                title="Step 10: Choose a Mating Function."
                                mateData={gpMateData}
                                mateFunc={matingFunc}
                                setMateFunc={setMatingFunc}
                                currentStep={currentStep}
                                nextStep={11}
                                setCurrentStep={setCurrentStep}
                                terminalProb={terminalProb}
                                setTerminalProb={setTerminalProb}
                                setPrimitiveSet={setPrimitiveSet}
                            />
                        )}

                        {currentStep >= 11 && (
                            <ConfigureBloatLimits
                                currentStep={currentStep}
                                setCurrentStep={setCurrentStep}
                                nextStep={12}
                                mateHeight={mateHeightLimit}
                                setMateHeight={setMateHeightLimit}
                                mutHeight={mutateHeightLimit}
                                setMutHeight={setMutateHeightLimit}
                            />
                        )}

                        {currentStep >= 11 && (
                            <ConfigureEquation
                                currentStep={currentStep}
                                setCurrentStep={setCurrentStep}
                                nextStep={13}
                                degree={degree}
                                setDegree={setDegree}
                                coefficients={coefficients}
                                setCoefficients={setCoefficients}
                                equation={equation}
                                setEquation={setEquation}
                            />
                        )}

                        {currentStep >= 13 && (
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

                        {currentStep >= 13 && (
                            // TODO: Disable button if any of the fields are absent.
                            <div className="mt-4">
                                <button
                                    className="bg-foreground text-background p-2 rounded-lg w-full hover:opacity-70 active:opacity-50"
                                    disable={!validateInput()}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsLoading(true);
                                        runGPAlgorithm().then(() => {
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
