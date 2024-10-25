"use client";

import { useState } from "react";
import { algorithmData } from "../_data/algorithms"

export default function CreateInstance() {
    const [currentStep, setCurrentStep] = useState(1)
    const [algo, setAlgo] = useState(null)

    return (
        <main className="items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-mono)] p-8">
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold">
                    Evolve OnClick
                </h1>
                <p>Run and Visualize algorithms with just a click.</p>
            </div>

            <div className="flex flex-wrap mt-16 gap-4">
                {/* 
                    Section will have a div representing selected values.
                */}
                <div className="flex flex-col items-start border border-gray-400 rounded-2xl p-4 min-w-[15%]">
                    <h3 className="text-xl font-bold">Configuration</h3>
                    <div className="flex flex-col">
                        <div className="mt-4">
                            <h4 className="text-lg font-bold">Algorithm</h4>
                            <code className="bg-foreground p-1 rounded-lg text-background">{algo || "None"}</code>
                        </div>
                    </div>
                </div>

                {/* Section will have the dynamic form */}
                <div className="border border-gray-400 rounded-2xl p-4 min-w-[40%]">
                    <form className="flex flex-col">
                        <h3 className="text-xl font-bold">Create Instance</h3>

                        <hr className="my-4" />

                        {currentStep >= 1 && (
                            <div className="my-4">
                                <h4 className="text-lg font-bold mb-8">Step 1: Choose Algorithm</h4>
                                {/* grid: each element has a name and description */}
                                <div className="grid grid-cols-2 gap-4 align-top">
                                    {algorithmData.map((algorithm, index) => (
                                        <button onClick={(e) => {
                                            e.preventDefault()
                                            setAlgo(algorithm.name)
                                            setCurrentStep(currentStep < 2 ? 2 : currentStep)
                                        }} key={index} className={"border border-gray-300 p-4 rounded-lg max-w-xl text-left items-start min-w-2/3" + (algo && (algo === algorithm.name) ? " bg-foreground text-background" : "")}>
                                            <h5 className="text-lg font-bold">{algorithm.name}</h5>
                                            <p>{algorithm.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {currentStep >= 2 && (
                            <div className="mt-4">
                                <h4 className="text-lg font-bold mb-8">Step 2: Parameters to optimize (weights)</h4>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </main>
    )
}