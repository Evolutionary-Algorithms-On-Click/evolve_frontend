"use client";

import React, { useState, useRef, useEffect } from "react";

export default function Toolbar({
    onAddCode,
    onAddMarkdown,
    onSave,
    onRunAll,
    mode = "full",
}) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    // Toolbar: lightweight, full-width friendly controls (no reorder button)

    useEffect(() => {
        function onDoc(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    // Add-only mode: rounded rectangle buttons for adding cells
    if (mode === "add") {
        return (
            <div className="flex items-center gap-3">
                <button
                    onClick={onAddCode}
                    className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 bg-white text-sm font-medium hover:bg-blue-50"
                    title="Add code cell"
                >
                    + Code
                </button>
                <button
                    onClick={onAddMarkdown}
                    className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 bg-white text-sm font-medium hover:bg-blue-50"
                    title="Add markdown cell"
                >
                    + Markdown
                </button>
            </div>
        );
    }

    // Actions-only mode: Run All and kebab menu
    if (mode === "actions") {
        return (
            <div className="flex items-center gap-3">
                <button
                    onClick={onRunAll}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm shadow-sm hover:bg-emerald-700"
                    title="Run all code cells"
                >
                    Run All
                </button>

                {/* no reorder toggle — per design request */}

                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setOpen((v) => !v)}
                        className="ml-2 p-2 rounded text-gray-600 hover:bg-gray-100"
                        aria-expanded={open}
                        aria-haspopup="true"
                        title="More actions"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="19" r="1" />
                        </svg>
                    </button>

                    {open && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded shadow-md py-1 z-20">
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    onSave && onSave();
                                }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    onRunAll && onRunAll();
                                }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                            >
                                Run All
                            </button>
                            <div className="px-3 py-2 text-xs text-slate-500">
                                Options
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Full mode (fallback): modern sticky navbar with tones + reorder toggle
    return (
        <div className="sticky top-0 z-30">
            <div className="flex items-center gap-4 px-4 py-3 bg-gradient-to-r from-slate-50 via-white to-slate-50/90 border-b border-slate-200/60 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onAddCode}
                        className="w-12 h-12 flex items-center justify-center rounded-md border border-indigo-200 bg-white text-indigo-600 text-sm font-medium hover:shadow-sm"
                        title="Add code cell"
                    >
                        <span className="text-lg">+</span>
                    </button>

                    <button
                        onClick={onAddMarkdown}
                        className="w-12 h-12 flex items-center justify-center rounded-md border border-indigo-200 bg-white text-indigo-600 text-sm font-medium hover:shadow-sm"
                        title="Add markdown cell"
                    >
                        <span className="text-lg">M</span>
                    </button>

                    <div className="ml-2 text-sm text-slate-700 font-semibold">
                        Notebook
                    </div>
                </div>

                <div className="flex-1" />

                <div className="flex items-center gap-3">
                    <button
                        onClick={onRunAll}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm shadow-sm hover:bg-emerald-700"
                        title="Run all code cells"
                    >
                        Run All
                    </button>

                    {/* simplified toolbar: no reorder button, no tone toggle */}

                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setOpen((v) => !v)}
                            className="ml-2 p-2 rounded text-gray-600 hover:bg-gray-100"
                            aria-expanded={open}
                            aria-haspopup="true"
                            title="More actions"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="19" r="1" />
                            </svg>
                        </button>

                        {open && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded shadow-md py-1 z-20">
                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        onSave && onSave();
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        onRunAll && onRunAll();
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                                >
                                    Run All
                                </button>
                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        toggleTone();
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                                >
                                    Toggle Tone ({tone})
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
