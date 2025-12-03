"use client";

import { useState } from "react";

export default function UploadCustomFunction({
    customFunction,
    setCustomFunction,
    nextStep,
    prevStep,
}) {
    const [code, setCode] = useState(customFunction?.code || "");
    const [functionName, setFunctionName] = useState(customFunction?.name || "");
    const [description, setDescription] = useState(customFunction?.description || "");

    const handleSave = () => {
        setCustomFunction({
            code,
            name: functionName || "custom_function",
            description: description || "User-defined function",
        });
        nextStep();
    };

    const exampleCode = `def custom_function(x):
    """
    Your custom objective function.
    
    Args:
        x: numpy array of input parameters
        
    Returns:
        float: objective value
    """
    # Example: Maximize profit
    price = x[0]
    quantity = x[1]
    revenue = price * quantity
    cost = 100 + 50*quantity + 0.1*quantity**2
    return revenue - cost`;

    return (
        <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Upload Custom Function
            </h2>

            <p className="text-gray-600 mb-6">
                Define your own optimization problem in Python. Your function should accept a numpy array and return a scalar value.
            </p>

            {/* Function Name */}
            <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-2">
                    Function Name
                </label>
                <input
                    type="text"
                    value={functionName}
                    onChange={(e) => setFunctionName(e.target.value)}
                    placeholder="my_objective_function"
                    className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
            </div>

            {/* Description */}
            <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-2">
                    Description (optional)
                </label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Maximize profit by optimizing price and quantity"
                    className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
            </div>

            {/* Code Editor */}
            <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-2">
                    Python Code
                </label>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={exampleCode}
                    rows={15}
                    className="w-full p-4 rounded-lg border border-gray-300 bg-gray-50 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
            </div>

            {/* Requirements */}
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">📋 Requirements:</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Function must accept a numpy array <code className="bg-yellow-100 px-1 rounded">x</code></li>
                    <li>• Must return a single float/int value</li>
                    <li>• Can use: numpy, scipy, math (imported automatically)</li>
                    <li>• Define bounds in the next step</li>
                </ul>
            </div>

            {/* Example */}
            <div className="mb-6">
                <button
                    onClick={() => setCode(exampleCode)}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                    Load Example Code
                </button>
            </div>

            <div className="flex justify-between mt-6">
                <button
                    onClick={prevStep}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                    ← Back
                </button>

                <button
                    onClick={handleSave}
                    disabled={!code.trim() || !functionName.trim()}
                    className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-40"
                >
                    Save & Continue →
                </button>
            </div>
        </div>
    );
}