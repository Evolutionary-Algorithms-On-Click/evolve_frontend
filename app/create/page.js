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
        <main className="flex flex-col items-center justify-between min-h-screen p-4 bg-background font-[family-name:var(--font-geist-mono)]">
            <header className="flex flex-col w-full justify-center items-center p-4">
                <div className="flex items-center space-x-2 h-32 bg-white rounded-lg p-4">
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
                    <h1 className="text-4xl font-bold text-foreground mb-4">
                        Unleash the Power of Evolution
                    </h1>
                    <p className="text-lg text-gray-400">
                        Explore different evolutionary algorithms to optimize
                        your solutions.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Link
                        href="/create/non-gp"
                        className="block h-full rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="bg-gradient-to-br h-full rounded-xl overflow-hidden from-green-900 to-green-800 p-6 flex flex-col items-center justify-center">
                            <div className="text-5xl mb-3">🚀</div>
                            <div className="font-bold text-lg text-center text-green-100">
                                Evolutionary Algorithm (EA)
                            </div>
                            <div className="text-sm text-green-300 text-center mt-2">
                                DE & Non-GP Approach
                            </div>
                        </div>
                    </Link>
                    <Link
                        href="/create/gp"
                        className="block h-full rounded-xl   shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="bg-gradient-to-br h-full rounded-xl overflow-hidden from-blue-900 to-blue-800 p-6 flex flex-col items-center justify-center">
                            <div className="text-5xl mb-3">🧬</div>
                            <div className="font-bold text-lg text-center text-blue-100">
                                Genetic Programming (GP)
                            </div>
                            <div className="text-sm text-blue-300 text-center mt-2">
                                Evolve Programs
                            </div>
                        </div>
                    </Link>
                    <Link
                        href="/create/pso"
                        className="block h-full rounded-xl   shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="bg-gradient-to-br h-full rounded-xl overflow-hidden from-purple-900 to-purple-800 p-6 flex flex-col items-center justify-center">
                            <div className="text-5xl mb-3">🕊️</div>
                            <div className="font-bold text-lg text-center text-purple-100">
                                Particle Swarm Optimization (PSO)
                            </div>
                            <div className="text-sm text-purple-300 text-center mt-2">
                                Swarm Intelligence
                            </div>
                        </div>
                    </Link>
                    <Link
                        href="/create/ml"
                        className="block h-full rounded-xl   shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="bg-gradient-to-br h-full rounded-xl overflow-hidden from-yellow-900 to-yellow-800 p-6 flex flex-col items-center justify-center">
                            <div className="text-5xl mb-3">🤖</div>
                            <div className="font-bold text-lg text-center text-yellow-100">
                                EA for ML Model Tuning
                            </div>
                            <div className="text-sm text-yellow-300 text-center mt-2">
                                Fine-tune ML models with EA
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
            <footer className="flex justify-center space-x-4 p-4">
                <Link
                    href="/"
                    className="bg-gray-900 hover:bg-gray-800 text-foreground rounded-full px-6 py-3 transition-colors duration-300 border border-gray-700"
                >
                    ← Back to Home
                </Link>
                <Link
                    href="/bin"
                    className="bg-gray-900 hover:bg-gray-800 text-foreground rounded-full px-6 py-3 transition-colors duration-300 border border-gray-700"
                >
                    Previous Runs →
                </Link>
            </footer>
        </main>
    );
}
