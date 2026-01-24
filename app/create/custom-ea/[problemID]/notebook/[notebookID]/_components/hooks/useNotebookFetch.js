"use client";

import { useEffect, useState } from "react";
import { env } from "next-runtime-env";
import useNotebookLLM from "./useNotebookLLM";

// Lightweight decoder copied from previous implementation
const tryDecodePayload = (p) => {
    if (p === null || p === undefined) return p;
    if (typeof p === "object") return p;
    if (typeof p !== "string") return p;
    const s = p.trim();
    if (s.startsWith("{") || s.startsWith("[")) {
        try {
            return JSON.parse(s);
        } catch (e) {}
    }
    try {
        let b64 = s.replace(/-/g, "+").replace(/_/g, "/");
        while (b64.length % 4 !== 0) b64 += "=";
        const decoded = atob(b64);
        try {
            return JSON.parse(decoded);
        } catch (e) {
            try {
                const utf8 = decodeURIComponent(
                    Array.prototype.map
                        .call(
                            decoded,
                            (c) =>
                                "%" +
                                ("00" + c.charCodeAt(0).toString(16)).slice(-2),
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
        return s;
    }
};

const removeEmpty = (obj) => {
    if (obj === null || obj === undefined) return null;
    if (Array.isArray(obj))
        return obj.map(removeEmpty).filter((i) => i !== null);
    if (typeof obj === "object") {
        return Object.entries(obj)
            .map(([k, v]) => [k, removeEmpty(v)])
            .filter(([, v]) => v !== null && v !== "" && v !== undefined)
            .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
    }
    return obj;
};

export default function useNotebookFetch(notebookId, problemId) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [initialCells, setInitialCells] = useState(null);
    const { generateNotebook, loading: llmLoading } = useNotebookLLM(notebookId);

    useEffect(() => {
        let mounted = true;
        const controller = new AbortController();

        const uid = () => {
            if (typeof crypto !== "undefined" && crypto.randomUUID) {
                return crypto.randomUUID();
            }
            // Fallback
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
                const r = (Math.random() * 16) | 0;
                const v = c === "x" ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            });
        };

        // Helper to correctly parse cell_name from the GET /notebooks/{id} response
        const getCellNameAsString = (cellName) => {
            if (cellName && typeof cellName === 'object' && cellName.Valid) {
                return cellName.String;
            }
            // In case it's already a string (from generate response or future API changes)
            if (typeof cellName === 'string') {
                return cellName;
            }
            return null;
        };
        
        const fetchAndPrepareNotebook = async () => {
            if (!notebookId) return;

            setLoading(true);
            setError(null);

            try {
                const base = env("NEXT_PUBLIC_BACKEND_BASE_URL") ?? "http://localhost:8080";
                const res = await fetch(`${base}/api/v1/notebooks/${notebookId}`, {
                    method: "GET",
                    credentials: "include",
                    signal: controller.signal,
                });

                if (res.status === 401) {
                    window.location.href = "/auth";
                    return;
                }

                // Scenario A: Notebook exists
                if (res.ok) {
                    const notebookData = await res.json();
                    const currentCells = notebookData?.cells ?? [];

                    if (currentCells.length > 0) {
                        console.log("Notebook found with cells, loading content.");
                        const mappedCells = currentCells.map((c, i) => ({
                            ...c,
                            id: c.id, // Use frontend ID
                            idx: i,
                            cell_name: getCellNameAsString(c.cell_name), // Correctly parse cell_name
                            source: c.source || "",
                            execution_count: c.execution_count || 0,
                        }));
                        setInitialCells(mappedCells);
                        return; // Done
                    }
                    // If notebook exists but is empty, fall through to generation
                    console.log("Notebook found, but it is empty. Generating content.");
                } else if (res.status !== 404) {
                    // Handle errors other than "Not Found"
                    const errorText = await res.text();
                    throw new Error(`Failed to fetch notebook: ${res.status} ${errorText}`);
                } else {
                    console.log("Notebook not found. Creating and generating a new one.");
                    // This is a new notebook, we need to create the DB entry first
                    // The backend should handle creating the notebook entry on generate
                }
                
                // Scenario B: Notebook is new or empty, so we generate it.
                if (!problemId) {
                    throw new Error("Cannot generate notebook: Missing Problem ID.");
                }

                const llmResult = await generateNotebook(problemId);

                if (!llmResult || !llmResult.notebook || !llmResult.notebook.cells) {
                    throw new Error("Failed to generate notebook content from LLM.");
                }
                
                const generatedCells = llmResult.notebook.cells.map((c, i) => ({
                    ...c,
                    id: uid(), // Create frontend UUID for new cells
                    idx: i,
                    cell_name: c.cell_name, // Is already a string from generate endpoint
                    source: Array.isArray(c.source) ? c.source.join("") : c.source || "",
                    outputs: [],
                    execution_count: c.execution_count || 0,
                }));
                
                setInitialCells(generatedCells);

            } catch (err) {
                if (controller.signal.aborted) return;
                console.error("Error during notebook fetch/generation:", err);
                setError(err.message || "An unknown error occurred.");
                setInitialCells([]);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchAndPrepareNotebook();

        return () => {
            mounted = false;
            controller.abort();
        };
    }, [notebookId, problemId]);

    // Expose a combined loading state
    const isProcessing = loading || llmLoading;

    return { loading: isProcessing, error, initialCells, setInitialCells };
}
