"use client";

import React, { useState } from "react";
import { Info } from "lucide-react";
import { theoryData } from "../_data/theory";

const TheoryTooltip = ({ id }) => {
    const [isVisible, setIsVisible] = useState(false);
    const data = theoryData[id];

    if (!data) return null;

    return (
        <div 
            className="relative inline-block ml-2 group"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            <button
                type="button"
                className="text-gray-400 hover:text-blue-600 transition-colors flex items-center"
            >
                <Info size={18} />
            </button>

            {isVisible && (
                <div className="absolute z-[100] w-72 p-4 mt-2 -left-2 sm:left-1/2 sm:-translate-x-1/2 bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
                    <div className="relative">
                        <div className="absolute -top-6 left-4 sm:left-1/2 sm:-translate-x-1/2 w-4 h-4 bg-white/90 border-t border-l border-gray-200 rotate-45" />
                        
                        <h5 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                            {data.title}
                        </h5>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {data.explanation}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TheoryTooltip;
