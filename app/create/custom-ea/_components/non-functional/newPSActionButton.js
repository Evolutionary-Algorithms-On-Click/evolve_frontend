import React from "react";
import { Plus } from "lucide-react";

// Create New Action Component (Left side initial state)
const CreateNewAction = ({ onCreateNew }) => {
    return (
        <div className="h-full flex items-center justify-center p-12">
            <button
                onClick={onCreateNew}
                className="group flex flex-col items-center gap-8 px-24 py-32 rounded-2xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
            >
                <div className="w-24 h-24 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
                    <Plus className="w-12 h-12 text-blue-600" />
                </div>
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                        Create New
                    </h2>
                    <p className="text-gray-600">Problem Statement</p>
                </div>
            </button>
        </div>
    );
};

export default CreateNewAction;
