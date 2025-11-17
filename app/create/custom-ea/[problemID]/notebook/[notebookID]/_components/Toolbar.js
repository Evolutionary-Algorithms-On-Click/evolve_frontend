"use client";

import React from "react";

export default function Toolbar({ onAddCode, onAddMarkdown, onSave }) {
    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex gap-3">
                <button
                    onClick={onAddCode}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
                >
                    + Code
                </button>
                <button
                    onClick={onAddMarkdown}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm"
                >
                    + Markdown
                </button>
            </div>
            <div>
                <button
                    onClick={onSave}
                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm"
                >
                    Save
                </button>
            </div>
        </div>
    );
}
