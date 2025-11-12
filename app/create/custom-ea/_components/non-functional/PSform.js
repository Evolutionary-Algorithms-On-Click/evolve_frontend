"use client";
import { useState } from "react";

// Problem Statement Form Component (Left side form state)
const ProblemStatementForm = ({ onCancel, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        objectives: "",
        constraints: "",
        stakeholders: "",
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
        <div className="h-full overflow-y-auto bg-white">
            <div className="p-8">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">
                        New Problem Statement
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Fill in the details below
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={(e) => handleChange(e.target)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter problem statement title"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={(e) => handleChange(e.target)}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Describe the problem in detail"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Objectives
                        </label>
                        <textarea
                            name="objectives"
                            value={formData.objectives}
                            onChange={(e) => handleChange(e.target)}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="What are the goals?"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Constraints
                        </label>
                        <textarea
                            name="constraints"
                            value={formData.constraints}
                            onChange={(e) => handleChange(e.target)}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Any limitations or constraints?"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stakeholders
                        </label>
                        <input
                            type="text"
                            name="stakeholders"
                            value={formData.stakeholders}
                            onChange={(e) => handleChange(e.target)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Who are the key stakeholders?"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Create Statement
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProblemStatementForm;
