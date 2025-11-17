"use client";

import React from "react";

export default function OutputArea({ outputs = [] }) {
    if (!outputs || outputs.length === 0) {
        return null;
    }

    return (
        <div className="mt-3 bg-gray-900 text-gray-100 rounded-lg p-3 text-sm font-mono border border-gray-800">
            {outputs.map((o, i) => (
                <div key={i} className="mb-1">
                    {o}
                </div>
            ))}
        </div>
    );
}
