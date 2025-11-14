"use client";

import React from "react";
import Link from "next/link";
import { LogOut, Plus, PlayCircle, BookOpen } from "lucide-react";

// Card Component (simple, minimal)
const Card = ({ item, type }) => {
    const accents = [
        "bg-amber-200",
        "bg-emerald-200",
        "bg-blue-200",
        "bg-purple-200",
        "bg-rose-200",
        "bg-teal-200",
    ];

    const accent = accents[item.id % accents.length];

    return (
        <div className="relative rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${accent}`} />

            <div className="p-4 pl-7 flex items-center gap-4">
                <div className="w-10 h-10 grid place-items-center">
                    {type === "run" ? (
                        <PlayCircle className="w-6 h-6 text-gray-600" />
                    ) : (
                        <BookOpen className="w-6 h-6 text-gray-600" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium text-gray-900 truncate">
                        {item.title}
                    </h3>
                    <div className="text-xs text-gray-500 mt-1 truncate">
                        {item.date}
                        {item.metadata ? ` • ${item.metadata}` : ""}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Create New Card Component (subtle)
const CreateCard = ({ onClick, label }) => {
    return (
        <button
            onClick={onClick}
            className="relative rounded-2xl border border-dashed border-gray-200 hover:border-gray-300 bg-white h-full  transition-shadow hover:shadow-md p-6 flex items-center justify-center"
        >
            <div className="flex gap-3 place-items-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 grid place-items-center">
                    <Plus className="w-6 h-6 text-gray-600" />
                </div>
                <span className="text-base font-medium text-gray-700">
                    {label}
                </span>
            </div>
        </button>
    );
};

// Main App
export default function NotebookDashboard() {
    const previousRuns = [
        {
            id: 0,
            title: "Q3 Sales Analysis Run",
            date: "Nov 10, 2025",
            metadata: "5 cells executed",
        },
        {
            id: 1,
            title: "Data Cleaning Pipeline",
            date: "Nov 8, 2025",
            metadata: "23 cells executed",
        },
        {
            id: 2,
            title: "ML Model Training",
            date: "Nov 5, 2025",
            metadata: "18 cells executed",
        },
        {
            id: 3,
            title: "Statistical Analysis",
            date: "Nov 2, 2025",
            metadata: "15 cells executed",
        },
    ];

    const notebooks = [
        {
            id: 4,
            title: "Data Analysis.ipynb",
            date: "Nov 12, 2025",
            metadata: "45 cells",
        },
        {
            id: 5,
            title: "ML Experiments.ipynb",
            date: "Nov 9, 2025",
            metadata: "32 cells",
        },
        {
            id: 0,
            title: "Visualization Tests.ipynb",
            date: "Nov 7, 2025",
            metadata: "28 cells",
        },
        {
            id: 1,
            title: "API Integration.ipynb",
            date: "Nov 4, 2025",
            metadata: "19 cells",
        },
    ];

    return (
        <main className="flex flex-col justify-center items-center min-h-screen font-[family-name:var(--font-geist-mono)] p-8">
            <div className="text-center">
                <h1 className="text-3xl sm:text-4xl font-bold">
                    Evolve OnClick
                </h1>
                <p>Run and Visualize algorithms with just a click.</p>
            </div>

            <div className="flex flex-row gap-4 mt-4">
                <Link
                    href="/create"
                    className="rounded-full border border-solid border-black/[.08] transition-colors flex items-center justify-center bg-background text-foreground hover:bg-[#000000] hover:text-background text-sm sm:text-base px-4 py-2 mt-2"
                >
                    ← Go Back
                </Link>
            </div>

            <div className="w-full max-w-8xl mt-8 bg-gray-50 rounded-2xl overflow-hidden shadow-md">
                <div className="p-8">
                    <div className="grid grid-cols-2 gap-8">
                        {/* Notebooks Section */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                                Notebooks
                            </h2>
                            <div className="grid grid-cols-2 gap-6">
                                <CreateCard
                                    onClick={() => alert("Create new notebook")}
                                    label="Create Notebook"
                                />
                                {notebooks.map((notebook) => (
                                    <Card
                                        key={`nb-${notebook.id}`}
                                        item={notebook}
                                        type="notebook"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Previous Runs Section */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                                Previous Runs
                            </h2>
                            <div className="grid grid-cols-2 gap-6">
                                {previousRuns.map((run) => (
                                    <Card
                                        key={`run-${run.id}`}
                                        item={run}
                                        type="run"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
