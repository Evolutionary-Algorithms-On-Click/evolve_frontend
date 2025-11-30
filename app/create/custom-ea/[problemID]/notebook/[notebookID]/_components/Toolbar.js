"use client";

import React from "react";

export default function Toolbar({
    onAddCode,
    onAddMarkdown,
    onSave,
    onRunAll,
}) {
    return (
        <div className="mt-4 flex items-center gap-3">
            <button
                onClick={onAddCode}
                className="px-3 py-1 border border-blue-600 text-blue-600 rounded text-sm bg-white"
            >
                + Code
            </button>
            <button
                onClick={onAddMarkdown}
                className="px-3 py-1 border border-blue-600 text-blue-600 rounded text-sm bg-white"
            >
                + Markdown
            </button>
            <div className="flex-1" />
            <button
                onClick={onRunAll}
                className="px-3 py-1 bg-emerald-600 text-white rounded text-sm"
            >
                Run All
            </button>
            <button
                onClick={onSave}
                className="px-3 py-1 bg-white border border-gray-200 text-gray-800 rounded text-sm"
            >
                Save
            </button>
        </div>
    );
}
