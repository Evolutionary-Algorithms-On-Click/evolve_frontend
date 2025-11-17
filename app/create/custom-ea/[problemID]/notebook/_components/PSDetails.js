"use client";

import React, { useState } from "react";
import formatDate from "@/app/utils/formatDate";

const SummaryRow = ({ label, value }) => {
    if (value === undefined || value === null || value === "") return null;
    return (
        <div className="flex items-start gap-3">
            <div className="text-xs text-gray-500 w-36">{label}</div>
            <div className="text-sm text-gray-800 break-words">{value}</div>
        </div>
    );
};

const PSDetails = ({ statement }) => {
    const [open, setOpen] = useState(false);

    // The API may either return the full problem in the top-level object,
    // or provide a `description_json` property with the full form data.
    const payload = statement && (statement.description_json || statement);

    // Try to decode payload when it's an encoded string (JSON string or base64)
    const tryDecodePayload = (p) => {
        if (p === null || p === undefined) return p;
        if (typeof p === "object") return p;
        if (typeof p !== "string") return p;

        const s = p.trim();

        // If it looks like JSON, parse it
        if (s.startsWith("{") || s.startsWith("[")) {
            try {
                return JSON.parse(s);
            } catch (e) {
                // fall through
            }
        }

        // Try Base64 (including URL-safe) decode
        try {
            let b64 = s.replace(/-/g, "+").replace(/_/g, "/");
            while (b64.length % 4 !== 0) b64 += "=";
            const decoded = atob(b64);

            // Try parse decoded as JSON
            try {
                return JSON.parse(decoded);
            } catch (e) {
                // Try decoding as UTF-8 percent-encoded
                try {
                    const utf8 = decodeURIComponent(
                        Array.prototype.map
                            .call(
                                decoded,
                                (c) =>
                                    "%" +
                                    ("00" + c.charCodeAt(0).toString(16)).slice(
                                        -2,
                                    ),
                            )
                            .join(""),
                    );
                    try {
                        return JSON.parse(utf8);
                    } catch (e2) {
                        return utf8;
                    }
                } catch (e3) {
                    return decoded;
                }
            }
        } catch (err) {
            // not base64 - return original
            return s;
        }
    };

    const decoded = tryDecodePayload(payload);

    const title = statement?.title || decoded?.problemName || "Untitled";
    const date = statement?.created_at || statement?.date || null;

    const objectiveType =
        decoded?.objectiveType || decoded?.objective_type || null;
    const objectiveFunction =
        decoded?.objectiveFunction || decoded?.objective_function || null;
    const goal = decoded?.goalDescription || decoded?.goal_description || null;
    const constraints = decoded?.constraints || null;

    const representation =
        decoded?.solutionRepresentation ||
        decoded?.solution_representation ||
        null;
    const solutionSize =
        decoded?.solutionSize || decoded?.solution_size || null;

    const populationSize =
        decoded?.populationSize || decoded?.population_size || null;
    const numGenerations =
        decoded?.numGenerations || decoded?.num_generations || null;

    const fitness =
        decoded?.fitnessDescription || decoded?.fitness_description || null;

    const isDecodedObject = typeof decoded === "object";
    const prettyJSON = isDecodedObject
        ? JSON.stringify(decoded, null, 2)
        : String(decoded ?? "");

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(prettyJSON);
            alert("Copied details to clipboard");
        } catch (e) {
            console.error(e);
            alert("Failed to copy");
        }
    };

    return (
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-gray-900 truncate">
                        {title}
                    </h3>
                    <div className="text-xs text-gray-500 mt-1">
                        {date ? formatDate(date) : "Unknown date"}
                    </div>
                </div>

                <div className="flex-shrink-0">
                    <button
                        onClick={() => setOpen((s) => !s)}
                        className="px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200"
                    >
                        {open ? "Show less" : "Show more"}
                    </button>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3">
                    {objectiveType && (
                        <span className="text-xs px-2 py-1 rounded-full bg-sky-100 text-sky-700">
                            {objectiveType}
                        </span>
                    )}
                    {representation && (
                        <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                            {representation}
                        </span>
                    )}
                </div>

                {goal && (
                    <div className="text-sm text-gray-800 line-clamp-3">
                        {goal}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4 mt-2">
                    <SummaryRow
                        label="Objective fn"
                        value={objectiveFunction}
                    />
                    <SummaryRow label="Constraints" value={constraints} />
                    <SummaryRow label="Solution size" value={solutionSize} />
                    <SummaryRow label="Population" value={populationSize} />
                    <SummaryRow label="Generations" value={numGenerations} />
                    <SummaryRow label="Fitness" value={fitness} />
                </div>

                {open && (
                    <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-sm text-gray-600">
                                Full Problem Details
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleCopy}
                                    className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                                >
                                    Copy JSON
                                </button>
                            </div>
                        </div>

                        <pre className="max-h-72 overflow-auto bg-gray-50 p-3 rounded text-xs text-gray-800">
                            {prettyJSON}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PSDetails;
