"use client";

import React from "react";

export default function NotebookLayout({ children }) {
    return (
        <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-[family-name:var(--font-geist-mono)]">
            <div className="w-full py-4 px-4 border-b border-slate-200 bg-white/40 backdrop-blur-sm">
                <div className="max-w-full mx-auto flex items-start justify-between gap-4 relative">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">
                            Notebook
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Interactive Python notebook
                        </p>
                    </div>
                    <div className="absolute right-0 top-0 p-1 px-2 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs rounded-md whitespace-nowrap">
                        Tip: Top Markdown cell sets title.
                    </div>
                </div>
            </div>

            <div className="w-full">
                <div className="w-full mx-auto">
                    <div className="w-full px-4 py-6 space-y-6">{children}</div>
                </div>
            </div>
        </div>
    );
}
