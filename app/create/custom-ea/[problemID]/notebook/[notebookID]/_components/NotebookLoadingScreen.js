"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Download, Lock } from "lucide-react";

const loadingTexts = [
    "Initializing the DEAP kernel...",
    "Setting up the evolutionary environment...",
    "Did you know? Genetic algorithms are inspired by natural selection.",
    "The fitness function is crucial for guiding the evolution.",
    "Mutation introduces genetic diversity into the population.",
    "Crossover combines genetic material from two parents.",
    "Fetching your notebook from the digital ether...",
    "Almost there! Just compiling the bits and bytes.",
    "EvOC uses a Jupyter Kernel Gateway to run your Python code securely.",
    "You can modify and fix code cells using the power of AI.",
];

const FunFact = ({ text }) => (
    <p className="text-lg text-teal-700 font-semibold animate-fadeInOut">{text}</p>
);

export default function NotebookLoadingScreen() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % loadingTexts.length);
        }, 3000); // Change text every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <main className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <div className="flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 border-8 border-t-transparent border-teal-600 rounded-full animate-spin mb-6" />
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Preparing Your Notebook</h1>
                <div className="h-10">
                    <FunFact key={index} text={loadingTexts[index]} />
                </div>
                <div className="flex items-center justify-center mt-8 gap-8">
                    <div className="flex flex-col items-center gap-2">
                        <Lock className="w-10 h-10 text-teal-600" />
                        <span className="text-xs text-gray-600">Secure Code</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Download className="w-10 h-10 text-teal-600" />
                        <span className="text-xs text-gray-600">Download Results</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                         <Image src="/evoc.png" alt="EvOC Icon" width={50} height={50} />
                        <span className="text-xs text-gray-600">Powered by EvOC</span>
                    </div>
                </div>
            </div>
            <style jsx>{`
                @keyframes fadeInOut {
                    0% {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    20% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    80% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                }
                .animate-fadeInOut {
                    animation: fadeInOut 3s infinite;
                }
            `}</style>
        </main>
    );
}
