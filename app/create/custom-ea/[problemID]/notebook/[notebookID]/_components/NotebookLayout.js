"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NotebookLayout({ children }) {
    const router = useRouter();

    return (
        <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-[family-name:var(--font-geist-mono)]">
            <div className="w-full py-4 px-4 border-b border-slate-200 bg-white/40 backdrop-blur-sm">
                <div className="max-w-full mx-auto flex items-center justify-between gap-4 relative">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 group text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors duration-200"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h17.25"
                                />
                            </svg>
                            Back
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="bg-foreground text-background p-1.5 rounded-lg rotate-[-4deg] group-hover:rotate-0 transition-transform duration-200">
                                <Image
                                    src="/EvOCicon.png"
                                    alt="EvOC Icon"
                                    width={24}
                                    height={24}
                                    className="invert dark:invert-0"
                                />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-800">
                                    Notebook
                                </h1>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Interactive Python notebook
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-1 px-2 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs rounded-md whitespace-nowrap">
                        Tip: Top Markdown cell sets title.
                    </div>
                </div>
            </div>

            <div className="w-full">
                <div className="w-full mx-auto">
                    <div className="w-full px-6 py-6 space-y-6">{children}</div>
                </div>
            </div>
        </div>
    );
}
