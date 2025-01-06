"use client";

import Loader from "@/app/_components/Loader";
import { useState } from "react";
import { ChooseAlgo } from "../_components/chooseAlgorithm";

export default function ConfigureGP() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Algorithm Parameters.
    const [chosenAlgo, setChosenAlgo] = useState(null);
    const [mu, setMu] = useState(0);
    const [lambda, setLambda] = useState(0);

    return isLoading ? <Loader type={"full"} message={"Running Algorithm..."} /> : (
        <main className="flex flex-col justify-center items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-mono)] p-8">
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold">
                    Evolve OnClick
                </h1>
                <p>Run and Visualize algorithms with just a click.</p>
            </div>

            <div className="flex flex-wrap mt-16 gap-4">
                {/* <Preview
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
                    /> */}

                <div className="border border-gray-400 rounded-2xl p-4">
                    <form className="flex flex-col">
                        <h3 className="text-xl font-bold">Configure Algorithm</h3>
                        <p className="text-sm text-gray-500">Genetic Programming</p>
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
                    </form>
                </div>
            </div>
        </main>
    );
}