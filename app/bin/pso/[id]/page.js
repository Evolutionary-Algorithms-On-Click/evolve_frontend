"use client";

import PreviewPSO from "@/app/_components/pso/preview";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PSOExecResult() {
    const [data, setData] = useState(null);
    const [inputParams, setInputParams] = useState(null);
    const [codeContent, setCodeContent] = useState("");
    const [logsContent, setLogsContent] = useState("");
    const [bestContent, setBestContent] = useState("");
    const [executionStatus, setExecutionStatus] = useState("running");

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
                    setExecutionStatus(responseData.data.status);

                    if (responseData.data.status === "completed") {
                        fetchLogsContent();
                        fetchBestContent();
                    } else if (responseData.data.status === "error") {
                        console.error("Execution failed on backend");
                    } else {
                        setTimeout(fetchData, 4000);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    setExecutionStatus("error");
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
            fetch(`http://localhost:9000/code/${id}/code.py`)
                .then((response) => response.text())
                .then((text) => setCodeContent(text))
                .catch((error) =>
                    console.error("Error fetching code content:", error),
                );
        };

        const fetchLogsContent = () => {
            fetch(`http://localhost:9000/code/${id}/logbook.txt`)
                .then((response) => response.text())
                .then((text) => setLogsContent(text))
                .catch((error) =>
                    console.error("Error fetching logs content:", error),
                );
        };

        const fetchBestContent = () => {
            fetch(`http://localhost:9000/code/${id}/best.txt`)
                .then((response) => response.text())
                .then((text) => setBestContent(text))
                .catch((error) =>
                    console.error("Error fetching best content:", error),
                );
        };

        fetchData();
        fetchInputParams();
        fetchCodeContent();
    }, [router, id]);

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

            <div className="mt-4">
                <p className="text-gray-700">
                    Status:{" "}
                    {executionStatus === "completed"
                        ? "Completed"
                        : executionStatus === "running"
                          ? "Running..."
                          : "Error"}
                </p>
                {executionStatus === "running" && (
                    <div className="animate-pulse text-gray-500">
                        Fetching results, please wait...
                    </div>
                )}
                {executionStatus === "error" && (
                    <div className="text-red-500">
                        An error occurred during execution. Please check the
                        logs or try again.
                    </div>
                )}
            </div>

            <div className="flex flex-row items-center gap-4 mt-4">
                <Link
                    href="/create/pso"
                    className="rounded-full border border-solid border-black/[.08] transition-colors flex items-center justify-center bg-background text-foreground hover:bg-[#000000] hover:text-background text-sm sm:text-base px-4 py-2 mt-8"
                >
                    ← Go Back
                </Link>
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
                <Link
                    href="/bin"
                    className="rounded-full border border-solid border-black/[.08] transition-colors flex items-center justify-center bg-background text-foreground hover:bg-[#000000] hover:text-background text-sm sm:text-base px-4 py-2 mt-8"
                >
                    View All Runs →
                </Link>
            </div>

            <div className="flex flex-wrap mt-8 gap-4">
                {inputParams && codeContent ? (
                    <div className="flex flex-wrap border border-gray-400 rounded-2xl bg-white bg-opacity-70">
                        <PreviewPSO
                            algorithm={inputParams.algorithm}
                            dimensions={inputParams.dimensions}
                            weights={inputParams.weights}
                            minPosition={inputParams.minPosition}
                            maxPosition={inputParams.maxPosition}
                            minSpeed={inputParams.minSpeed}
                            maxSpeed={inputParams.maxSpeed}
                            phi1={inputParams.phi1}
                            phi2={inputParams.phi2}
                            benchmark={inputParams.benchmark}
                            populationSize={inputParams.populationSize}
                            generations={inputParams.generations}
                            currentStep={11}
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
                            ) : showLogs ? (
                                <div className="w-full flex flex-col">
                                    <h3 className="text-xl font-bold text-gray-800">
                                        Generation Wise Logs
                                    </h3>
                                    <button
                                        className="rounded-full border border-solid border-gray-300 transition-colors flex items-center justify-center bg-white text-gray-900 hover:bg-gray-200 text-sm sm:text-base px-4 py-2 mt-2 w-fit"
                                        onClick={() => {
                                            const element =
                                                document.createElement("a");
                                            const file = new Blob(
                                                [logsContent],
                                                { type: "text/plain" },
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
                                    <pre className="rounded-lg text-sm mt-4">
                                        <code>{logsContent}</code>
                                    </pre>
                                </div>
                            ) : data && data.status === "completed" ? (
                                <>
                                    {bestContent && (
                                        <>
                                            <h3 className="text-xl font-bold text-gray-800 mt-4">
                                                Best Individual Fitness
                                            </h3>
                                            <pre className="rounded-lg text-sm mt-4 overflow-auto w-[200px]">
                                                <code className="overflow-auto text-wrap">
                                                    {bestContent}
                                                </code>
                                            </pre>
                                        </>
                                    )}
                                    {data && data.status === "completed" && (
                                        <div>
                                            <div className="mt-4">
                                                <h3 className="text-lg font-bold text-gray-800">
                                                    PSO Visualization -
                                                    Animation
                                                </h3>
                                                <Image
                                                    src={`http://localhost:9000/code/${id}/pso_animation.gif`}
                                                    alt="Fitness Plot"
                                                    width={800}
                                                    height={100}
                                                    className="mt-2 rounded-lg shadow-sm border"
                                                />
                                            </div>
                                            {/* <div className="mt-4">
                                                <h3 className="text-lg font-bold text-gray-800">
                                                    Fitness Plot
                                                </h3>
                                                <Image
                                                    src={`http://localhost:9000/code/${id}/fitness_plot.png`}
                                                    alt="Fitness Plot"
                                                    width={800}
                                                    height={100}
                                                    className="mt-2 rounded-lg shadow-sm border"
                                                />
                                            </div>
                                            <div className="mt-4">
                                                <h3 className="text-lg font-bold text-gray-800">
                                                    Mutation Crossover Effect plot
                                                </h3>
                                                <Image
                                                    src={`http://localhost:9000/code/${id}/mutation_crossover_effect.png`}
                                                    alt="Fitness Plot"
                                                    width={800}
                                                    height={100}
                                                    className="mt-2 rounded-lg shadow-sm border"
                                                />
                                            </div> */}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="flex items-center gap-2 text-gray-600">
                                    <svg
                                        className="animate-spin h-5 w-5 text-gray-600"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Running...
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-gray-600">
                        <svg
                            className="animate-spin h-5 w-5 text-gray-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        Running...
                    </div>
                )}
            </div>
        </main>
    );
}
