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
        <main className="flex flex-col items-center min-h-screen p-4 bg-gradient-to-br from-gray-50 to-gray-100 font-[family-name:var(--font-geist-mono)]">
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
                    <div className="mt-4 flex flex-row gap-2 bg-gray-900 rounded-full px-4 text-[#6eff39] items-center border border-gray-700 shadow-sm">
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
                            className="text-[#ff2e2e] font-semibold border-l border-gray-600 pl-3 py-2 flex flex-row justify-center items-center hover:opacity-80 transition-opacity"
                        >
                            <LogOut className="mx-1" size={16} />
                        </button>
                    </div>
                )}
            </header>

            <div className="container mx-auto px-4 py-8 space-y-12">
                
                <section>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-green-500 pl-3">Learn</h2>
                        <div className="mt-2">
                            <h1 className="text-lg font-bold text-gray-800">Unleash the Power of Evolution</h1>
                            <p className="text-sm text-gray-500">Explore different evolutionary algorithms to optimize your solutions.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { href: "/create/non-gp", emoji: "🚀", title: "Evolutionary Algorithm", desc: "DE & Non-GP Approach", color: "from-green-50 to-green-100" },
                            { href: "/create/gp", emoji: "🧬", title: "Genetic Programming", desc: "Evolve Programs", color: "from-blue-50 to-blue-100" },
                            { href: "/create/pso", emoji: "🕊️", title: "Particle Swarm", desc: "Swarm Intelligence", color: "from-purple-50 to-purple-100" },
                            { href: "/create/ml", emoji: "🤖", title: "ML Model Tuning", desc: "Fine-tune ML models with EA", color: "from-yellow-50 to-yellow-100" },
                        ].map((item, idx) => (
                            <Link key={idx} href={item.href} className="block group">
                                <div className={`bg-gradient-to-br h-full rounded-xl p-6 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-all border border-gray-100 group-hover:-translate-y-1 ${item.color}`}>
                                    <div className="text-4xl mb-3">{item.emoji}</div>
                                    <div className="font-bold text-md text-center text-gray-700">{item.title}</div>
                                    <div className="text-xs text-gray-500 text-center mt-1">{item.desc}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-teal-500 pl-3">Build</h2>
                            <div className="mt-2">
                                <h3 className="text-lg font-bold text-gray-800">Build Your Own</h3>
                                <p className="text-sm text-gray-500">Dive into advanced customization with a blank notebook.</p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 flex flex-col items-center justify-center shadow-sm border border-teal-200 h-full">
                            <div className="text-4xl mb-3">🎨</div>
                            <div className="font-bold text-md text-center text-gray-700">Custom Notebook Development</div>
                            <div className="text-xs text-gray-500 text-center mt-1 mb-4">Start with a blank slate for advanced problem-solving</div>
                            <Link 
                                href="/create/custom-ea" 
                                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-full text-sm font-semibold transition-colors shadow-sm"
                            >
                                Create Notebook
                            </Link>
                        </div>
                    </section>
                    <section>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-3">Visualize</h2>
                            <div className="mt-2">
                                <h3 className="text-lg font-bold text-gray-800">Visualise Engine</h3>
                                <p className="text-sm text-gray-500">Explore and visualize evolutionary algorithm behaviors.</p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 flex flex-col items-center justify-center shadow-sm border border-indigo-200 h-full">
                            <div className="text-4xl mb-3">📊</div>
                            <div className="font-bold text-md text-center text-gray-700">EvoViz Analytics</div>
                            <div className="text-xs text-gray-500 text-center mt-1 mb-4">Interactive dashboard for population analytics</div>
                            <a 
                                href="https://evolutionary-algorithms-on-click.github.io/EvoViz/" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full text-sm font-semibold transition-colors shadow-sm"
                            >
                                Launch EvoViz
                            </a>
                        </div>
                    </section>
                </div>
            </div>

            <footer className="flex justify-center space-x-4 p-12 w-full mt-auto">
                <Link href="/" className="bg-white hover:bg-gray-100 text-gray-600 rounded-full px-6 py-2 text-sm transition-colors border border-gray-200 shadow-sm">
                    ← Home
                </Link>
                <Link href="/bin" className="bg-white hover:bg-gray-100 text-gray-600 rounded-full px-6 py-2 text-sm transition-colors border border-gray-200 shadow-sm">
                    Previous Runs →
                </Link>
            </footer>
        </main>
    );
}
