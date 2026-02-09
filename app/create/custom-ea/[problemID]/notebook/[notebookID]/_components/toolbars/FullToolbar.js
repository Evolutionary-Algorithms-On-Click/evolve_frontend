"use client";

import React, { useState, useRef, useEffect } from "react";

export default function FullToolbar({
    onAddCode,
    onAddMarkdown,
    onRunAll,
    onSave,
    sessionName = "Notebook",
    sessionState = "Idle",
    onStartSession,
}) {
    const [open, setOpen] = useState(false);
    const [tone, setTone] = useState("light");
    const menuRef = useRef(null);

    useEffect(() => {
        function onDoc(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    function toggleTone() {
        setTone((t) => (t === "light" ? "dark" : "light"));
    }

    return (
        <div className="sticky top-0 z-40">
            <div className="flex items-center gap-4 px-4 py-3 bg-white/60 backdrop-blur-sm border-b border-slate-200/60 shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onAddCode}
                        title="Add code cell"
                        className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white border border-slate-200 text-indigo-600 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
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
                    </button>

                    <button
                        onClick={onAddMarkdown}
                        title="Add markdown cell"
                        className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white border border-slate-200 text-indigo-600 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
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
                    </button>

                    <div className="ml-3">
                        <div className="text-sm md:text-base font-sans font-semibold text-slate-900">
                            {sessionName}
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                            <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                    sessionState &&
                                    sessionState.toLowerCase() === "running"
                                        ? "bg-emerald-100 text-emerald-800"
                                        : "bg-slate-100 text-slate-700"
                                }`}
                            >
                                {sessionState}
                            </span>
                            <button
                                onClick={() =>
                                    onStartSession && onStartSession()
                                }
                                title="Start session"
                                className="inline-flex items-center px-2 py-0.5 text-xs rounded-md bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                            >
                                Start
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1" />

                <div className="flex items-center gap-3">
                    <button
                        onClick={onRunAll}
                        title="Run all code cells"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg hover:opacity-95 active:scale-[0.995] transition-transform duration-150 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
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
                            <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        <span>Run All</span>
                    </button>

                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setOpen((v) => !v)}
                            className="ml-2 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-600 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-100"
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
                            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-30">
                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        onSave && onSave();
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-3"
                                >
                                    <svg
                                        className="w-4 h-4 text-slate-500"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M19 21H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2 3h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2z" />
                                    </svg>
                                    Save
                                </button>
                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        onRunAll && onRunAll();
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-3"
                                >
                                    <svg
                                        className="w-4 h-4 text-slate-500"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polygon points="5 3 19 12 5 21 5 3" />
                                    </svg>
                                    Run All
                                </button>
                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        toggleTone();
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-3"
                                >
                                    <svg
                                        className="w-4 h-4 text-slate-500"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                    </svg>
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
