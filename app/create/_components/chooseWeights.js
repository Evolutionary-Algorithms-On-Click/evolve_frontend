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

            {/* 
            
            Parameter 
                {
                    'name': 'paramName', 
                    'weight': <1.0/-1.0> (maximize/minimize)
                } 
            
            * UI split into two halves, add param to right. left is a list of added params.
            */}

            <div className="grid grid-cols-2 gap-8 justify-items-stretch align-top">
                <div className="flex flex-col p-3 rounded-xl w-full h-fit">
                    {/* <h5 className="text-lg font-bold mb-3">Add Parameter</h5> */}

                    <div className="flex gap-0 items-center my-2">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setTempParamWeight(1.0);
                                setMinMaxSelected(true);
                            }}
                            className={
                                "p-1 rounded-l-xl w-full border bg-opacity-30" +
                                (tempParamWeight === 1.0
                                    ? " border-blue-500 bg-blue-100 text-blue-900"
                                    : "border-gray-300 hover:bg-gray-100 hover:text-foreground")
                            }
                        >
                            <p>Maximize</p>
                            <p className="font-extralight">(weight = +1.0)</p>
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setTempParamWeight(-1.0);
                                setMinMaxSelected(true);
                            }}
                            className={
                                "p-1 rounded-r-xl w-full border bg-opacity-30" +
                                (tempParamWeight === -1.0
                                    ? " border-blue-500 bg-blue-100 text-blue-900"
                                    : "border-gray-300 hover:bg-gray-100 hover:text-foreground")
                            }
                        >
                            <p>Minimize</p>
                            <p className="font-extralight">(weight = -1.0)</p>
                        </button>
                    </div>

                    {minMaxSelected && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                if (tempParamWeight === null) {
                                    alert(
                                        "Please select whether to maximize/minimize.",
                                    );
                                    return;
                                }
                                setParameters([...parameters, tempParamWeight]);
                                setTempParamWeight(null);
                                setCurrentStep(
                                    currentStep < nextStep
                                        ? nextStep
                                        : currentStep,
                                );
                            }}
                            className="text-background mt-3 text-blue-900 border border-blue-900 p-2 rounded-2xl hover:bg-blue-100 active:opacity-50"
                        >
                            <div className="flex flex-row justify-center items-center">
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
                <div className="flex flex-col">
                    <h5 className="text-lg font-bold">
                        Optimization Parameters
                    </h5>

                    <table className="w-full text-center">
                        <thead>
                            <tr>
                                <th className="border-b-2 border-gray-300 p-2">
                                    Weight
                                </th>
                                <th className="border-b-2 border-gray-300 p-2">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {parameters.map((param, index) => (
                                <tr
                                    key={index}
                                    className={
                                        index % 2 === 0
                                            ? "bg-blue-50"
                                            : "bg-white"
                                    }
                                >
                                    <td className="border-b border-gray-300 p-2">
                                        <p className="font-bold">
                                            {param + ".0"}
                                        </p>
                                        <p className="font-extralight">{`dim_${index + 1}`}</p>
                                    </td>
                                    <td className="border-b border-gray-300 p-2">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setParameters(
                                                    parameters.filter(
                                                        (_, i) => i !== index,
                                                    ),
                                                );
                                                setCurrentStep(
                                                    currentStep < nextStep
                                                        ? nextStep
                                                        : currentStep,
                                                );
                                            }}
                                            className="text-red-500 underline p-1 rounded-lg"
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
    );
}
