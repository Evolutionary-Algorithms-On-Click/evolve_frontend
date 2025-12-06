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
    const [validationError, setValidationError] = useState("");

    // 📊 Auto-detect number of dimensions from x[n]
    function detectDimensionsFromCode(codeText) {
        const regex = /x\[(\d+)\]/g;
        const indices = new Set();
        let match;

        while ((match = regex.exec(codeText)) !== null) {
            const idx = parseInt(match[1], 10);
            if (!isNaN(idx)) {
                indices.add(idx);
            }
        }

        if (indices.size === 0) {
            // let next step ask for dimension explicitly
            return null;
        }

        // 🚨 Check for contiguous indices starting from 0
        const sortedIndices = Array.from(indices).sort((a, b) => a - b);
        const minIndex = sortedIndices[0];
        const maxIndex = sortedIndices[sortedIndices.length - 1];
        const expectedDimensions = maxIndex + 1;

        // Must start from 0
        if (minIndex !== 0) {
            return {
                error: true,
                message: `Indices must start from x[0]. You're using x[${sortedIndices.join('], x[')}] but missing x[0]. Please use contiguous indices starting from x[0].`,
            };
        }

        // Check for gaps
        for (let i = 0; i <= maxIndex; i++) {
            if (!indices.has(i)) {
                return {
                    error: true,
                    message: `Non-contiguous indices detected. You're using x[${sortedIndices.join('], x[')}] but missing x[${i}]. Please use contiguous indices starting from x[0].`,
                };
            }
        }

        return expectedDimensions; // 🚀 max_index + 1
    }

    const handleSave = () => {
        const result = detectDimensionsFromCode(code);
        
        // 🚨 CRITICAL: Check for validation errors BEFORE saving
        if (result && typeof result === 'object' && result.error) {
            setValidationError(result.message);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return; // ← STOP HERE, don't continue!
        }

        const dim = result;
        
        if (dim !== null) {
            localStorage.setItem("bo_custom_func_dim", String(dim));
        } 
        else {
            localStorage.removeItem("bo_custom_func_dim");
        }

        setCustomFunction({
            code,
            name: functionName || "custom_function",
            description: description || "User-defined function",
        });
        
        setValidationError(""); // Clear any previous errors
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

            {/* Validation Error - Place at TOP for visibility */}
            {validationError && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-400 rounded-lg shadow-lg">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">⚠️</span>
                        <div>
                            <h3 className="font-bold text-red-800 mb-2">Validation Error</h3>
                            <p className="text-sm text-red-700 leading-relaxed">{validationError}</p>
                        </div>
                    </div>
                </div>
            )}

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
                    <li>• <strong>Use contiguous indices starting from x[0]</strong> (e.g., x[0], x[1], x[2]...)</li>
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