"use client";

import Loader from "@/app/_components/Loader";
import Link from "next/link";
import { useState } from "react";
import { ChooseAlgo } from "../_components/chooseAlgorithm";
import ChooseWeights from "../_components/chooseWeights";
import ChooseMatingFunction from "../_components/chooseMatingFunction";
import ChooseMutationFunction from "../_components/chooseMutateFunction";
import ChooseSelectionFunction from "../_components/chooseSelectionFunction";
import { mutationData } from "@/app/_data/mutation";
import { mateData } from "@/app/_data/mate";
import ConfigureAlgoParams from "../_components/configureAlgoParams";
import Image from "next/image";

export default function OptimizeMLModelWithEA() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // ML Params.
    const [datasetURL, setDatasetURL] = useState("");
    const [targetColumnName, setTargetColumnName] = useState("");
    const [sep, setSep] = useState(",");
    const [mlImportCodeString, setMLImportCodeString] = useState(
        `from sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import accuracy_score`,
    );
    const [mlEvalFunctionCodeString, setMLEvalFunctionCodeString] = useState(
        `def mlEvalFunction(individual, X, y):\n\tselected_columns = [i for i in range(len(individual)) if individual[i] == 1]\n\tif len(selected_columns) == 0:\n\t\treturn 0.0,\n\n\tmodel = LogisticRegression()\n\tX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\tmodel.fit(X_train.iloc[:, selected_columns], y_train)\n\ty_pred = model.predict(X_test.iloc[:, selected_columns])\n\taccuracy = accuracy_score(y_test, y_pred)\n\treturn accuracy,`,
    );

    // Algorithm Parameters.
    const [chosenAlgo, setChosenAlgo] = useState(null);
    const [mu, setMu] = useState(0);
    const [lambda, setLambda] = useState(0);

    // Weights parameters.
    const [parameters, setParameters] = useState([]);

    // Mating Function.
    const [matingFunc, setMatingFunc] = useState(null);

    // Mutation Function.
    const [mutateFunc, setMutateFunc] = useState(null);

    // Selection Function.
    const [selectFunc, setSelectFunc] = useState(null);
    const [tempTourSize, setTempTourSize] = useState(0);

    // Algorithm Parameters.
    const [populationSize, setPopulationSize] = useState(5000);
    const [generations, setGenerations] = useState(10);
    const [cxpb, setCxpb] = useState(0.5);
    const [mutpb, setMutpb] = useState(0.2);
    const [hof, setHof] = useState(5);

    return isLoading ? (
        <Loader type={"full"} message={"Optimizing your ML Model..."} />
    ) : (
        <main className="flex flex-col justify-center items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-mono)] p-8">
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold">
                    Evolve OnClick
                </h1>
                <p>Run and Visualize algorithms with just a click.</p>
            </div>

            <Image
                src="/ai_ea.png"
                alt="Genetic Programming"
                width={480}
                height={300}
                className="mx-auto rounded-2xl my-2"
            />

            <Link
                href="/create"
                className="rounded-full border border-solid border-black/[.08] transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#dddddd] hover:text-foreground text-sm sm:text-base px-4 py-2 my-4 mt-1"
            >
                ← Go Back
            </Link>

            <div className="flex flex-wrap gap-4 justify-center items-center">
                {/* TODO: Add Preview. */}
                <div className="border border-gray-400 rounded-2xl p-4 w-[75%]">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}
                        className="flex flex-col"
                    >
                        <h3 className="text-xl font-bold">
                            Configure Algorithm
                        </h3>
                        <p className="text-md">
                            Optimize your Machine Learning model with
                            Evolutionary Algorithms.
                        </p>
                        <p className="text-sm text-gray-500">Non-GP</p>
                        <hr className="my-4" />

                        <div className="mt-4">
                            <h4 className="text-lg font-bold">
                                Step 1: Enter dataset Google Drive URL
                            </h4>
                            <p className="text-sm text-gray-500 mb-4">
                                Upload your preprocessed model-ready dataset to
                                Google Drive, right click on the file, click on
                                "Get Shareable Link", and paste it here with
                                View permission.
                            </p>
                            <input
                                type="url"
                                value={datasetURL}
                                className="border border-gray-300 p-2 rounded-lg w-full"
                                placeholder="Enter Google Drive URL to CSV file"
                                onChange={(e) => {
                                    setDatasetURL(e.target.value);
                                }}
                            />
                        </div>

                        <div className="mt-16">
                            <h4 className="text-lg font-bold">
                                Step 2: Enter target column name
                            </h4>
                            <p className="text-sm text-gray-500 mb-4">
                                Enter the target column name to predict.
                            </p>
                            <input
                                type="text"
                                value={targetColumnName}
                                className="border border-gray-300 p-2 rounded-lg w-full"
                                placeholder="Enter target column name"
                                onChange={(e) => {
                                    setTargetColumnName(e.target.value);
                                }}
                            />
                        </div>

                        <div className="mt-16">
                            <h4 className="text-lg font-bold">
                                Step 3: Enter delimitter.
                            </h4>
                            <p className="text-sm text-gray-500 mb-4">
                                Enter the delimitter used in the dataset.
                                Default is ",".
                            </p>
                            <input
                                type="text"
                                value={sep}
                                className="border border-gray-300 p-2 rounded-lg w-full"
                                placeholder="Enter separator"
                                onChange={(e) => {
                                    setSep(e.target.value);
                                }}
                            />
                        </div>

                        <div className="mt-16">
                            <h4 className="text-lg font-bold">
                                Step 4: Enter ML Import Code
                            </h4>
                            <p className="text-sm text-gray-500 mb-4">
                                Enter the import code for the ML model.
                            </p>
                            <textarea
                                value={mlImportCodeString}
                                className="border border-gray-300 p-2 rounded-lg text-background bg-foreground min-h-[100px] h-fit w-full"
                                placeholder="Enter ML Import Code"
                                onChange={(e) => {
                                    setMLImportCodeString(e.target.value);
                                }}
                            />
                        </div>

                        <div className="mt-16 mb-8">
                            <h4 className="text-lg font-bold">
                                Step 5: Enter ML Evaluation Function Code
                            </h4>
                            <p className="text-sm text-gray-500 mb-4">
                                Enter the evaluation function code for the ML
                                model.
                            </p>
                            <textarea
                                value={mlEvalFunctionCodeString}
                                className="border border-gray-300 p-2 rounded-lg text-background bg-foreground min-h-[310px] h-fit w-full"
                                placeholder="Enter ML Evaluation Function Code"
                                onChange={(e) => {
                                    setMLEvalFunctionCodeString(e.target.value);
                                    setCurrentStep(
                                        currentStep < 2 ? 2 : currentStep,
                                    );
                                }}
                            />
                        </div>

                        {currentStep >= 2 && (
                            <ChooseAlgo
                                title="Step 6: Choose Algorithm."
                                chosenAlgo={chosenAlgo}
                                setChosenAlgo={setChosenAlgo}
                                currentStep={currentStep}
                                nextStep={3}
                                setCurrentStep={setCurrentStep}
                                mu={mu}
                                setMu={setMu}
                                lambda={lambda}
                                setLambda={setLambda}
                            />
                        )}

                        {currentStep >= 3 && (
                            <ChooseWeights
                                title="Step 7: Choose Weights"
                                currentStep={currentStep}
                                nextStep={4}
                                setCurrentStep={setCurrentStep}
                                parameters={parameters}
                                setParameters={setParameters}
                            />
                        )}

                        {currentStep >= 4 && (
                            <ChooseMatingFunction
                                title="Step 8: Choose Mating/CrossOver Function"
                                mateData={mateData}
                                mateFunc={matingFunc}
                                setMateFunc={setMatingFunc}
                                currentStep={currentStep}
                                nextStep={5}
                                setCurrentStep={setCurrentStep}
                            />
                        )}

                        {currentStep >= 5 && matingFunc && (
                            <ChooseMutationFunction
                                title="Step 9: Choose Mutation Function"
                                mutationData={mutationData}
                                mutateFunc={mutateFunc}
                                setMutateFunc={setMutateFunc}
                                currentStep={currentStep}
                                nextStep={6}
                                setCurrentStep={setCurrentStep}
                            />
                        )}

                        {currentStep >= 6 && matingFunc && (
                            <ChooseSelectionFunction
                                title="Step 10: Choose Selection Function"
                                selectFunc={selectFunc}
                                setSelectFunc={setSelectFunc}
                                currentStep={currentStep}
                                nextStep={7}
                                setCurrentStep={setCurrentStep}
                                tempTourSize={tempTourSize}
                                setTempTourSize={setTempTourSize}
                            />
                        )}

                        {currentStep >= 7 && (
                            <ConfigureAlgoParams
                                title="Step 11: Configure Algorithm Parameters"
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

                        {currentStep >= 7 && (
                            // TODO: Disable button if any of the fields are absent.
                            <div className="mt-4">
                                <button
                                    className="bg-foreground text-background p-2 rounded-lg w-full"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsLoading(true);
                                        // TODO: Call the API to run the algorithm.
                                        setTimeout(() => {
                                            setIsLoading(false);
                                        }, 5000);
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
