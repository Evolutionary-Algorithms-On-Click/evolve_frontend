"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { DnaIcon, Loader2, LogOut } from "lucide-react";

export default function Results() {
    const [userData, setUserData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

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

            // Fetch the run data
            fetch(
                (process.env.NEXT_PUBLIC_BACKEND_BASE_URL ??
                    "http://localhost:5002") + "/api/runs",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                },
            )
                .then((res) => {
                    switch (res.status) {
                        case 200:
                            res.json().then((data) => {
                                // Group the runs by type
                                const groupedData = {};
                                data.data.forEach((run) => {
                                    if (groupedData[run.type]) {
                                        groupedData[run.type].push(run);
                                    } else {
                                        groupedData[run.type] = [run];
                                    }
                                });
                                setRunData(groupedData);
                            });
                            break;
                        case 401:
                            localStorage.clear();
                            window.location.href = "/auth";
                            break;
                        default:
                            console.error("Failed to fetch run data.");
                            break;
                    }
                })
                .catch((err) => {
                    console.error("Failed to fetch run data.", err);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, []);

    const [runData, setRunData] = useState({});
    const [activeTab, setActiveTab] = useState("gp");

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

            {isLoading && (
                <div className="flex flex-col text-center justify-center items-center mt-8">
                    <Loader2 size={32} />
                    <p className="text-gray-600 mt-4">Loading runs...</p>
                </div>
            )}

            {/* Display grouped run cards */}
            {!isLoading && Object.keys(runData).length === 0 ? (
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
                !isLoading && (
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
                                className={`rounded-full border border-solid transition-colors flex items-center justify-center gap-2 text-sm sm:text-base px-6 py-2 sm:px-8 shadow-md ${activeTab === "ea" ? "bg-foreground text-background" : "bg-background text-foreground"}`}
                                onClick={() => setActiveTab("ea")}
                            >
                                Without Genetic Programming
                            </button>
                            <button
                                className={`rounded-full border border-solid transition-colors flex items-center justify-center gap-2 text-sm sm:text-base px-6 py-2 sm:px-8 shadow-md ${activeTab === "pso" ? "bg-foreground text-background" : "bg-background text-foreground"}`}
                                onClick={() => setActiveTab("pso")}
                            >
                                Particle Swarm Optimization
                            </button>
                            <button
                                className={`rounded-full border border-solid transition-colors flex items-center justify-center gap-2 text-sm sm:text-base px-6 py-2 sm:px-8 shadow-md ${activeTab === "ml" ? "bg-foreground text-background" : "bg-background text-foreground"}`}
                                onClick={() => setActiveTab("ml")}
                            >
                                Optimized ML Models with EA
                            </button>
                        </div>
                        {Object.keys(runData).map(
                            (runType) =>
                                activeTab === runType && (
                                    <div key={runType} className="w-full">
                                        <h2 className="text-lg font-bold text-center mb-4">
                                            {runType === "gp"
                                                ? "Genetic Programming"
                                                : runType === "ea"
                                                  ? "Without Genetic Programming"
                                                  : runType === "pso"
                                                    ? "Particle Swarm Optimization"
                                                    : runType === "ml"
                                                      ? "Optimized ML Models with EA"
                                                      : "Unknown Run Type"}
                                        </h2>
                                        <div className="flex flex-wrap justify-center gap-8">
                                            {runData[runType].map((run) => (
                                                <div
                                                    key={run.id}
                                                    className="bg-white rounded-3xl shadow-md border-2 border-gray-400 hover:border-black transition-colors duration-300 p-4 w-72 flex flex-col"
                                                >
                                                    <div className="aspect-w-1 aspect-h-1 relative overflow-hidden rounded-md mb-4">
                                                        <Image
                                                            src={
                                                                `http://localhost:9000/code/${run.id}/` +
                                                                (runType ===
                                                                "ea"
                                                                    ? "fitness_plot.png"
                                                                    : runType ===
                                                                        "gp"
                                                                      ? "graph.png"
                                                                      : runType ===
                                                                          "pso"
                                                                        ? "pso_animation.gif"
                                                                        : "fitness_plot.png")
                                                            }
                                                            alt={runType}
                                                            width={300}
                                                            height={300}
                                                            style={{
                                                                objectFit:
                                                                    "cover",
                                                            }}
                                                            className="transition-transform duration-500 hover:scale-110"
                                                        />
                                                    </div>
                                                    <p className="text-gray-600 text-sm truncate">
                                                        {run.description}
                                                    </p>
                                                    <p className="text-gray-500 text-xs mt-2">
                                                        {run.name.split("-")[0]}{" "}
                                                        generations
                                                    </p>
                                                    <p className="text-gray-500 text-xs">
                                                        {run.name.split("-")[1]}{" "}
                                                        individuals
                                                    </p>

                                                    {run.status ===
                                                        "completed" && (
                                                        <p className="text-green-600 text-xs mt-2">
                                                            {run.status}
                                                        </p>
                                                    )}
                                                    {run.status ===
                                                        "running" && (
                                                        <p className="text-yellow-600 text-xs mt-2">
                                                            {run.status}
                                                        </p>
                                                    )}
                                                    {run.status ===
                                                        "pending" && (
                                                        <p className="text-orange-600 text-xs mt-2">
                                                            {run.status}
                                                        </p>
                                                    )}
                                                    {run.status ===
                                                        "failed" && (
                                                        <p className="text-red-600 text-xs mt-2">
                                                            {run.status}
                                                        </p>
                                                    )}

                                                    <p className="text-gray-500 text-xs mt-2 mb-6">
                                                        Created At:{" "}
                                                        {
                                                            run.createdAt
                                                                .toString()
                                                                .split(".")[0]
                                                        }
                                                    </p>
                                                    <Link
                                                        className="rounded-full border border-solid border-yellow-900 transition-colors flex items-center justify-center bg-yellow-400 text-black hover:bg-yellow-50 gap-2 text-sm sm:text-base p-2 h-8 mt-auto w-full"
                                                        href={`/bin/${runType}/${run.id}`}
                                                    >
                                                        <DnaIcon size={24} />
                                                        View Run
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ),
                        )}
                    </div>
                )
            )}
        </main>
    );
}
