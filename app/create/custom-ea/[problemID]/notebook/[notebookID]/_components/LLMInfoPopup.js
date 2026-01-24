"use client";

import React from "react";
import { X } from "lucide-react";

const cellStructure = [
    { name: "Imports", description: "Import all required libraries (DEAP, NumPy, Matplotlib, etc.)" },
    { name: "Configuration", description: "Problem configuration (dimensions, bounds, random seed, population size, generations, etc.)" },
    { name: "Creator", description: "Define fitness and individual classes using `deap.creator.create`" },
    { name: "Evaluation", description: "Define the objective/fitness evaluation function for individuals" },
    { name: "Crossover", description: "Define the crossover (mating) operator (`deap.tools.cx*`)" },
    { name: "Mutation", description: "Define the mutation operator (`deap.tools.mut*`)" },
    { name: "Selection", description: "Define the selection operator (`deap.tools.sel*`)" },
    { name: "Initialization", description: "Define the population initialization strategy (e.g., `deap.tools.initRepeat`)" },
    { name: "Toolbox", description: "Register the operators, attributes, and population in a `deap.base.Toolbox`" },
    { name: "Main Algorithm", description: "Implement the main evolutionary algorithm loop (`deap.algorithms.ea*`)" },
    { name: "Statistics & Logging", description: "Setup statistics collection and logging during the evolution process" },
    { name: "Visualization/Results", description: "Code for visualizing results, plotting, or outputting final solutions" },
];

export default function LLMInfoPopup({ isOpen, onClose, requirements }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-[100]">
            <div className="bg-white p-6 rounded-lg shadow-2xl max-w-4xl w-full relative border border-teal-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    title="Close"
                >
                    <X size={24} className="text-gray-600" />
                </button>
                <h2 className="text-lg font-extrabold text-gray-800 mb-2 pb-2 border-b-2 border-teal-500">LLM Notebook Guidance</h2>
                <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                    For optimal performance and highly fluid updates, the LLM features are specifically designed to work best with notebooks structured into <strong>12 distinct cells</strong>. This adherence to a consistent structure significantly enhances the AI's ability to understand your evolutionary algorithm setup and make precise, context-aware modifications.
                </p>

                {requirements && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-3 mb-4 text-sm" role="alert">
                        <p className="font-bold">Required Libraries/Packages:</p>
                        <p className="whitespace-pre-wrap">{requirements}</p>
                    </div>
                )}
                
                <p className="text-base font-bold text-teal-700 mb-3">
                    Expected 12-Cell Structure for DEAP Notebooks:
                </p>
                <ul className="space-y-1 overflow-y-auto pr-2 custom-scrollbar">
                    {cellStructure.map((cell, index) => (
                        <li key={index} className="flex items-start">
                            <span className="flex-shrink-0 text-teal-500 mr-2 mt-1">&#8226;</span> {/* Custom bullet */}
                            <p className="text-gray-700 text-xs">
                                <span className="font-semibold text-teal-600">{cell.name}:</span> {cell.description}
                            </p>
                        </li>
                    ))}
                </ul>
                <p className="text-gray-600 text-xs italic border-t pt-3">
                    Note: Notebooks deviating significantly from this recommended structure may experience reduced LLM effectiveness and less accurate modifications.
                </p>
            </div>
        </div>
    );
}
