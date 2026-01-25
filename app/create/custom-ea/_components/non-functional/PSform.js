"use client";
import { useState } from "react";

// Configuration object for Evolutionary Algorithm parameters
const eaConfig = {
    binary: {
        crossoverOperators: ["Single-Point Crossover", "Two-Point Crossover", "Uniform Crossover"],
        mutationOperators: ["Bit-Flip Mutation"],
    },
    integer: { // Assuming integer has similar operators to real for now
        crossoverOperators: ["Simulated Binary Crossover (SBX)", "BLX-alpha", "Uniform Crossover"],
        mutationOperators: ["Gaussian Mutation", "Polynomial Mutation"],
    },
    real: {
        crossoverOperators: ["Simulated Binary Crossover (SBX)", "BLX-alpha", "Uniform Crossover"],
        mutationOperators: ["Gaussian Mutation", "Polynomial Mutation"],
    },
    permutation: {
        crossoverOperators: ["Partially Mapped Crossover (PMX)", "Order Crossover (OX)", "Cycle Crossover (CX)"],
        mutationOperators: ["Swap Mutation", "Inversion Mutation", "Scramble Mutation"],
    },
    tree: {
        crossoverOperators: ["Subtree Crossover"],
        mutationOperators: ["Subtree Mutation", "Point Mutation", "Hoist Mutation"],
    },
    graph: {
        crossoverOperators: ["Subgraph Exchange"],
        mutationOperators: ["Add/Remove Node", "Add/Remove Edge", "Change Node/Edge Attribute"],
    },
    custom: { // Allows for custom representation
        crossoverOperators: [],
        mutationOperators: [],
    }
};

