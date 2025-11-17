"use client";

import React from "react";

export default function NotebookLayout({ children }) {
    return (
        <div className="w-full">
            <div className="max-w-6xl mx-auto py-8 px-4">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Notebook
                        </h2>
                    </div>
                    <div className="p-6">{children}</div>
                </div>
            </div>
        </div>
    );
}
