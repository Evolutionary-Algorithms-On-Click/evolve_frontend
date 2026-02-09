"use client";

import { useEffect, useState } from "react";
import { authenticatedFetchV2 } from "../../../../../../../utils/api";
import useNotebookLLM from "./useNotebookLLM";

// ... (helper functions remain the same)

export default function useNotebookFetch(notebookId, problemId) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [initialCells, setInitialCells] = useState(null);
    const [initialRequirements, setInitialRequirements] = useState('');
    const [initialName, setInitialName] = useState('');
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

        const getRequirementsAsString = (requirements) => {
            if (requirements && typeof requirements === 'object' && requirements.Valid) {
                return requirements.String;
            }
            // In case it's already a string (from generate response or future API changes)
            if (typeof requirements === 'string') {
                return requirements;
            }
            return "";
        }
        
        const fetchAndPrepareNotebook = async () => {
            if (!notebookId) return;

            setLoading(true);
            setError(null);

            try {
                const notebookData = await authenticatedFetchV2(`/api/v1/notebooks/${notebookId}`, {
                    signal: controller.signal,
                });
                 console.log("Fetched notebook data:", notebookData.requirements.String);
               if (notebookData.notebook && notebookData.notebook.requirements) {
                    setInitialRequirements(getRequirementsAsString(notebookData.notebook.requirements));
                } else if (notebookData.requirements) {
                    setInitialRequirements(getRequirementsAsString(notebookData.requirements));
                }

                if (notebookData.title) {
                    setInitialName(notebookData.title);
                }
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
                    setLoading(false);
                    return; // Done
                }
                console.log("Notebook found, but it is empty. Generating content.");

            } catch (err) {
                if (err.message.includes("404")) {
                    console.log("Notebook not found. Creating and generating a new one.");
                } else if (controller.signal.aborted) {
                    return;
                } else {
                    console.error("Failed to fetch notebook:", err);
                    setError(`Failed to fetch notebook: ${err.message}`);
                    setLoading(false);
                    return;
                }
            }
            
            // Scenario B: Notebook is new or empty, so we generate it.
            if (!problemId) {
                setError("Cannot generate notebook: Missing Problem ID.");
                setLoading(false);
                return;
            }

            try {
                const llmResult = await generateNotebook(problemId);

                if (!llmResult || !llmResult.notebook || !llmResult.notebook.cells) {
                    throw new Error("Failed to generate notebook content from LLM.");
                }
                
                if (llmResult.notebook && llmResult.notebook.requirements) {
                    setInitialRequirements(llmResult.notebook.requirements);
                }
                else if (llmResult.requirements) {
                    setInitialRequirements(llmResult.requirements);
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
                console.error("Error during notebook generation:", err);
                setError(err.message || "An unknown error occurred during generation.");
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

    return { loading: isProcessing, error, initialCells, setInitialCells, initialRequirements, initialName };
}
