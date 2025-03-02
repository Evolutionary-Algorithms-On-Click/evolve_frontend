"use client";

import Loader from "@/app/_components/Loader";
import { useState } from "react";
import ChooseWeights from "../_components/chooseWeights";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChooseAlgo } from "../_components/chooseAlgorithm";
import { algorithmData } from "@/app/_data/pso";
import { GetDimensions } from "./_components/getDimensions";
import { ConfigureParticle } from "./_components/configureParticle";

// The rest of the code remains unchanged

export default function ConfigureGP() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [algorithm, setAlgorithm] = useState("");

    // Weights Parameters
    const [parameters, setParameters] = useState([]);

    const [dimensions, setDimensions] = useState(2);

    const [minPos, setMinPos] = useState(-6);
    const [maxPos, setMaxPos] = useState(6);

    const [minSpeed, setMinSpeed] = useState(-3);
    const [maxSpeed, setMaxSpeed] = useState(3);

    const router = useRouter();

    const runPSO = async () => {
        const inputData = {
            weights: parameters.map((x) => parseFloat(x)) ?? [1.0],
        };

        const response = await fetch("/api/pso", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(inputData),
        });

        switch (response.status) {
            case 200:
                let data = await response.json();
                console.log(data);
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
                            PSO -{" "}
                            <span className="text-green-500">
                                ParticleSwarmOptimization
                            </span>
                        </p>
                        <hr className="my-4" />

                        {currentStep >= 1 && (
                            <ChooseAlgo
                                chosenAlgo={algorithm}
                                setChosenAlgo={setAlgorithm}
                                currentStep={currentStep}
                                nextStep={2}
                                setCurrentStep={setCurrentStep}
                                algoData={algorithmData}
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
                            <GetDimensions
                                dimensions={dimensions}
                                setDimensions={setDimensions}
                                currentStep={currentStep}
                                nextStep={4}
                                setCurrentStep={setCurrentStep}
                            />
                        )}

                        {currentStep >= 4 && (
                            <ConfigureParticle
                                minPos={minPos}
                                setMinPos={setMinPos}
                                maxPos={maxPos}
                                setMaxPos={setMaxPos}
                                minSpeed={minSpeed}
                                setMinSpeed={setMinSpeed}
                                maxSpeed={maxSpeed}
                                setMaxSpeed={setMaxSpeed}
                                currentStep={currentStep}
                                nextStep={5}
                                setCurrentStep={setCurrentStep}
                            />
                        )}

                        {currentStep >= 13 && (
                            // TODO: Disable button if any of the fields are absent.
                            <div className="mt-4">
                                <button
                                    className="bg-foreground text-background p-2 rounded-lg w-full hover:opacity-70 active:opacity-50"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsLoading(true);
                                        runPSO().then(() => {
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
