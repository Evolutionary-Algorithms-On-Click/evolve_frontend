"use client";

import React from "react";
import { Plus } from "lucide-react";

export default function AddCellBar({ onAddCode, onAddMarkdown }) {
    return (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="h-px w-full bg-gray-300 absolute" />
            <div className="flex items-center gap-4 z-10">
                <button
                    onClick={onAddCode}
                    className="px-3 py-1 bg-white border border-gray-300 rounded-full text-xs text-gray-700 hover:bg-gray-100"
                >
                    <Plus size={14} className="inline-block mr-1" />
                    Code
                </button>
                <button
                    onClick={onAddMarkdown}
                    className="px-3 py-1 bg-white border border-gray-300 rounded-full text-xs text-gray-700 hover:bg-gray-100"
                >
                    <Plus size={14} className="inline-block mr-1" />
                    Markdown
                </button>
            </div>
        </div>
    );
}
