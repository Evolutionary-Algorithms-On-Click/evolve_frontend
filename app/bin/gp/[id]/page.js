"use client";

import PreviewGP from "@/app/_components/gp/preview";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GPRunResult() {
    const [data, setData] = useState(null);
    const [codeContent, setCodeContent] = useState("");
    const [logsContent, setLogsContent] = useState("");
    const [bestFitness, setBestFitness] = useState("");

    const [showCode, setShowCode] = useState(false);
    const [showLogs, setShowLogs] = useState(false);
    const { id } = useParams();

    const router = useRouter();

    /*
{"algorithm":"eaSimple",
"arity":1,"operators":["add","mul","sub","div"],"argNames":["x"],"individualType":"PrimitiveTree","expr":"genFull","min_":1,"max_":4,"realFunction":"1*x**3 + 1*x**2 + 1*x + 1","individualFunction":"initIterate","populationFunction":"initRepeat","selectionFunction":"selRoulette","tournamentSize":0,"expr_mut":"genFull","expr_mut_min":1,"expr_mut_max":3,"crossoverFunction":"cxOnePoint","terminalProb":0.1,"mutationFunction":"mutUniform","mutationMode":"one","mateHeight":1,"mutHeight":3,"weights":[1],"populationSize":2000,"generations":5,"cxpb":0.5,"mutpb":0.2,"mu":0,"lambda_":0,"hofSize":5,"individualSize":10}
*/

    useEffect(() => {
        const cacheData = localStorage.getItem(id);
        if (cacheData) {
            const parsedData = JSON.parse(cacheData);
            setData(parsedData);

            // Fetch the code content.
            fetch(parsedData.code)
                .then((response) => response.text())
                .then((text) => setCodeContent(text))
                .catch((error) =>
                    console.error("Error fetching code content:", error),
                );

            // Fetch the logs content.
            fetch(parsedData.logs)
                .then((response) => response.text())
                .then((text) => setLogsContent(text))
                .catch((error) =>
                    console.error("Error fetching logs content:", error),
                );

            // Fetch the best fitness.
            fetch(parsedData.bestFitness)
                .then((response) => response.text())
                .then((text) => setBestFitness(text))
                .catch((error) =>
                    console.error("Error fetching best fitness:", error),
                );
        } else {
            router.replace("/");
        }
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

            <div className="flex flex-row items-center gap-4 mt-4">
                <Link
                    href="/create/gp"
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
                {!data ? (
                    <p className="text-gray-600">Loading...</p>
                ) : (
                    <div className="flex flex-row flex-wrap justify-center items-start gap-4">
                        <PreviewGP
                            algo={data["inputData"]["algorithm"]}
                            parameters={data["inputData"]["parameters"]}
                            indGen={data["inputData"]["individualFunction"]}
                            primitiveSet={data["inputData"]["operators"]}
                            treeGenExpression={data["inputData"]["expr"]}
                            minHeight={data["inputData"]["min_"]}
                            maxHeight={data["inputData"]["max_"]}
                            popFunc={data["inputData"]["populationFunction"]}
                            selectFunc={data["inputData"]["selectionFunction"]}
                            tempTourSize={data["inputData"]["tournamentSize"]}
                            mutateFunc={data["inputData"]["mutationFunction"]}
                            mode={data["inputData"]["mutationMode"]}
                            mutExpr={data["inputData"]["expr_mut"]}
                            mutMinHeight={data["inputData"]["expr_mut_min"]}
                            mutMaxHeight={data["inputData"]["expr_mut_max"]}
                            matingFunc={data["inputData"]["crossoverFunction"]}
                            terminalProb={data["inputData"]["terminalProb"]}
                            mateHeightLimit={data["inputData"]["mateHeight"]}
                            mutateHeightLimit={data["inputData"]["mutHeight"]}
                            generations={data["inputData"]["generations"]}
                            populationSize={data["inputData"]["populationSize"]}
                            cxpb={data["inputData"]["cxpb"]}
                            mutpb={data["inputData"]["mutpb"]}
                            hofSize={data["inputData"]["hofSize"]}
                            currentStep={13}
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
                                <div className="w-[100%] flex flex-col">
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
                                    <pre className="rounded-lg text-sm mt-4">
                                        <code className="">{logsContent}</code>
                                    </pre>
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-xl font-bold text-gray-800 mt-4">
                                        Best Individual Fitness
                                    </h3>
                                    <pre className="rounded-lg text-sm mt-4 overflow-auto w-[200px]">
                                        <code className="overflow-auto text-wrap">
                                            {bestFitness}
                                        </code>
                                    </pre>
                                    <div className="mt-4">
                                        <h3 className="text-lg font-bold text-gray-800">
                                            Best Individual Plot
                                        </h3>
                                        <Image
                                            src={data && data.plots.treePlot}
                                            alt="Fitness Plot"
                                            width={800}
                                            height={100}
                                            className="mt-2 rounded-lg shadow-sm border"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
