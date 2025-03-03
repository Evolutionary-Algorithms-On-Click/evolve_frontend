"use client";

import Link from "next/link";

export default function ChooseGpOrNotGp() {
    return (
        <main className="flex items-center justify-center min-h-screen p-8 bg-gradient-to-br from-gray-100 to-gray-200 font-[family-name:var(--font-geist-mono)]">
            <div className="w-full max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
                    Choose Your Path
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Link
                        href="/create/non-gp"
                        className="rounded-2xl border border-black shadow-md flex flex-col items-center justify-between p-6 hover:shadow-lg transition-shadow duration-300 bg-gray-50 hover:bg-white"
                    >
                        <div className="flex flex-col items-center">
                            <div className="text-5xl mb-3">🚀</div>
                            <div className="font-bold text-lg text-center text-gray-700">
                                Evolutionary Algorithm (EA)
                            </div>
                        </div>
                        <div className="text-sm text-gray-500 text-center mt-4">
                            Non-GP Approach
                        </div>
                    </Link>
                    <Link
                        href="/create/gp"
                        className="rounded-2xl border border-black shadow-md flex flex-col items-center justify-between p-6 hover:shadow-lg transition-shadow duration-300 bg-green-50 hover:bg-green-100"
                    >
                        <div className="flex flex-col items-center">
                            <div className="text-5xl mb-3">🧬</div>
                            <div className="font-bold text-lg text-center text-gray-700">
                                Genetic Programming (GP)
                            </div>
                        </div>
                        <div className="text-sm text-gray-500 text-center mt-4">
                            Evolve Programs
                        </div>
                    </Link>
                    <Link
                        href="/create/pso"
                        className="rounded-2xl border border-black shadow-md flex flex-col items-center justify-between p-6 hover:shadow-lg transition-shadow duration-300 bg-blue-50 hover:bg-blue-100"
                    >
                        <div className="flex flex-col items-center">
                            <div className="text-5xl mb-3">🕊️</div>
                            <div className="font-bold text-lg text-center text-gray-700">
                                Particle Swarm Optimization (PSO)
                            </div>
                        </div>
                        <div className="text-sm text-gray-500 text-center mt-4">
                            Swarm Intelligence
                        </div>
                    </Link>
                    <Link
                        href="/create/ml"
                        className="rounded-2xl border border-black shadow-md flex flex-col items-center justify-between p-6 hover:shadow-lg transition-shadow duration-300 bg-yellow-50 hover:bg-yellow-100"
                    >
                        <div className="flex flex-col items-center">
                            <div className="text-5xl mb-3">🤖</div>
                            <div className="font-bold text-lg text-center text-gray-700">
                                EA for ML Model Tuning
                            </div>
                        </div>
                        <div className="text-sm text-gray-500 text-center mt-4">
                            Fine-tune ML models with EA
                        </div>
                    </Link>
                </div>
                <div className="mt-12 flex justify-center space-x-4">
                    <Link
                        href="/"
                        className="rounded-full border border-solid border-gray-300 transition-colors flex items-center justify-center bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-sm sm:text-base px-6 py-3"
                    >
                        ← Back to Home
                    </Link>
                    <Link
                        href="/bin"
                        className="rounded-full border border-solid border-gray-300 transition-colors flex items-center justify-center bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-sm sm:text-base px-6 py-3"
                    >
                        Previous Runs →
                    </Link>
                </div>
            </div>
        </main>
    );
}
