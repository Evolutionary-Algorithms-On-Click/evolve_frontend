"use client";

import React from "react";
import Link from "next/link";
import { LogOut, Plus, PlayCircle, BookOpen } from "lucide-react";

// Card Component
const Card = ({ item, type }) => {
    const gradients = [
        "from-amber-700 to-amber-900",
        "from-emerald-700 to-emerald-900",
        "from-blue-600 to-blue-800",
        "from-purple-700 to-purple-900",
        "from-rose-700 to-rose-900",
        "from-teal-700 to-teal-900",
    ];

    const gradient = gradients[item.id % gradients.length];

    return (
        <div
            className={`relative rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden bg-gradient-to-br ${gradient}`}
        >
            {/* Three dots menu */}
            <div className="absolute top-4 right-4 z-10">
                <button className="w-8 h-8 rounded-full hover:bg-white/20 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="grid gap-1">
                        <div className="w-1 h-1 rounded-full bg-white"></div>
                        <div className="w-1 h-1 rounded-full bg-white"></div>
                        <div className="w-1 h-1 rounded-full bg-white"></div>
                    </div>
                </button>
            </div>

            {/* Card content */}
            <div className="p-6">
                {/* Icon */}
                <div className="mb-6">
                    <div className="w-16 h-16 grid place-items-center">
                        {type === "run" ? (
                            <PlayCircle className="w-12 h-12 text-white/90" />
                        ) : (
                            <BookOpen className="w-12 h-12 text-white/90" />
                        )}
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-medium text-white mb-3 line-clamp-2 min-h-[3.5rem]">
                    {item.title}
                </h3>

                {/* Metadata */}
                <div className="grid grid-flow-col auto-cols-max gap-3 text-sm text-white/80">
                    <span>{item.date}</span>
                    {item.metadata && (
                        <>
                            <span>•</span>
                            <span>{item.metadata}</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// Create New Card Component
const CreateCard = ({ onClick, label }) => {
    return (
        <button
            onClick={onClick}
            className="relative rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden border-2 border-dashed border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100 h-full min-h-[240px]"
        >
            <div className="p-6 h-full grid place-items-center">
                <div className="grid gap-4 place-items-center">
                    <div className="w-16 h-16 rounded-full bg-gray-200 group-hover:bg-gray-300 grid place-items-center transition-colors">
                        <Plus className="w-8 h-8 text-gray-600" />
                    </div>
                    <span className="text-lg font-medium text-gray-700">
                        {label}
                    </span>
                </div>
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
                    </div>
                </div>
            </div>
        </main>
    );
}
