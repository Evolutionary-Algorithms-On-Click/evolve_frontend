"use client";

import { LogOut, Rocket, FlaskConical, BarChart3, GraduationCap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
    const [userData, setUserData] = useState({});

    useEffect(() => {
        const id = localStorage.getItem("id");
        if (id) {
            setUserData({
                email: localStorage.getItem("email"),
                userName: localStorage.getItem("userName"),
                fullName: localStorage.getItem("fullName"),
                id: id,
            });
        }
    }, []);

    const components = [
        {
            title: "EvoC",
            desc: "Evolutionary Computation engine with GP, EA, PSO, and more.",
            icon: <Rocket className="w-10 h-10 text-orange-500" />,
            href: "/create",
            color: "from-orange-50 to-orange-100",
            borderColor: "border-orange-200",
            buttonColor: "bg-orange-500 hover:bg-orange-600",
            status: "Active"
        },
        {
            title: "EvoLab",
            desc: "Advanced experimentation area for custom notebook development.",
            icon: <FlaskConical className="w-10 h-10 text-teal-500" />,
            href: "/create/custom-ea",
            color: "from-teal-50 to-teal-100",
            borderColor: "border-teal-200",
            buttonColor: "bg-teal-500 hover:bg-teal-600",
            status: "Active"
        },
        {
            title: "EvoViz",
            desc: "Interactive visualization engine for population analytics.",
            icon: <BarChart3 className="w-10 h-10 text-indigo-500" />,
            href: "https://evolutionary-algorithms-on-click.github.io/EvoViz/",
            external: true,
            color: "from-indigo-50 to-indigo-100",
            borderColor: "border-indigo-200",
            buttonColor: "bg-indigo-500 hover:bg-indigo-600",
            status: "Active"
        },
        {
            title: "EvoAcademy",
            desc: "Comprehensive resources and learning materials for evolutionary computation.",
            icon: <GraduationCap className="w-10 h-10 text-gray-400" />,
            href: "#",
            color: "from-gray-50 to-gray-100",
            borderColor: "border-gray-200",
            buttonColor: "bg-gray-400 cursor-not-allowed",
            status: "Coming Soon"
        }
    ];

    return (
        <main className="flex flex-col items-center min-h-screen p-4 bg-gradient-to-br from-gray-50 to-gray-100 font-[family-name:var(--font-geist-mono)]">
            <header className="flex flex-col w-full justify-center items-center p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg rotate-3 group-hover:rotate-0 transition-transform">E</div>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic">EvoLearn</h1>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] ml-12">The Evolutionary Ecosystem</p>
                </div>
                
                {userData.fullName ? (
                    <div className="flex flex-row gap-2 bg-gray-900 rounded-full px-4 text-[#6eff39] items-center border border-gray-700 shadow-sm mt-4">
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
                ) : (
                    <div className="mt-4 flex gap-4">
                        <Link
                            href="/auth"
                            className="px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-bold hover:bg-gray-800 transition-colors shadow-sm"
                        >
                            Get Started
                        </Link>
                        <Link
                            href="https://evolutionary-algorithms-on-click.github.io/user_docs/"
                            target="_blank"
                            className="px-6 py-2 bg-white text-gray-900 border border-gray-200 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Documentation
                        </Link>
                    </div>
                )}
            </header>

            <div className="container mx-auto px-4 max-w-6xl pb-20">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tighter">EvoLearn Workspace</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">Welcome to the EvoLearn ecosystem. Explore our suite of tools designed to help you build, optimize, and visualize evolutionary algorithms.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {components.map((item, idx) => (
                        <div key={idx} className={`relative group bg-gradient-to-br ${item.color} rounded-2xl p-8 border ${item.borderColor} shadow-sm transition-all hover:shadow-xl hover:-translate-y-2 flex flex-col h-full`}>
                            <div className="mb-6 bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner">
                                {item.icon}
                            </div>
                            
                            <div className="flex-grow">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-2xl font-black text-gray-800 tracking-tight">{item.title}</h2>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${item.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-200 text-gray-600 border-gray-300'}`}>
                                        {item.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed mb-8">
                                    {item.desc}
                                </p>
                            </div>

                            {item.external ? (
                                <a 
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-full py-3 rounded-xl text-white text-center font-bold text-sm transition-all shadow-md ${item.buttonColor}`}
                                >
                                    Open {item.title}
                                </a>
                            ) : (
                                <Link 
                                    href={item.href}
                                    className={`w-full py-3 rounded-xl text-white text-center font-bold text-sm transition-all shadow-md ${item.buttonColor}`}
                                >
                                    Launch {item.title}
                                </Link>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-20 pt-12 border-t border-gray-200">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex-1">
                            <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">Research First Approach</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Our platform is built on cutting-edge research in evolutionary computation. 
                                We aim to make these powerful algorithms accessible and interactive for everyone.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                            <a 
                                href="https://dl.acm.org/doi/10.1145/3712255.3726652"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-sm font-bold transition-all"
                            >
                                Read the Research Paper
                            </a>
                            <a 
                                href="https://github.com/orgs/Evolutionary-Algorithms-On-Click/repositories"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                            >
                                <Image src="/org.jpg" alt="Source" width={20} height={20} className="rounded-full" />
                                Source Code
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="mt-auto py-8 text-gray-400 text-xs font-bold uppercase tracking-widest">
                &copy; 2026 Evolve OnClick &bull; All Rights Reserved
            </footer>
        </main>
    );
}