const selectionMethods = ["Tournament", "Roulette Wheel", "Rank"];

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
        domainOfVariables: "[0, 1]",
        // -- Tree/GP Specific --
        functionSet: "'+', '-', '*', '/'",
        terminalSet: "'x', 'y', 'R'",
        initialTreeDepth: "2",
        maxTreeDepth: "5",
        // -- Graph Specific --
        allowedNodeTypes: "",
        allowedEdgeTypes: "",

        // Fitness Function
        fitnessDescription: "",
        formalEquation: "",
        constraintHandling: "",

        // Evolutionary Operators
        selectionMethod: "",
        selectionMethodCustomName: "",
        crossoverOperator: "",
        crossoverOperatorCustomName: "",
        crossoverProbability: "80",
        mutationOperator: "",
        mutationOperatorCustomName: "",
        mutationProbability: "10",

        // Algorithm Parameters
        populationSize: "100",
        numGenerations: "1000",
        elitism: "yes, 1",
        terminationCondition: "maxGenerations",
        terminationOther: "",

        // Execution Setup
        executionMode: "local",
        evaluationBudget: "10000",
        outputBestSolution: true,
        outputProgressLog: false,
        outputVisualization: false,

        // Customization
        customOperators: "",
        knownHeuristics: "",
        exampleSolutions: "",
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === 'checkbox' ? checked : value;
    
        let newFormData = { ...formData, [name]: finalValue };
    
        // When representation changes, reset ALL representation-specific fields
        if (name === "solutionRepresentation") {
            // Reset common fields
            newFormData.crossoverOperator = "";
            newFormData.mutationOperator = "";
            newFormData.crossoverOperatorCustomName = "";
            newFormData.mutationOperatorCustomName = "";
            
            // Reset vector/permutation-based fields
            newFormData.domainOfVariables = "";
            newFormData.solutionSize = "";
            
            // Reset tree-based fields
            newFormData.functionSet = "";
            newFormData.terminalSet = "";
            newFormData.initialTreeDepth = "2";
            newFormData.maxTreeDepth = "5";

            // Reset graph-based fields
            newFormData.allowedNodeTypes = "";
            newFormData.allowedEdgeTypes = "";

            // Set default for binary
            if (value === 'binary') {
                newFormData.domainOfVariables = "[0, 1]";
            }
        }
    
        // If user selects a non-custom option, clear the corresponding custom name field
        if (name === "selectionMethod" && value !== "custom") {
            newFormData.selectionMethodCustomName = "";
        }
        if (name === "crossoverOperator" && value !== "custom") {
            newFormData.crossoverOperatorCustomName = "";
        }
        if (name === "mutationOperator" && value !== "custom") {
            newFormData.mutationOperatorCustomName = "";
        }
    
        setFormData(newFormData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const getLabel = (key, defaultLabel) => {
        const labels = {
            binary: {
                solutionSize: "Chromosome Length",
                domainOfVariables: "Domain of Variables",
            },
            permutation: {
                solutionSize: "Number of Items",
                domainOfVariables: "Set of Items to Permute",
            },
            real: {
                solutionSize: "Number of Variables",
                domainOfVariables: "Domain of Variables (e.g., min/max for each)",
            },
            integer: {
                solutionSize: "Number of Variables",
                domainOfVariables: "Domain of Variables (e.g., min/max for each)",
            },
            custom: {
                solutionSize: "Solution Size / Length",
                domainOfVariables: "Domain of Variables / Allowed Values",
            }
        };
        return labels[formData.solutionRepresentation]?.[key] || defaultLabel;
    }

    const [advancedOpen, setAdvancedOpen] = useState(false);

    const renderRepresentationFields = () => {
        switch (formData.solutionRepresentation) {
            case 'tree':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Function Set (operators) *
                            </label>
                            <textarea
                                name="functionSet"
                                value={formData.functionSet}
                                onChange={handleChange}
                                rows={2}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., '+', '-', '*', 'sin', 'cos'"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Terminal Set (leaves) *
                            </label>
                            <textarea
                                name="terminalSet"
                                value={formData.terminalSet}
                                onChange={handleChange}
                                rows={2}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., 'x', 'y' (variables), '-1', '3.14' (constants)"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Initial Tree Depth *
                                </label>
                                <input
                                    type="text"
                                    name="initialTreeDepth"
                                    value={formData.initialTreeDepth}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., 2-4"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Maximum Tree Depth *
                                </label>
                                <input
                                    type="text"
                                    name="maxTreeDepth"
                                    value={formData.maxTreeDepth}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., 8 or 17"
                                />
                            </div>
                        </div>
                    </>
                );
            case 'graph':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Allowed Node Types
                            </label>
                            <textarea
                                name="allowedNodeTypes"
                                value={formData.allowedNodeTypes}
                                onChange={handleChange}
                                rows={2}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., 'input', 'hidden', 'output', 'resistor'"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Allowed Edge Types
                            </label>
                            <textarea
                                name="allowedEdgeTypes"
                                value={formData.allowedEdgeTypes}
                                onChange={handleChange}
                                rows={2}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., 'directed', 'weighted', 'recurrent'"
                            />
                        </div>
                    </>
                );
            case 'binary':
            case 'integer':
            case 'real':
            case 'permutation':
            case 'custom':
            default:
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {getLabel('solutionSize', 'Solution Size / Length *')}
                            </label>
                            <input
                                type="text"
                                name="solutionSize"
                                value={formData.solutionSize}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., 10, 100, variable"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {getLabel('domainOfVariables', 'Domain of Variables *')}
                            </label>
                            <input
                                type="text"
                                name="domainOfVariables"
                                value={formData.domainOfVariables}
                                onChange={handleChange}
                                disabled={formData.solutionRepresentation === 'binary'}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                                placeholder={
                                    formData.solutionRepresentation === 'permutation' 
                                    ? "e.g., A, B, C, D" 
                                    : "e.g., [0,1], [-5, 5], 1-100"
                                }
                            />
                        </div>
                    </>
                );
        }
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
                                onChange={handleChange}
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
                                        onChange={handleChange}
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
                                        onChange={handleChange}
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
                                onChange={handleChange}
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
                                onChange={handleChange}
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
                                onChange={handleChange}
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
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="binary">Binary</option>
                                <option value="integer">Integer</option>
                                <option value="real">Real-valued</option>
                                <option value="permutation">Permutation</option>
                                <option value="tree">Tree / Genetic Programming</option>
                                <option value="graph">Graph</option>
                                <option value="custom">Custom</option>
                            </select>
                        </div>
                        
                        {renderRepresentationFields()}
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
                                onChange={handleChange}
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
                                onChange={handleChange}
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
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., penalties, repair, discard"
                            />
                        </div>
                    </div>

                    {/* Advanced Options toggle */}
                    <div className="flex items-center justify-between pt-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Advanced Options
                        </h3>
                        <button
                            type="button"
                            onClick={() => setAdvancedOpen(!advancedOpen)}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            {advancedOpen ? "Hide" : "Show"} Advanced Options
                        </button>
                    </div>

                    {advancedOpen ? (
                        <>
                            {/* Evolutionary Operators */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                                    4. Evolutionary Operators
                                </h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Selection Method *
                                    </label>
                                    <select
                                        name="selectionMethod"
                                        value={formData.selectionMethod}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">-- Select a method --</option>
                                        {selectionMethods.map(method => <option key={method} value={method}>{method}</option>)}
                                        <option value="custom">Custom...</option>
                                    </select>
                                    {formData.selectionMethod === 'custom' && (
                                        <textarea
                                            name="selectionMethodCustomName"
                                            value={formData.selectionMethodCustomName}
                                            onChange={handleChange}
                                            rows={2}
                                            className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg"
                                            placeholder="Describe your custom selection logic in natural language..."
                                        />
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Crossover Operator *
                                        </label>
                                        <select
                                            name="crossoverOperator"
                                            value={formData.crossoverOperator}
                                            onChange={handleChange}
                                            disabled={!formData.solutionRepresentation}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                                        >
                                            <option value="">-- Select an operator --</option>
                                            {eaConfig[formData.solutionRepresentation]?.crossoverOperators.map(op => <option key={op} value={op}>{op}</option>)}
                                            <option value="custom">Custom...</option>
                                        </select>
                                        {formData.crossoverOperator === 'custom' && (
                                            <textarea
                                                name="crossoverOperatorCustomName"
                                                value={formData.crossoverOperatorCustomName}
                                                onChange={handleChange}
                                                rows={2}
                                                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg"
                                                placeholder="Describe your custom crossover logic in natural language..."
                                            />
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Crossover Probability (%) *
                                        </label>
                                        <input
                                            type="number"
                                            name="crossoverProbability"
                                            value={formData.crossoverProbability}
                                            onChange={handleChange}
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
                                        <select
                                            name="mutationOperator"
                                            value={formData.mutationOperator}
                                            onChange={handleChange}
                                            disabled={!formData.solutionRepresentation}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                                        >
                                            <option value="">-- Select an operator --</option>
                                            {eaConfig[formData.solutionRepresentation]?.mutationOperators.map(op => <option key={op} value={op}>{op}</option>)}
                                            <option value="custom">Custom...</option>
                                        </select>
                                        {formData.mutationOperator === 'custom' && (
                                            <textarea
                                                name="mutationOperatorCustomName"
                                                value={formData.mutationOperatorCustomName}
                                                onChange={handleChange}
                                                rows={2}
                                                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg"
                                                placeholder="Describe your custom mutation logic in natural language..."
                                            />
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mutation Probability (%) *
                                        </label>
                                        <input
                                            type="number"
                                            name="mutationProbability"
                                            value={formData.mutationProbability}
                                            onChange={handleChange}
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
                                            onChange={handleChange}
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
                                            onChange={handleChange}
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
                                        onChange={handleChange}
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
                                                onChange={handleChange}
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
                                                onChange={handleChange}
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
                                                onChange={handleChange}
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
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            <span>Other:</span>
                                            {formData.terminationCondition ===
                                                "other" && (
                                                <input
                                                    type="text"
                                                    name="terminationOther"
                                                    value={
                                                        formData.terminationOther
                                                    }
                                                    onChange={handleChange}
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
                                                    formData.executionMode ===
                                                    "local"
                                                }
                                                onChange={handleChange}
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
                                                    formData.executionMode ===
                                                    "remote"
                                                }
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            <span>Remote</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Evaluation Budget (max fitness
                                        evaluations)
                                    </label>
                                    <input
                                        type="number"
                                        name="evaluationBudget"
                                        value={formData.evaluationBudget}
                                        onChange={handleChange}
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
                                                checked={
                                                    formData.outputBestSolution
                                                }
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            <span>Best solution only</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="outputProgressLog"
                                                checked={
                                                    formData.outputProgressLog
                                                }
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            <span>
                                                Evolutionary progress log
                                            </span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="outputVisualization"
                                                checked={
                                                    formData.outputVisualization
                                                }
                                                onChange={handleChange}
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
                                    7. Customization / Domain Knowledge
                                    (Optional)
                                </h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Custom Operators (if any)
                                    </label>
                                    <textarea
                                        name="customOperators"
                                        value={formData.customOperators}
                                        onChange={handleChange}
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
                                        onChange={handleChange}
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
                                        onChange={handleChange}
                                        rows={2}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Provide example solutions"
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-sm text-gray-500">
                            Advanced options are hidden. Click "Show Advanced
                            Options" to reveal evolutionary operators, algorithm
                            parameters, execution setup, and customization
                            fields.
                        </div>
                    )}

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
