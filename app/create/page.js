"use client";

import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ChooseGpOrNotGp() {
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

    return (
        <main className="flex flex-col items-center justify-between min-h-screen p-4 bg-gradient-to-br from-gray-50 to-gray-100 font-[family-name:var(--font-geist-mono)]">
            <header className="flex flex-col w-full justify-center items-center p-4">
                <div className="flex items-center space-x-2 h-32">
                    <Image
                        src="/LOGO.png"
                        alt="EVOLVE OnClick logo"
                        height={320}
                        width={680}
                        className="rounded-md"
                    />
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
            </header>
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Unleash the Power of Evolution
                    </h1>
                    <p className="text-lg text-gray-600">
                        Explore different evolutionary algorithms to optimize
                        your solutions.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Link
                        href="/create/non-gp"
                        className="block h-full rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="bg-gradient-to-br h-full rounded-xl overflow-hidden from-green-50 to-green-100 p-6 flex flex-col items-center justify-center">
                            <div className="text-5xl mb-3">🚀</div>
                            <div className="font-bold text-lg text-center text-gray-700">
                                Evolutionary Algorithm (EA)
                            </div>
                            <div className="text-sm text-gray-500 text-center mt-2">
                                DE & Non-GP Approach
                            </div>
                        </div>
                    </Link>
                    <Link
                        href="/create/gp"
                        className="block h-full rounded-xl   shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="bg-gradient-to-br h-full rounded-xl overflow-hidden from-blue-50 to-blue-100 p-6 flex flex-col items-center justify-center">
                            <div className="text-5xl mb-3">🧬</div>
                            <div className="font-bold text-lg text-center text-gray-700">
                                Genetic Programming (GP)
                            </div>
                            <div className="text-sm text-gray-500 text-center mt-2">
                                Evolve Programs
                            </div>
                        </div>
                    </Link>
                    <Link
                        href="/create/pso"
                        className="block h-full rounded-xl   shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="bg-gradient-to-br h-full rounded-xl overflow-hidden from-purple-50 to-purple-100 p-6 flex flex-col items-center justify-center">
                            <div className="text-5xl mb-3">🕊️</div>
                            <div className="font-bold text-lg text-center text-gray-700">
                                Particle Swarm Optimization (PSO)
                            </div>
                            <div className="text-sm text-gray-500 text-center mt-2">
                                Swarm Intelligence
                            </div>
                        </div>
                    </Link>
                    <Link
                        href="/create/ml"
                        className="block h-full rounded-xl   shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="bg-gradient-to-br h-full rounded-xl overflow-hidden from-yellow-50 to-yellow-100 p-6 flex flex-col items-center justify-center">
                            <div className="text-5xl mb-3">🤖</div>
                            <div className="font-bold text-lg text-center text-gray-700">
                                EA for ML Model Tuning
                            </div>
                            <div className="text-sm text-gray-500 text-center mt-2">
                                Fine-tune ML models with EA
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="text-center mt-12 mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        Build Your Own
                    </h2>
                    <p className="text-md text-gray-600">
                        Dive into advanced customization with a blank notebook.
                    </p>
                </div>
                <div className="w-full max-w-2xl mx-auto">
                    <Link
                        href="/create/custom-ea"
                        className="block w-full rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                        <div className="bg-gradient-to-br from-teal-500 to-teal-700 text-white p-8 flex flex-col items-center justify-center rounded-xl overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                            <div className="text-6xl mb-4">🎨</div>
                            <div className="font-bold text-2xl text-center">
                                Custom Notebook Development
                            </div>
                            <div className="text-lg text-center mt-2 opacity-90">
                                Start with a blank slate for advanced problem-solving
                            </div>
                            <div className="mt-4 px-6 py-3 bg-white text-teal-700 rounded-full font-semibold text-lg shadow-md hover:bg-gray-100 transition-colors duration-300">
                                Create Custom Notebook →
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
            <footer className="flex justify-center space-x-4 p-4">
                <Link
                    href="/"
                    className="bg-white hover:bg-gray-200 text-gray-700 rounded-full px-6 py-3 transition-colors duration-300 border border-gray-300"
                >
                    ← Back to Home
                </Link>
                <Link
                    href="/bin"
                    className="bg-white hover:bg-gray-200 text-gray-700 rounded-full px-6 py-3 transition-colors duration-300 border border-gray-300"
                >
                    Previous Runs →
                </Link>
            </footer>
        </main>
    );
}
