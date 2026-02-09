"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { theoryData } from "@/app/_data/theory";

export default function TheoryTooltip({ id }) {
    const [isVisible, setIsVisible] = useState(false);
    const data = theoryData[id];

    if (!data) return null;

    return (
        <div className="relative inline-block ml-2 group">
            <button
                type="button"
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                onClick={() => setIsVisible(!isVisible)}
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 focus:outline-none flex items-center"
                aria-label="Theoretical Information"
            >
                <Info size={18} />
            </button>

            {isVisible && (
                <div className="absolute z-[100] bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] transition-all duration-200 ease-out transform opacity-100 scale-100">
                    <div className="relative">
                        <h5 className="font-bold text-gray-900 text-sm mb-1 uppercase tracking-wider">
                            {data.title}
                        </h5>
                        <p className="text-gray-600 text-xs leading-relaxed">
                            {data.explanation}
                        </p>
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white/90" />
                    </div>
                </div>
            )}
        </div>
    );
}
