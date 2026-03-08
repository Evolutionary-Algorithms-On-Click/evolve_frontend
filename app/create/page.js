"use client";

import { LogOut, ArrowLeft } from "lucide-react";
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

    const eaTypes = [
        { href: "/create/non-gp", emoji: "🚀", title: "Evolutionary Algorithm", desc: "DE & Non-GP Approach", color: "from-green-50 to-green-100" },
        { href: "/create/gp", emoji: "🧬", title: "Genetic Programming", desc: "Evolve Programs", color: "from-blue-50 to-blue-100" },
        { href: "/create/pso", emoji: "🕊️", title: "Particle Swarm", desc: "Swarm Intelligence", color: "from-purple-50 to-purple-100" },
        { href: "/create/bo", emoji: "🔍", title: "Bayesian Optimization", desc: "Guided Exploration", color: "from-rose-50 to-rose-100"},
        { href: "/create/ml", emoji: "🤖", title: "ML Model Tuning", desc: "Fine-tune ML models with EA", color: "from-yellow-50 to-yellow-100" },
    ];

    return (
        <main className="flex flex-col items-center min-h-screen p-4 bg-gradient-to-br from-gray-50 to-gray-100 font-[family-name:var(--font-geist-mono)]">
            <header className="flex flex-col w-full justify-center items-center p-8">
                <div className="flex items-center space-x-2 h-32">
                    <Image
                        src="/LOGO.png"
                        alt="EVOLVE OnClick logo"
                        height={320}
                        width={680}
                        className="rounded-md"
                    />
                </div>
                
                <div className="flex items-center gap-4">
                    <Link 
                        href="/"
                        className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-full text-xs font-bold border border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
                    >
                        <ArrowLeft size={14} />
                        Back to Workspace
                    </Link>

                    {userData.fullName && (
                        <div className="flex flex-row gap-2 bg-gray-900 rounded-full px-4 text-[#6eff39] items-center border border-gray-700 shadow-sm">
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
                </div>
            </header>

            <div className="container mx-auto px-4 py-12 max-w-6xl">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tighter mb-2">EvoC Engine</h2>
                    <p className="text-gray-500">Select an evolutionary paradigm to begin your optimization journey.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {eaTypes.map((item, idx) => (
                        <Link key={idx} href={item.href} className="block group">
                            <div className={`bg-gradient-to-br h-full rounded-2xl p-8 flex flex-col items-center justify-center shadow-sm hover:shadow-xl transition-all border border-gray-100 group-hover:-translate-y-2 ${item.color}`}>
                                <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform">{item.emoji}</div>
                                <div className="font-black text-lg text-center text-gray-800 leading-tight mb-2 uppercase tracking-tighter">{item.title}</div>
                                <div className="text-[10px] font-bold text-gray-500 text-center uppercase tracking-widest">{item.desc}</div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-20 p-8 bg-white/50 border border-dashed border-gray-300 rounded-3xl text-center">
                    <p className="text-gray-400 text-sm italic">
                        Looking for the custom experimentation area? Head back to the <Link href="/" className="text-orange-500 font-bold hover:underline">Workspace</Link> and select EvoLab.
                    </p>
                </div>
            </div>

            <footer className="mt-auto py-8">
                <Link href="/bin" className="bg-white hover:bg-gray-100 text-gray-600 rounded-full px-6 py-2 text-sm font-bold transition-all border border-gray-200 shadow-sm">
                    View Previous Runs →
                </Link>
            </footer>
        </main>
    );
}
