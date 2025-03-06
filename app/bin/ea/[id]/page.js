"use client";

import Preview from "@/app/_components/non-gp/preview";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Execution() {
    const [data, setData] = useState(null);
    const [inputParams, setInputParams] = useState(null);
    const [codeContent, setCodeContent] = useState("");
    const [logsContent, setLogsContent] = useState("");
    const [bestFitness, setBestFitness] = useState("");
    const [executionStatus, setExecutionStatus] = useState("running"); // running, completed, error

    const [showCode, setShowCode] = useState(false);
    const [showLogs, setShowLogs] = useState(false);

    const { id } = useParams();
    const router = useRouter();

    useEffect(() => {
        const fetchData = () => {
            fetch("http://localhost:5002/api/runs/run", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ runID: id }),
            })
                .then((response) => response.json())
                .then((responseData) => {
                    setData(responseData.data);
                    setExecutionStatus(responseData.data.status); // Update status

                    if (responseData.data.status === "completed") {
                        // Data fetching is complete, proceed to fetch other data
                        fetchLogsContent();
                        fetchBestFitness();
                    } else if (responseData.data.status === "error") {
                        // Handle error case
                        console.error("Execution failed on backend");
                    } else {
                        // Data is not yet complete, poll again after 4 seconds
                        setTimeout(fetchData, 4000);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    setExecutionStatus("error"); // Set status to error
                });
        };

        const fetchInputParams = () => {
            fetch(`http://localhost:9000/code/${id}/input.json`)
                .then((response) => response.json())
                .then((data) => setInputParams(data))
                .catch((error) =>
                    console.error("Error fetching input params:", error),
                );
        };

        const fetchCodeContent = () => {
            // Fetch the code content.
            fetch(`http://localhost:9000/code/${id}/code.py`)
                .then((response) => response.text())
                .then((text) => setCodeContent(text))
                .catch((error) =>
                    console.error("Error fetching code content:", error),
                );
        };

        const fetchLogsContent = () => {
            // Fetch the logs content.
            fetch(`http://localhost:9000/code/${id}/logbook.txt`)
                .then((response) => response.text())
                .then((text) => setLogsContent(text))
                .catch((error) =>
                    console.error("Error fetching code content:", error),
                );
        };

        const fetchBestFitness = () => {
            // Fetch the best fitness.
            fetch(`http://localhost:9000/code/${id}/best.txt`)
                .then((response) => response.text())
                .then((text) => setBestFitness(text))
                .catch((error) =>
                    console.error("Error fetching code content:", error),
                );
        };

        // Start fetching immediately
        fetchData();
        fetchInputParams();
        fetchCodeContent();
    }, [router]);

    return (
        <main className="flex flex-col items-center justify-center min-h-screen font-[family-name:var(--font-geist-mono)] p-8 bg-gray-100">
            <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                    Evolve OnClick
                </h1>
                <p className="text-gray-600">
                    Run and Visualize algorithms with just a click.
                </p>
            </div>

            <h2 className="text-xl font-bold text-gray-800">
                Execution ID: {id}
            </h2>

            {/* Execution Status Display */}
            <div className="mt-4">
                <p className="text-gray-700">
                    Status:{" "}
                    {executionStatus === "completed"
                        ? "Completed"
                        : executionStatus === "running"
                          ? "Running..."
                          : "Error"}
                </p>
            </div>

            <div className="flex flex-row items-center gap-4 mt-4">
                <Link
                    href="/create/non-gp"
                    className="rounded-full border border-solid border-black/[.08] transition-colors flex items-center justify-center bg-background text-foreground hover:bg-[#000000] hover:text-background text-sm sm:text-base px-4 py-2 mt-8"
                >
                    ← Go Back
                </Link>
                {codeContent && (
                    <button
                        className="rounded-full border border-solid border-gray-300 transition-colors flex items-center justify-center bg-white text-gray-900 hover:bg-gray-200 text-sm sm:text-base px-4 py-2 mt-8"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowLogs(false);
                            setShowCode(!showCode);
                        }}
                    >
                        {showCode ? "Hide Code </>" : "Show Code </ >"}
                    </button>
                )}
                {logsContent && (
                    <button
                        className="rounded-full border border-solid border-gray-300 transition-colors flex items-center justify-center bg-white text-gray-900 hover:bg-gray-200 text-sm sm:text-base px-4 py-2 mt-8"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowCode(false);
                            setShowLogs(!showLogs);
                        }}
                    >
                        {showLogs ? "Hide Logs (x)" : "Show Logs (-)"}
                    </button>
                )}
                <Link
                    href="/bin"
                    className="rounded-full border border-solid border-black/[.08] transition-colors flex items-center justify-center bg-background text-foreground hover:bg-[#000000] hover:text-background text-sm sm:text-base px-4 py-2 mt-8"
                >
                    View All Runs →
                </Link>
            </div>

            <div className="flex flex-wrap mt-8 gap-4">
                {inputParams && codeContent ? (
                    <div className="flex flex-wrap gap-4 border border-gray-400 rounded-2xl bg-white bg-opacity-70">
                        <Preview
                            algo={inputParams["algorithm"]}
                            parameters={inputParams["weights"]}
                            indGen={inputParams["individual"]}
                            indSize={inputParams["individualSize"]}
                            popFunc={inputParams["populationFunction"]}
                            mateFunc={inputParams["crossoverFunction"]}
                            mutateFunc={inputParams["mutationFunction"]}
                            selectFunc={inputParams["selectionFunction"]}
                            evalFunc={inputParams["evaluationFunction"]}
                            tempTourSize={inputParams["tournamentSize"]}
                            populationSize={inputParams["populationSize"]}
                            generations={inputParams["generations"]}
                            cxpb={inputParams["cxpb"]}
                            mutpb={inputParams["mutpb"]}
                            hofSize={inputParams["hofSize"]}
                            crossOverProb={inputParams["crossOverRate"] ?? 0.25}
                            scalingFactor={inputParams["scalingFactor"] ?? 0.5}
                            currentStep={10}
                        />
                        <div className="flex flex-col items-start border border-gray-400 rounded-2xl p-4 bg-white shadow-lg max-w-[80%]">
                            {showCode ? (
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">
                                        Code
                                    </h3>
                                    <pre className="bg-gray-200 p-4 rounded-lg overflow-auto text-sm mt-4">
                                        <code className="overflow-auto text-wrap">
                                            {codeContent}
                                        </code>
                                    </pre>
                                </div>
                            ) : showLogs && logsContent ? (
                                <div className="w-[700px] flex flex-col items-center justify-center">
                                    <h3 className="text-xl font-bold text-gray-800">
                                        Generation Wise Logs
                                    </h3>
                                    <button
                                        className="rounded-full border border-solid border-gray-300 transition-colors flex items-center justify-center bg-white text-gray-900 hover:bg-gray-200 text-sm sm:text-base px-4 py-2 mt-2 w-fit flex-row"
                                        onClick={() => {
                                            const element =
                                                document.createElement("a");
                                            const file = new Blob(
                                                [logsContent],
                                                {
                                                    type: "text/plain",
                                                },
                                            );
                                            element.href =
                                                URL.createObjectURL(file);
                                            element.download = `logs_${id}.txt`;
                                            document.body.appendChild(element);
                                            element.click();
                                        }}
                                    >
                                        Download Logs
                                    </button>
                                    <pre className="rounded-lg text-sm mt-4 w-full overflow-auto flex items-center justify-center">
                                        <code className="text-center">
                                            {logsContent}
                                        </code>
                                    </pre>
                                </div>
                            ) : executionStatus === "completed" ? (
                                <>
                                    {bestFitness && (
                                        <>
                                            <h3 className="text-xl font-bold text-gray-800 mt-4">
                                                Best Individual Fitness
                                            </h3>
                                            <pre className="rounded-lg text-sm mt-4 overflow-auto w-[200px]">
                                                <code className="overflow-auto text-wrap">
                                                    {bestFitness}
                                                </code>
                                            </pre>
                                        </>
                                    )}

                                    <div className="mt-4">
                                        <h3 className="text-lg font-bold text-gray-800">
                                            Plot
                                        </h3>
                                        <h5 className="text-sm text-gray-600">
                                            Fitness Plot
                                        </h5>
                                        <Image
                                            src={
                                                "http://localhost:9000/code/" +
                                                id +
                                                "/fitness_plot.png"
                                            }
                                            alt="Fitness Plot"
                                            width={800}
                                            height={100}
                                            className="mt-2 rounded-lg shadow-md"
                                        />
                                        <h5 className="text-sm text-gray-600 mt-4">
                                            Mutation CrossOver Effect Plot
                                        </h5>
                                        <Image
                                            src={
                                                "http://localhost:9000/code/" +
                                                id +
                                                "/mutation_crossover_effect.png"
                                            }
                                            alt="Mutation CrossOver Effect Plot"
                                            width={800}
                                            height={100}
                                            className="mt-2 rounded-lg shadow-md"
                                        />
                                    </div>
                                </>
                            ) : (
                                <p className="text-gray-600">Running...</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-600">Running...</p>
                )}
            </div>
        </main>
    );
}
