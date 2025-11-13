"use client";
import { useState } from "react";

// Problem Statement Form Component (Left side form state)
const ProblemStatementForm = ({ onCancel, onSubmit }) => {
    const [formData, setFormData] = useState({
        // Problem Definition
        problemName: "",
        objectiveType: "minimization",
        objectiveFunction: "",
        goalDescription: "",
        constraints: "",

        // Representation / Encoding
        solutionRepresentation: "binary",
        solutionSize: "",
        domainOfVariables: "",

        // Fitness Function
        fitnessDescription: "",
        formalEquation: "",
        constraintHandling: "",

        // Evolutionary Operators
        selectionMethod: "",
        crossoverOperator: "",
        crossoverProbability: "",
        mutationOperator: "",
        mutationProbability: "",

        // Algorithm Parameters
        populationSize: "",
        numGenerations: "",
        elitism: "",
        terminationCondition: "maxGenerations",
        terminationOther: "",

        // Execution Setup
        executionMode: "local",
        evaluationBudget: "",
        outputBestSolution: true,
        outputProgressLog: false,
        outputVisualization: false,

        // Customization
        customOperators: "",
        knownHeuristics: "",
        exampleSolutions: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.name]: e.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="h-full bg-white">
            <div className="p-8 h-full overflow-y-auto w-full">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">
                        New Evolutionary Algorithm Problem
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Configure your evolutionary algorithm parameters
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Problem Definition */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                            1. Problem Definition
                        </h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Problem Name / Title *
                            </label>
                            <input
                                type="text"
                                name="problemName"
                                value={formData.problemName}
                                onChange={(e) => handleChange(e.target)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter problem name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Objective Type *
                            </label>
                            <div className="flex gap-6">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="objectiveType"
                                        value="minimization"
                                        checked={
                                            formData.objectiveType ===
                                            "minimization"
                                        }
                                        onChange={(e) => handleChange(e.target)}
                                        className="mr-2"
                                    />
                                    <span>Minimization</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="objectiveType"
                                        value="maximization"
                                        checked={
                                            formData.objectiveType ===
                                            "maximization"
                                        }
                                        onChange={(e) => handleChange(e.target)}
                                        className="mr-2"
                                    />
                                    <span>Maximization</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Objective Function (if known)
                            </label>
                            <input
                                type="text"
                                name="objectiveFunction"
                                value={formData.objectiveFunction}
                                onChange={(e) => handleChange(e.target)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., f(x) = x^2 + 3x + 5"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Natural Language Description of Goal *
                            </label>
                            <textarea
                                name="goalDescription"
                                value={formData.goalDescription}
                                onChange={(e) => handleChange(e.target)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Describe what you want to achieve"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Constraints (if any)
                            </label>
                            <textarea
                                name="constraints"
                                value={formData.constraints}
                                onChange={(e) => handleChange(e.target)}
                                rows={2}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Any limitations or restrictions"
                            />
                        </div>
                    </div>

                    {/* Representation / Encoding */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                            2. Representation / Encoding
                        </h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Solution Representation *
                            </label>
                            <select
                                name="solutionRepresentation"
                                value={formData.solutionRepresentation}
                                onChange={(e) => handleChange(e.target)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="binary">Binary</option>
                                <option value="integer">Integer</option>
                                <option value="real">Real-valued</option>
                                <option value="permutation">Permutation</option>
                                <option value="custom">Custom</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Solution Size / Length *
                            </label>
                            <input
                                type="text"
                                name="solutionSize"
                                value={formData.solutionSize}
                                onChange={(e) => handleChange(e.target)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., 10, 100, variable"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Domain of Variables / Allowed Values *
                            </label>
                            <input
                                type="text"
                                name="domainOfVariables"
                                value={formData.domainOfVariables}
                                onChange={(e) => handleChange(e.target)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., [0,1], [0,100], any integer"
                            />
                        </div>
                    </div>

                    {/* Fitness Function */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                            3. Fitness Function
                        </h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description of Fitness Criteria *
                            </label>
                            <textarea
                                name="fitnessDescription"
                                value={formData.fitnessDescription}
                                onChange={(e) => handleChange(e.target)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="How will solutions be evaluated?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Formal Equation (optional)
                            </label>
                            <input
                                type="text"
                                name="formalEquation"
                                value={formData.formalEquation}
                                onChange={(e) => handleChange(e.target)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Mathematical formula"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Constraint Handling Method
                            </label>
                            <input
                                type="text"
                                name="constraintHandling"
                                value={formData.constraintHandling}
                                onChange={(e) => handleChange(e.target)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., penalties, repair, discard"
                            />
                        </div>
                    </div>

                    {/* Evolutionary Operators */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                            4. Evolutionary Operators
                        </h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Selection Method *
                            </label>
                            <input
                                type="text"
                                name="selectionMethod"
                                value={formData.selectionMethod}
                                onChange={(e) => handleChange(e.target)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., tournament, roulette wheel, rank"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Crossover Operator *
                                </label>
                                <input
                                    type="text"
                                    name="crossoverOperator"
                                    value={formData.crossoverOperator}
                                    onChange={(e) => handleChange(e.target)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., single-point, uniform"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Crossover Probability (%) *
                                </label>
                                <input
                                    type="number"
                                    name="crossoverProbability"
                                    value={formData.crossoverProbability}
                                    onChange={(e) => handleChange(e.target)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0-100"
                                    min="0"
                                    max="100"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mutation Operator *
                                </label>
                                <input
                                    type="text"
                                    name="mutationOperator"
                                    value={formData.mutationOperator}
                                    onChange={(e) => handleChange(e.target)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., bit-flip, gaussian"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mutation Probability (%) *
                                </label>
                                <input
                                    type="number"
                                    name="mutationProbability"
                                    value={formData.mutationProbability}
                                    onChange={(e) => handleChange(e.target)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0-100"
                                    min="0"
                                    max="100"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Algorithm Parameters */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                            5. Algorithm Parameters
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Population Size *
                                </label>
                                <input
                                    type="number"
                                    name="populationSize"
                                    value={formData.populationSize}
                                    onChange={(e) => handleChange(e.target)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., 100"
                                    min="1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Number of Generations *
                                </label>
                                <input
                                    type="number"
                                    name="numGenerations"
                                    value={formData.numGenerations}
                                    onChange={(e) => handleChange(e.target)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., 1000"
                                    min="1"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Elitism (yes/no, percentage)
                            </label>
                            <input
                                type="text"
                                name="elitism"
                                value={formData.elitism}
                                onChange={(e) => handleChange(e.target)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., yes - 10%, no"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Termination Condition *
                            </label>
                            <div className="space-y-2">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="terminationCondition"
                                        value="maxGenerations"
                                        checked={
                                            formData.terminationCondition ===
                                            "maxGenerations"
                                        }
                                        onChange={(e) => handleChange(e.target)}
                                        className="mr-2"
                                    />
                                    <span>Max generations</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="terminationCondition"
                                        value="fitnessThreshold"
                                        checked={
                                            formData.terminationCondition ===
                                            "fitnessThreshold"
                                        }
                                        onChange={(e) => handleChange(e.target)}
                                        className="mr-2"
                                    />
                                    <span>Fitness threshold</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="terminationCondition"
                                        value="timeBudget"
                                        checked={
                                            formData.terminationCondition ===
                                            "timeBudget"
                                        }
                                        onChange={(e) => handleChange(e.target)}
                                        className="mr-2"
                                    />
                                    <span>Time budget</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="terminationCondition"
                                        value="other"
                                        checked={
                                            formData.terminationCondition ===
                                            "other"
                                        }
                                        onChange={(e) => handleChange(e.target)}
                                        className="mr-2"
                                    />
                                    <span>Other:</span>
                                    {formData.terminationCondition ===
                                        "other" && (
                                        <input
                                            type="text"
                                            name="terminationOther"
                                            value={formData.terminationOther}
                                            onChange={(e) =>
                                                handleChange(e.target)
                                            }
                                            className="ml-2 flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Specify"
                                        />
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Execution Setup */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                            6. Execution Setup
                        </h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Execution Mode *
                            </label>
                            <div className="flex gap-6">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="executionMode"
                                        value="local"
                                        checked={
                                            formData.executionMode === "local"
                                        }
                                        onChange={(e) => handleChange(e.target)}
                                        className="mr-2"
                                    />
                                    <span>Local</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="executionMode"
                                        value="remote"
                                        checked={
                                            formData.executionMode === "remote"
                                        }
                                        onChange={(e) => handleChange(e.target)}
                                        className="mr-2"
                                    />
                                    <span>Remote</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Evaluation Budget (max fitness evaluations)
                            </label>
                            <input
                                type="number"
                                name="evaluationBudget"
                                value={formData.evaluationBudget}
                                onChange={(e) => handleChange(e.target)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., 10000"
                                min="1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Required Outputs
                            </label>
                            <div className="space-y-2">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="outputBestSolution"
                                        checked={formData.outputBestSolution}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                outputBestSolution:
                                                    e.target.checked,
                                            })
                                        }
                                        className="mr-2"
                                    />
                                    <span>Best solution only</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="outputProgressLog"
                                        checked={formData.outputProgressLog}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                outputProgressLog:
                                                    e.target.checked,
                                            })
                                        }
                                        className="mr-2"
                                    />
                                    <span>Evolutionary progress log</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="outputVisualization"
                                        checked={formData.outputVisualization}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                outputVisualization:
                                                    e.target.checked,
                                            })
                                        }
                                        className="mr-2"
                                    />
                                    <span>Visualization / Graphs</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Customization / Domain Knowledge */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                            7. Customization / Domain Knowledge (Optional)
                        </h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Custom Operators (if any)
                            </label>
                            <textarea
                                name="customOperators"
                                value={formData.customOperators}
                                onChange={(e) => handleChange(e.target)}
                                rows={2}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Describe any custom operators"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Known Heuristics / Rules
                            </label>
                            <textarea
                                name="knownHeuristics"
                                value={formData.knownHeuristics}
                                onChange={(e) => handleChange(e.target)}
                                rows={2}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Any domain-specific knowledge"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Example Valid Solutions (if available)
                            </label>
                            <textarea
                                name="exampleSolutions"
                                value={formData.exampleSolutions}
                                onChange={(e) => handleChange(e.target)}
                                rows={2}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Provide example solutions"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={handleSubmit}
                            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Create Problem Statement
                        </button>
                        <button
                            onClick={onCancel}
                            className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemStatementForm;
