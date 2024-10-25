"use client";

import { useState } from "react";
import { algorithmData } from "../_data/algorithms"
import { individualData } from "../_data/individual";
import { populationFunctionData } from "../_data/populationFunction";

export default function CreateInstance() {
    const [currentStep, setCurrentStep] = useState(1)


    const [algo, setAlgo] = useState(null)

    const [parameters, setParameters] = useState([])
    const [tempParamWeight, setTempParamWeight] = useState(null)

    const [indGen, setIndGen] = useState(null)
    
    const [indSize, setIndSize] = useState(null)

    const [popFunc, setPopFunc] = useState(null)

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
                <div className="flex flex-col items-start border border-gray-400 rounded-2xl p-4 min-w-16 h-fit md:sticky top-4">
                    <h3 className="text-xl font-bold">Config Summary</h3>
                    <div className="flex flex-col">
                        <div className="mt-4">
                            <h4 className="text-lg font-semibold">Algorithm</h4>
                            <code className="bg-foreground p-1 rounded-lg text-background">{algo || "None"}</code>
                        </div>

                        {currentStep >= 2 ? <hr className="my-4" /> : null}


                        {currentStep >= 2 && (
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold">Weights</h4>
                                {parameters.length > 0 ? (
                                    <table className="w-full text-center">
                                        <tbody>
                                            {parameters.map((param, index) => (
                                                <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                                                    <td className="border-b border-gray-300 p-2">
                                                        <p className="font-bold">{param + ".0"}</p>
                                                        <p className="font-extralight">dim_{index + 1}</p>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (<p>None</p>)}
                            </div>
                        )}

                        {indGen ? <hr className="mt-4" /> : null}

                        
                        {indGen && (
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold">Individual Generator</h4>
                                <code className="bg-foreground p-1 rounded-lg text-background">{indGen}</code>
                            </div>
                        )}

                        {indSize ? <hr className="mt-4" /> : null}

                        {indSize && (
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold">Individual Size</h4>
                                <code className="bg-foreground p-1 rounded-lg text-background">{indSize}</code>
                            </div>
                        )}

                        {popFunc ? <hr className="mt-4" /> : null}

                        {popFunc && (
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold">Population Function</h4>
                                <code className="bg-foreground p-1 rounded-lg text-background">{popFunc}</code>
                            </div>
                        )}

                    </div>
                </div>

                {/* Section will have the dynamic form */}
                <div className="border border-gray-400 rounded-2xl p-4 min-w-[40%] max-w-[70%]">
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
                                {/* Parameter {'name': 'paramName', 'weight': <1.0/-1.0> (maximize/minimize)} 
                                    UI split into two halves, add param to right. left is a list of added params.
                                */}

                                <div className="grid grid-cols-2 gap-8 justify-items-stretch align-top">
                                    <div className="flex flex-col border border-foreground border-solid p-3 rounded-3xl w-full h-fit">
                                        <h5 className="text-lg font-bold mb-3">Add Parameter</h5>

                                        <div className="flex gap-0 items-center my-2">
                                            <button onClick={(e) => {
                                                e.preventDefault()
                                                setTempParamWeight(1.0)
                                            }} className={"p-1 rounded-l-xl w-full border border-foreground" + (tempParamWeight === 1.0 ? " bg-foreground text-background" : "")}>
                                                <p>Maximize</p>
                                                <p className="font-extralight">(weight = +1.0)</p>
                                            </button>
                                            <button onClick={(e) => {
                                                e.preventDefault()
                                                setTempParamWeight(-1.0)
                                            }} className={"p-1 rounded-r-xl w-full border border-foreground" + (tempParamWeight === -1.0 ? " bg-foreground text-background" : "")}>
                                                <p>Maximize</p>
                                                <p className="font-extralight">(weight = -1.0)</p>
                                            </button>
                                        </div>

                                        <button onClick={(e) => {
                                            e.preventDefault()
                                            if (tempParamWeight === null) {
                                                alert("Please select whether to maximize/minimize.")
                                                return
                                            }
                                            setParameters([...parameters, tempParamWeight])
                                            setTempParamWeight(null)
                                        }} className="bg-foreground text-background p-1 rounded-2xl">Add</button>
                                    </div>
                                    <div className="flex flex-col">
                                        <h5 className="text-lg font-bold">Optimization Parameters</h5>

                                        <table className="w-full text-center">
                                            <thead>
                                                <tr>
                                                    <th className="border-b-2 border-gray-300 p-2">Weight</th>
                                                    <th className="border-b-2 border-gray-300 p-2">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {parameters.map((param, index) => (
                                                    <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                                                        <td className="border-b border-gray-300 p-2">
                                                            <p className="font-bold">{param + ".0"}</p>
                                                            <p className="font-extralight">{`dim_${index + 1}`}</p>
                                                        </td>
                                                        <td className="border-b border-gray-300 p-2">
                                                            <button onClick={(e) => {
                                                                e.preventDefault()
                                                                setParameters(parameters.filter((_, i) => i !== index))
                                                                setCurrentStep(currentStep > 2 ? 2 : currentStep)
                                                            }} className="bg-foreground text-background p-1 rounded-lg">Remove</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {parameters.length > 0 && (
                            <div className="mt-16">
                                <h4 className="text-lg font-bold mb-8">Step 3: Choose an individual generator function.</h4>
                                {/* grid: each element has a name and description */}
                                <div className="grid grid-cols-2 gap-4 align-top">
                                    {individualData.map((ind, index) => (
                                        <button onClick={(e) => {
                                            e.preventDefault()
                                            setIndGen(ind.name)
                                            setCurrentStep(currentStep < 3 ? 3 : currentStep)
                                        }} key={index} className={"border border-gray-300 p-4 rounded-lg max-w-xl text-left items-start min-w-2/3" + (indGen && (indGen === ind.name) ? " bg-foreground text-background" : "")}>
                                            <h5 className="text-lg font-bold">{ind.name}</h5>
                                            <p>{ind.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {currentStep >= 3 && (
                            <div className="mt-16">
                                <h4 className="text-lg font-bold mb-4">Step 4: Size of the Individual list?</h4>
                                <input type="number" className="border border-gray-300 p-2 rounded-lg" placeholder="Enter a number" onChange={(e) => {
                                    setIndSize(e.target.value)
                                }} />
                            </div>
                        )}

                        {indSize > 0 && (
                            <div className="mt-16">
                                <h4 className="text-lg font-bold mb-4">Step 5: Choose a population function.</h4>
                                {/* grid: each element has a name and description */}
                                <div className="grid grid-cols-2 gap-4 align-top">
                                    {populationFunctionData.map((pop, index) => (
                                        <button onClick={(e) => {
                                            e.preventDefault()
                                            setPopFunc(pop.name)
                                            setCurrentStep(currentStep < 4 ? 4 : currentStep)
                                        }} key={index} className={"border border-gray-300 p-4 rounded-lg max-w-xl text-left items-start min-w-2/3" + (popFunc && (popFunc === pop.name) ? " bg-foreground text-background" : "")}>
                                            <h5 className="text-lg font-bold">{pop.name}</h5>
                                            <p>{pop.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </main>
    )
}