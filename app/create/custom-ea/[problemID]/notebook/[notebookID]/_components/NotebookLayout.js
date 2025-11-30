"use client";

import React from "react";

export default function NotebookLayout({ children }) {
    return (
        <div className="w-full">
            <div className="max-w-6xl mx-auto py-8 px-4">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-medium text-gray-800">
                                Notebook
                            </h2>
                            <div className="text-xs text-gray-500">
                                Interactive Python notebook
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Placeholder area for actions - File/Edit/View were placeholders */}
                            <div className="text-sm text-gray-500">&nbsp;</div>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">{children}</div>
                </div>
            </div>
        </div>
    );
}
