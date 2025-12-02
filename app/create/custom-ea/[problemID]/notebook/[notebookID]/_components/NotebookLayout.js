"use client";

import React from "react";

export default function NotebookLayout({ children }) {
    return (
        <div className="w-full bg-slate-50 min-h-screen">
            <div className="w-full py-4 px-4 border-b border-slate-200 bg-white/40 backdrop-blur-sm">
                <div className="max-w-full mx-auto flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">
                            Notebook
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Interactive Python notebook
                        </p>
                    </div>
                    <div className="text-sm text-slate-500">&nbsp;</div>
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
