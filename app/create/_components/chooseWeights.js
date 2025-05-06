"use client";
import { useState } from "react";

export default function ChooseWeights({
    title = "Step 2: Parameters to optimize (weights)",
    currentStep,
    nextStep,
    setCurrentStep,
    parameters,
    setParameters,
}) {
    const [tempParamWeight, setTempParamWeight] = useState(null);
    const [minMaxSelected, setMinMaxSelected] = useState(false);

    return (
        <div className="mt-8">
            <h4 className="text-lg font-bold mb-4">{title}</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left side: Add Parameter */}
                <div className="flex flex-col p-3 rounded-xl w-full">
                    <div className="flex gap-2 items-center flex-col sm:flex-row">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setTempParamWeight(1.0);
                                setMinMaxSelected(true);
                            }}
                            className={`p-2 w-full sm:w-1/2 text-center rounded-xl border transition ${
                                tempParamWeight === 1.0
                                    ? "border-blue-500 bg-blue-100 text-blue-900"
                                    : "border-gray-300 hover:bg-gray-100"
                            }`}
                        >
                            <p>Maximize</p>
                            <p className="text-sm font-extralight">(weight = +1.0)</p>
                        </button>

                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setTempParamWeight(-1.0);
                                setMinMaxSelected(true);
                            }}
                            className={`p-2 w-full sm:w-1/2 text-center rounded-xl border transition ${
                                tempParamWeight === -1.0
                                    ? "border-blue-500 bg-blue-100 text-blue-900"
                                    : "border-gray-300 hover:bg-gray-100"
                            }`}
                        >
                            <p>Minimize</p>
                            <p className="text-sm font-extralight">(weight = -1.0)</p>
                        </button>
                    </div>

                    {minMaxSelected && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                if (tempParamWeight === null) {
                                    alert("Please select whether to maximize/minimize.");
                                    return;
                                }
                                setParameters([...parameters, tempParamWeight]);
                                setTempParamWeight(null);
                                setCurrentStep(currentStep < nextStep ? nextStep : currentStep);
                            }}
                            className="mt-4 px-4 py-2 border border-blue-900 text-blue-900 rounded-2xl hover:bg-blue-100 active:opacity-50 transition"
                        >
                            <div className="flex items-center justify-center">
                                Add Objective
                                <span className="ml-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="24px"
                                        viewBox="0 -960 960 960"
                                        width="24px"
                                        fill="#1e3a8a"
                                    >
                                        <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                                    </svg>
                                </span>
                            </div>
                        </button>
                    )}
                </div>

                {/* Right side: Optimization Parameters */}
                <div className="flex flex-col">
                    <h5 className="text-lg font-bold mb-2">Optimization Parameters</h5>
                    <div className="overflow-x-auto">
                        <table className="w-full text-center">
                            <thead>
                                <tr>
                                    <th className="border-b-2 border-gray-300 p-2">Weight</th>
                                    <th className="border-b-2 border-gray-300 p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parameters.map((param, index) => (
                                    <tr
                                        key={index}
                                        className={index % 2 === 0 ? "bg-blue-50" : "bg-white"}
                                    >
                                        <td className="border-b border-gray-300 p-2">
                                            <p className="font-bold">{param + ".0"}</p>
                                            <p className="text-sm font-extralight">{`dim_${index + 1}`}</p>
                                        </td>
                                        <td className="border-b border-gray-300 p-2">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setParameters(parameters.filter((_, i) => i !== index));
                                                    setCurrentStep(
                                                        currentStep < nextStep ? nextStep : currentStep,
                                                    );
                                                }}
                                                className="text-red-500 underline"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
