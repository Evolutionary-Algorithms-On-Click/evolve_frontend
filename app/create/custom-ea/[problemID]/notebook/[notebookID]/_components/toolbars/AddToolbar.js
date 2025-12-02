"use client";

import React from "react";

export default function AddToolbar({ onAddCode, onAddMarkdown }) {
    return (
        <div className="flex items-center gap-3">
            <button
                onClick={onAddCode}
                title="Add code cell"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md hover:opacity-95 active:scale-[0.995] transition-transform duration-150 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                </svg>
                <span>Code</span>
            </button>

            <button
                onClick={onAddMarkdown}
                title="Add markdown cell"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 shadow-sm hover:shadow-md active:scale-[0.995] transition duration-150 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M3 7v10a2 2 0 0 0 2 2h14" />
                    <path d="M7 7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v10" />
                </svg>
                <span>Markdown</span>
            </button>
        </div>
    );
}
