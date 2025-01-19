"use client";
import { useState } from "react";

export default function ChooseWeights({
    currentStep,
    nextStep,
    setCurrentStep,
    parameters,
    setParameters,
}) {
    const [tempParamWeight, setTempParamWeight] = useState(null);

    return (
        <div className="mt-8">
            <h4 className="text-lg font-bold mb-4">
                Step 2: Parameters to optimize (weights)
            </h4>

            {/* 
            
            Parameter 
                {
                    'name': 'paramName', 
                    'weight': <1.0/-1.0> (maximize/minimize)
                } 
            
            * UI split into two halves, add param to right. left is a list of added params.
            */}

            <div className="grid grid-cols-2 gap-8 justify-items-stretch align-top">
                <div className="flex flex-col border border-foreground border-solid p-3 rounded-3xl w-full h-fit">
                    <h5 className="text-lg font-bold mb-3">Add Parameter</h5>

                    <div className="flex gap-0 items-center my-2">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setTempParamWeight(1.0);
                            }}
                            className={
                                "p-1 rounded-l-xl w-full border border-foreground" +
                                (tempParamWeight === 1.0
                                    ? " bg-foreground text-background"
                                    : "")
                            }
                        >
                            <p>Maximize</p>
                            <p className="font-extralight">(weight = +1.0)</p>
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setTempParamWeight(-1.0);
                            }}
                            className={
                                "p-1 rounded-r-xl w-full border border-foreground" +
                                (tempParamWeight === -1.0
                                    ? " bg-foreground text-background"
                                    : "")
                            }
                        >
                            <p>Minimize</p>
                            <p className="font-extralight">(weight = -1.0)</p>
                        </button>
                    </div>

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
                                currentStep < nextStep ? nextStep : currentStep,
                            );
                        }}
                        className="bg-foreground text-background p-1 rounded-2xl"
                    >
                        Add
                    </button>
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
                                            ? "bg-gray-100"
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
                                            className="bg-foreground text-background p-1 rounded-lg"
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
