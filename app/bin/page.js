"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";

export default function CachedResults() {
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

    const [cacheData, setCacheData] = useState({});
    const [activeTab, setActiveTab] = useState("gp");

    useEffect(() => {
        const storedData = JSON.parse(
            localStorage.getItem("executionHistory") || "[]",
        );
        const groupedData = storedData.reduce((acc, data) => {
            const {
                inputData: { runType },
            } = data;
            if (!acc[runType]) {
                acc[runType] = [];
            }
            acc[runType].push(data);
            return acc;
        }, {});

        // Sort each group by timestamp
        Object.keys(groupedData).forEach((runType) => {
            groupedData[runType].sort(
                (a, b) =>
                    new Date(b.inputData.timestamp) -
                    new Date(a.inputData.timestamp),
            );
        });
        setCacheData(groupedData);
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString(); // Formats to a readable date-time format
    };

    return (
        <main className="flex flex-col font-[family-name:var(--font-geist-mono)] p-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                    Evolve OnClick
                </h1>
                <p className="text-gray-600">
                    Run and Visualize algorithms with just a click.
                </p>
            </div>

            {userData.fullName && (
                <div className="mt-4 flex flex-row gap-2 bg-gray-900 rounded-full px-4 text-[#6eff39] items-center w-fit ml-auto mr-auto">
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

            <div className="flex flex-row gap-4 mt-4 mb-8 ml-auto mr-auto">
                <Link
                    href="/create"
                    className="rounded-full border border-solid border-black/[.08] transition-colors flex items-center justify-center bg-background text-foreground hover:bg-[#000000] hover:text-background text-sm sm:text-base px-4 py-2 mt-8"
                >
                    ← Go Back
                </Link>
                <Link
                    href="/create"
                    className="rounded-full border border-solid border-black/[.08] transition-colors flex items-center justify-center bg-background text-foreground hover:bg-[#000000] hover:text-background text-sm sm:text-base px-4 py-2 mt-8"
                >
                    {"Create ->"}
                </Link>
            </div>

            <h1 className="text-xl font-bold text-center">
                Previous Algorithm Runs
            </h1>

            {/* Display grouped run cards */}
            {Object.keys(cacheData).length === 0 ? (
                <div className="flex flex-col text-center justify-center items-center">
                    <p className="text-gray-600 mb-4">
                        No previous runs found.
                    </p>
                    <Link
                        className="rounded-full border border-solid transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-gray-700 text-sm sm:text-base px-6 py-2 sm:px-8 shadow-md w-fit mt-16"
                        href="/create"
                    >
                        Create New Run
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-8 mt-8">
                    {/* Tab Buttons */}
                    <div className="flex flex-wrap gap-4 mb-8 justify-center items-center">
                        <button
                            className={`rounded-full border border-solid transition-colors flex items-center justify-center gap-2 text-sm sm:text-base px-6 py-2 sm:px-8 shadow-md ${activeTab === "gp" ? "bg-foreground text-background" : "bg-background text-foreground"}`}
                            onClick={() => setActiveTab("gp")}
                        >
                            Genetic Programming
                        </button>
                        <button
                            className={`rounded-full border border-solid transition-colors flex items-center justify-center gap-2 text-sm sm:text-base px-6 py-2 sm:px-8 shadow-md ${activeTab === "non-gp" ? "bg-foreground text-background" : "bg-background text-foreground"}`}
                            onClick={() => setActiveTab("non-gp")}
                        >
                            Without Genetic Programming
                        </button>
                        <button
                            className={`rounded-full border border-solid transition-colors flex items-center justify-center gap-2 text-sm sm:text-base px-6 py-2 sm:px-8 shadow-md ${activeTab === "ml" ? "bg-foreground text-background" : "bg-background text-foreground"}`}
                            onClick={() => setActiveTab("ml")}
                        >
                            Optimized ML Models with EA
                        </button>
                    </div>
                    {Object.keys(cacheData).map(
                        (runType) =>
                            activeTab === runType && (
                                <div key={runType} className="w-full max-w-4xl">
                                    <h2 className="text-lg font-bold text-center mb-4">
                                        {runType === "gp"
                                            ? "Genetic Programming"
                                            : "Without Genetic Programming"}
                                    </h2>
                                    <div className="flex flex-wrap justify-center gap-8">
                                        {cacheData[runType].map((data) => {
                                            const {
                                                inputData,
                                                hallOfFame,
                                                inputData: {
                                                    algorithm,
                                                    runId,
                                                    timestamp,
                                                },
                                                plots: { treePlot },
                                            } = data;

                                            return (
                                                <div
                                                    key={runId}
                                                    className="max-w-sm rounded-3xl border border-gray-300 p-4 shadow-lg bg-white"
                                                >
                                                    {runType === "gp" && (
                                                        <div className="mb-4">
                                                            <Image
                                                                src={treePlot}
                                                                alt="Fitness Plot"
                                                                width={800}
                                                                height={100}
                                                                className="mt-2 rounded-2xl border"
                                                            />
                                                        </div>
                                                    )}
                                                    <h3 className="text-xl font-semibold mb-2">
                                                        {algorithm}
                                                    </h3>

                                                    {/* Execution Date */}
                                                    <p className="text-sm text-gray-600 mb-4">
                                                        Execution Date:{" "}
                                                        {formatDate(
                                                            timestamp ||
                                                                new Date().toISOString(),
                                                        )}
                                                    </p>

                                                    {runType === "non-gp" && (
                                                        <div className="mb-4">
                                                            <h4 className="font-semibold">
                                                                Best Fitness
                                                                Score
                                                            </h4>
                                                            {hallOfFame &&
                                                            hallOfFame.length >
                                                                0 ? (
                                                                <p>
                                                                    Fitness:{" "}
                                                                    {
                                                                        hallOfFame[0]
                                                                            .fitness[0]
                                                                    }
                                                                </p>
                                                            ) : (
                                                                <p>
                                                                    No fitness
                                                                    data
                                                                    available.
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="mb-4">
                                                        <h4 className="font-semibold">
                                                            Generation Data
                                                        </h4>
                                                        <p>
                                                            Generations:{" "}
                                                            {
                                                                inputData.generations
                                                            }
                                                        </p>
                                                        <p>
                                                            Population Size:{" "}
                                                            {
                                                                inputData.populationSize
                                                            }
                                                        </p>
                                                    </div>

                                                    <Link
                                                        className="rounded-full border border-solid transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-gray-700 text-sm sm:text-base px-6 py-2 sm:px-8 shadow-md"
                                                        href={`/bin/${runType}/${runId}`}
                                                    >
                                                        View Execution
                                                    </Link>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ),
                    )}
                </div>
            )}
        </main>
    );
}
