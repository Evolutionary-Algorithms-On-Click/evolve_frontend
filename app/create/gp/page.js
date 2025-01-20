"use client";

import Loader from "@/app/_components/Loader";
import { useState } from "react";
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

// The rest of the code remains unchanged

export default function ConfigureGP() {
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
    const [minHeight, setMinHeight] = useState(0);
    const [maxHeight, setMaxHeight] = useState(0);

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
    const [mutMinHeight, setMutMinHeight] = useState(0);
    const [mutMaxHeight, setMutMaxHeight] = useState(0);

    // Mating Function
    const [matingFunc, setMatingFunc] = useState(null);
    const [terminalProb, setTerminalProb] = useState(0.1);

    // Bloat Limits
    const [mateHeightLimit, setMateHeightLimit] = useState(0);
    const [mutateHeightLimit, setMutateHeightLimit] = useState(0);

    // Equation Parameters
    const [degree, setDegree] = useState(0);
    const [coefficients, setCoefficients] = useState([]);
    const [equation, setEquation] = useState("");

    // Algorithm Parameters.
    const [populationSize, setPopulationSize] = useState(5000);
    const [generations, setGenerations] = useState(10);
    const [cxpb, setCxpb] = useState(0.5);
    const [mutpb, setMutpb] = useState(0.2);
    const [hof, setHof] = useState(5);

    const router = useRouter();

    const runGPAlgorithm = async () => {
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
                "http://localhost:8000") + "/api/runGpAlgo",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(inputData),
            },
        );

        switch (response.status) {
            case 200:
                let data = await response.json();
                let executionHistory = localStorage.getItem("executionHistory");

                data.inputData = inputData;

                if (executionHistory) {
                    executionHistory = JSON.parse(executionHistory);
                    executionHistory.push(data);
                }

                localStorage.setItem(
                    "executionHistory",
                    JSON.stringify([data]),
                );
                localStorage.setItem(data.runId, JSON.stringify(data));

                router.push(`/bin/gp/${data.runId}`);

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
                <h1 className="text-3xl sm:text-4xl font-bold">
                    Evolve OnClick
                </h1>
                <p>Run and Visualize algorithms with just a click.</p>
            </div>

            <div className="flex flex-wrap mt-16 gap-4">
                <div className="border border-gray-400 rounded-2xl p-4">
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

                        {currentStep >= 12 && (
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
                                    className="bg-foreground text-background p-2 rounded-lg w-full"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsLoading(true);
                                        runGPAlgorithm().then(() => {
                                            setIsLoading(false);
                                        });
                                    }}
                                >
                                    Execute Algorithm
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </main>
    );
}
