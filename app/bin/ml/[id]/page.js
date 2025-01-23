"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MLExecResult() {
    const [data, setData] = useState(null);
    const [codeContent, setCodeContent] = useState("");
    const [bestContent, setBestContent] = useState("");
    const [logbookContent, setLogbookContent] = useState("");

    const [showLogbook, setShowLogbook] = useState(false);
    const [showCode, setShowCode] = useState(false);

    const { id } = useParams();
    const router = useRouter();

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

            // Fetch the best content.
            fetch(parsedData.best)
                .then((response) => response.text())
                .then((text) => setBestContent(text))
                .catch((error) =>
                    console.error("Error fetching best content:", error),
                );

            // Fetch logbook content.
            fetch(parsedData.logbook)
                .then((response) => response.text())
                .then((text) => setLogbookContent(text))
                .catch((error) =>
                    console.error("Error fetching logbook content:", error),
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
                    href="/create/ml"
                    className="rounded-full border border-solid border-black/[.08] transition-colors flex items-center justify-center bg-background text-foreground hover:bg-[#000000] hover:text-background text-sm sm:text-base px-4 py-2 mt-8"
                >
                    ← Go Back
                </Link>
                <button
                    className="rounded-full border border-solid border-gray-300 transition-colors flex items-center justify-center bg-white text-gray-900 hover:bg-gray-200 text-sm sm:text-base px-4 py-2 mt-8"
                    onClick={(e) => {
                        e.preventDefault();
                        setShowLogbook(false);
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
                        setShowLogbook(!showLogbook);
                    }}
                >
                    {showLogbook ? "Hide Logs (x)" : "Show Logs (+)"}
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
                    <div className="flex flex-row flex-wrap justify-center items-start">
                        {/* TODO: Show Preview */}
                        <div className="flex flex-col items-start border border-gray-400 rounded-2xl p-4 bg-white shadow-lg w-full">
                            {showCode ? (
                                <div>
                                    <h3 className="text-xl font-bold text-black">
                                        Code
                                    </h3>
                                    <pre className="bg-black text-green-400 p-4 rounded-lg overflow-auto text-sm mt-4">
                                        <code className="overflow-auto text-wrap">
                                            {codeContent}
                                        </code>
                                    </pre>
                                </div>
                            ) : showLogbook ? (
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
                                                [logbookContent],
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
                                        <code className="">
                                            {logbookContent}
                                        </code>
                                    </pre>
                                </div>
                            ) : (
                                <>
                                    {/* "code","best","logbook","plots","inputData" */}
                                    <h3 className="text-xl font-bold text-gray-800">
                                        Results
                                    </h3>
                                    <pre className="rounded-lg text-sm mt-4">
                                        <code className="text-wrap">
                                            {bestContent}
                                        </code>
                                    </pre>

                                    <div className="mt-4">
                                        <h5 className="text-lg font-bold text-gray-800">
                                            Fitness Plot
                                        </h5>
                                        <Image
                                            src={data && data.plots.fitnessPlot}
                                            alt="Fitness Plot"
                                            width={800}
                                            height={100}
                                            className="mt-2 rounded-lg shadow-md"
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
