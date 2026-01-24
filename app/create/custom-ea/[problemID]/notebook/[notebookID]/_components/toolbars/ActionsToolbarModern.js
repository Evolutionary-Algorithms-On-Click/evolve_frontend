"use client";

import React, { useState, useRef, useEffect } from "react";

export default function ActionsToolbarModern({
    onRunAll,
    onSave,
    onExportIpynb,
    onExportHtml,
    onPrintPdf,
}) {
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

    const createMenuButton = (label, onClick, icon) => (
        <button
            onClick={() => {
                setOpen(false);
                onClick && onClick();
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-3"
        >
            {icon}
            {label}
        </button>
    );

    const SaveIcon = () => (
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
    );

    const DownloadIcon = () => (
        <svg
            className="w-4 h-4 text-slate-500"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
    );

    const PrinterIcon = () => (
        <svg
            className="w-4 h-4 text-slate-500"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
        </svg>
    );

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
                        {createMenuButton("Save", onSave, <SaveIcon />)}
                        <div className="border-t my-2 border-gray-100"></div>
                        <div className="px-4 pt-1 pb-2 text-xs text-slate-400 font-semibold uppercase">
                            Export
                        </div>
                        {createMenuButton(
                            "As .ipynb",
                            onExportIpynb,
                            <DownloadIcon />,
                        )}
                        {createMenuButton(
                            "As .html",
                            onExportHtml,
                            <DownloadIcon />,
                        )}
                        {createMenuButton(
                            "Print to PDF",
                            onPrintPdf,
                            <PrinterIcon />,
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
