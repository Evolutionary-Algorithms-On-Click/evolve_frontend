"use client";

import React from "react";
import { Plus } from "lucide-react";

const CreateCard = ({ onClick, label }) => {
    return (
        <button
            onClick={onClick}
            className="relative rounded-2xl border border-dashed border-gray-200 hover:border-gray-300 bg-white h-full  transition-shadow hover:shadow-md p-6 flex items-center justify-center"
        >
            <div className="flex gap-3 place-items-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 grid place-items-center">
                    <Plus className="w-6 h-6 text-gray-600" />
                </div>
                <span className="text-base font-medium text-gray-700">
                    {label}
                </span>
            </div>
        </button>
    );
};

export default CreateCard;
