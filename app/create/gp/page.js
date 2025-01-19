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
                                        // TODO: Connect to the API and run the algorithm.
                                        setTimeout(() => {
                                            setIsLoading(false);
                                        }, 3000);
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
