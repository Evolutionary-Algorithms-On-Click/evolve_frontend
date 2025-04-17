"use client";

import Loader from "@/app/_components/Loader";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChooseAlgo } from "../_components/chooseAlgorithm";
import ChooseWeights from "../_components/chooseWeights";
import ChooseMatingFunction from "../_components/chooseMatingFunction";
import ChooseMutationFunction from "../_components/chooseMutateFunction";
import ChooseSelectionFunction from "../_components/chooseSelectionFunction";
import { mutationData } from "@/app/_data/mutation";
import { mateData } from "@/app/_data/mate";
import ConfigureAlgoParams from "../_components/configureAlgoParams";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { algorithmData } from "@/app/_data/algorithms";
import PreviewML from "@/app/_components/ml/preview";

export default function OptimizeMLModelWithEA() {
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
    const [populationSize, setPopulationSize] = useState(20);
    const [generations, setGenerations] = useState(30);
    const [cxpb, setCxpb] = useState(0.5);
    const [mutpb, setMutpb] = useState(0.2);
    const [hof, setHof] = useState(5);

    const router = useRouter();

    const runEAMLAlgo = async () => {
        const inputData = {
            algorithm: chosenAlgo.toString(),
            mlEvalFunctionCodeString: mlEvalFunctionCodeString.toString(),
            populationSize: parseInt(populationSize),
            generations: parseInt(generations.toString()),
            cxpb: parseFloat(cxpb),
            mutpb: parseFloat(mutpb),
            weights: parameters.map((param) => parseFloat(param)),
            googleDriveUrl: datasetURL.toString(),
            sep: sep.toString(),
            mlImportCodeString: mlImportCodeString.toString(),
            targetColumnName: targetColumnName.toString(),
            indpb: 0.05,
            crossoverFunction: matingFunc.toString(),
            mutationFunction: mutateFunc.toString(),
            selectionFunction: selectFunc.toString(),
            tournamentSize: parseInt(tempTourSize),
            mu: parseInt(mu ?? 2),
            lambda_: parseInt(lambda ?? 4),
            hofSize: parseInt(hof ?? 5),
        };

        const response = await fetch(
            (process.env.NEXT_PUBLIC_BACKEND_BASE_URL ??
                "http://localhost:5002") + "/api/ml",
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
                router.push(`/bin/ml/${data.data.runID}`);

                break;
            default:
                alert("Error running algorithm.");
        }
    };

    return isLoading ? (
        <Loader type={"full"} message={"Optimizing your ML Model..."} />
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

            <div className="flex flex-row gap-4 mt-4 mb-8">
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

            <div className="flex gap-0 mt-16 border border-gray-400 rounded-2xl bg-gray-100 bg-opacity-70">
                <PreviewML
                    datasetURL={datasetURL}
                    targetColumnName={targetColumnName}
                    sep={sep}
                    mlImportCodeString={mlImportCodeString}
                    mlEvalFunctionCodeString={mlEvalFunctionCodeString}
                    chosenAlgo={chosenAlgo}
                    mu={mu}
                    lambda={lambda}
                    populationSize={populationSize}
                    generations={generations}
                    cxpb={cxpb}
                    mutpb={mutpb}
                    hof={hof}
                    parameters={parameters}
                    matingFunc={matingFunc}
                    mutateFunc={mutateFunc}
                    selectFunc={selectFunc}
                    tempTourSize={tempTourSize}
                    currentStep={currentStep}
                />

                <div className="border border-gray-400 rounded-2xl p-4 bg-white max-w-[75%]">
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
                                className="border border-gray-300 p-2 rounded-lg text-foreground bg-background min-h-[100px] h-fit w-full"
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
                                className="border border-gray-300 p-2 rounded-lg text-foreground bg-background min-h-[310px] h-fit w-full"
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
                                algoData={algorithmData.filter(
                                    (x) => x.name !== "de", // TODO: Add DE later.
                                )}
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
                                        runEAMLAlgo().then(() => {
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
