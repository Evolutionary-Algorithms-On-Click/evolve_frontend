"use client";

import React, { useState } from "react";
import OutputArea from "./OutputArea";

export default function CodeCell({ cell, onChange, onRun, readOnly = false }) {
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
        <div className="mb-4">
            <div className="border border-gray-200 rounded-lg bg-white p-4">
                <textarea
                    className="w-full min-h-[120px] bg-white font-mono text-sm p-3 rounded-lg border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={value}
                    onChange={handleChange}
                    readOnly={readOnly}
                />
                <div className="flex justify-end mt-3">
                    <button
                        onClick={handleRun}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
                    >
                        Run
                    </button>
                </div>
            </div>
            <OutputArea outputs={cell.outputs || []} />
        </div>
    );
}
