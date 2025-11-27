"use client";

import React, { useState } from "react";
import OutputArea from "./OutputArea";

export default function CodeCell({
    cell,
    onChange,
    onRun,
    onRemove,
    readOnly = false,
}) {
    const [value, setValue] = useState(cell.content || "");

    function handleChange(e) {
        setValue(e.target.value);
        onChange && onChange({ ...cell, content: e.target.value });
    }

    async function handleRun() {
        if (onRun) {
            await onRun(cell);
        }
    }

    return (
        <div className="group relative mb-4">
            <div className="border border-gray-200 rounded-lg bg-white p-4">
                <textarea
                    className="w-full min-h-[120px] bg-white font-mono text-sm p-3 rounded-lg border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={value}
                    onChange={handleChange}
                    readOnly={readOnly}
                />
                <div className="flex justify-end mt-3 gap-2">
                    <button
                        onClick={handleRun}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
                    >
                        Run
                    </button>
                </div>
            </div>
            <OutputArea outputs={cell.outputs || []} />

            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={onRemove}
                    className="p-1.5 bg-gray-100 hover:bg-red-100 rounded text-gray-500 hover:text-red-600"
                    aria-label="Remove cell"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
