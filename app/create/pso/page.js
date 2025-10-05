"use client";

import Loader from "@/app/_components/Loader";
import { useEffect, useState } from "react";
import ChooseWeights from "../_components/chooseWeights";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChooseAlgo } from "../_components/chooseAlgorithm";
import { algorithmData } from "@/app/_data/pso";
import { GetDimensions } from "./_components/getDimensions";
import { ConfigureParticle } from "./_components/configureParticle";
import { ConfigureCognitiveAndSocialCoeff } from "./_components/cogAndSocialCoeff";
import { benchmarkData } from "@/app/_data/benchmarks";
import { ConfigurePopulationSizeAndGenerations } from "./_components/popSizeAndGenerations";
import { LogOut } from "lucide-react";
import PreviewPSO from "@/app/_components/pso/preview";

export default function ConfigurePSO() {
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

    const [algorithm, setAlgorithm] = useState("");

    // Weights Parameters
    const [parameters, setParameters] = useState([]);

    const [dimensions, setDimensions] = useState(2);

    const [minPos, setMinPos] = useState(-6);
    const [maxPos, setMaxPos] = useState(6);

    const [minSpeed, setMinSpeed] = useState(-3);
    const [maxSpeed, setMaxSpeed] = useState(3);

    const [phi1, setPhi1] = useState(2.0);
    const [phi2, setPhi2] = useState(2.0);

    const [benchmark, setBenchmark] = useState("");

    const [populationSize, setPopulationSize] = useState(50);
    const [generations, setGenerations] = useState(100);

    const router = useRouter();

    const validateInput = () => {
        if (!["original", "multiswarm", "speciation"].includes(algorithm)) {
          alert("Invalid PSO algorithm. Choose original, multiswarm, or speciation!!");
          return false;
        }
        if (dimensions <= 0) {
          alert("Dimensions must be greater than 0!!");
          return false;
        }
        if (minPosition >= maxPosition) {
          alert("Min position must be less than max position!!");
          return false;
        }
        if (minSpeed >= maxSpeed) {
          alert("Min speed must be less than max speed!!");
          return false;
        }
        if (
          ![
            "rand", "plane", "sphere", "cigar", "rosenbrock", "h1", "ackley", "bohachevsky",
            "griewank", "rastrigin", "rastrigin_scaled", "rastrigin_skew", "schaffer",
            "schwefel", "himmelblau"
          ].includes(benchmark)
        ) {
          alert("Invalid benchmark function selected!!");
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
        return true;
      };

    const runPSO = async () => {

        if(!validateInput()){
            return;
        }

        const inputData = {
            algorithm: algorithm,
            dimensions: parseInt(dimensions.toString()),
            weights: parameters.map((x) => parseFloat(x)) ?? [1.0],
            minPosition: parseFloat(minPos.toString()),
            maxPosition: parseFloat(maxPos.toString()),
            minSpeed: parseFloat(minSpeed.toString()),
            maxSpeed: parseFloat(maxSpeed.toString()),
            phi1: parseFloat(phi1.toString()),
            phi2: parseFloat(phi2.toString()),
            benchmark: benchmark,
            populationSize: parseInt(populationSize.toString()),
            generations: parseInt(generations.toString()),
        };

        const response = await fetch(
            (process.env.NEXT_PUBLIC_BACKEND_BASE_URL ??
                "http://localhost:5002") + "/api/pso",
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
                router.push(`/bin/pso/${data.data.runID}`);

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
                <PreviewPSO
                    algorithm={algorithm}
                    dimensions={dimensions}
                    weights={parameters}
                    minPosition={minPos}
                    maxPosition={maxPos}
                    minSpeed={minSpeed}
                    maxSpeed={maxSpeed}
                    phi1={phi1}
                    phi2={phi2}
                    benchmark={benchmark}
                    populationSize={populationSize}
                    generations={generations}
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

                        {currentStep >= 5 && (
                            <ConfigureCognitiveAndSocialCoeff
                                phi1={phi1}
                                phi2={phi2}
                                setPhi1={setPhi1}
                                setPhi2={setPhi2}
                                currentStep={currentStep}
                                nextStep={6}
                                setCurrentStep={setCurrentStep}
                            />
                        )}

                        {currentStep >= 6 && (
                            <ChooseAlgo
                                title="Step 6: Choose an evaluation function."
                                chosenAlgo={benchmark}
                                setChosenAlgo={setBenchmark}
                                currentStep={currentStep}
                                nextStep={7}
                                setCurrentStep={setCurrentStep}
                                algoData={benchmarkData}
                            />
                        )}

                        {currentStep >= 7 && (
                            <ConfigurePopulationSizeAndGenerations
                                populationSize={populationSize}
                                generations={generations}
                                setPopulationSize={setPopulationSize}
                                setGenerations={setGenerations}
                                currentStep={currentStep}
                                nextStep={8}
                                setCurrentStep={setCurrentStep}
                            />
                        )}

                        {currentStep >= 7 && (
                            // TODO: Disable button if any of the fields are absent.
                            <div className="mt-4">
                                <button
                                    className="bg-foreground text-background p-2 rounded-lg w-full hover:opacity-70 active:opacity-50"
                                    disable={!validateInput()}
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
