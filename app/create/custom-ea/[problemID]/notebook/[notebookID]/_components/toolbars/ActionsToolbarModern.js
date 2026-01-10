"use client";

import React, { useState, useRef, useEffect } from "react";

export default function ActionsToolbarModern({ onRunAll, onSave }) {
    const [open, setOpen] = useState(false);
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

    return (
        <div className="flex items-center gap-3">
            <button
                onClick={onRunAll}
                title="Run all code cells"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-600 text-white shadow-lg hover:bg-teal-700 active:scale-[0.995] transition-transform duration-150 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
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
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-20">
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
                        <div className="px-4 py-2 text-xs text-slate-500">
                            Options
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
