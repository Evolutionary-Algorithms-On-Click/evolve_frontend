"use client";

import { useState } from "react";
import { authenticatedFetchV2 } from "@/app/utils/api";

export default function useNotebookLLM(notebookId) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function generateNotebook(problemId) {
        setLoading(true);
        setError(null);
        try {
            const data = await authenticatedFetchV2(`/api/v1/llm/generate`, {
                method: "POST",
                body: JSON.stringify({
                    problem_id: problemId,
                    notebook_id: notebookId,
                }),
            });
            return data;
        } catch (error) {
            setError(error.message);
            if (error.message.includes("401")) {
                window.location.href = "/auth";
            }
            // Return null or a specific error structure if needed
            return null;
        } finally {
            setLoading(false);
        }
    }

    async function fixNotebook(notebook, traceback) {
        setLoading(true);
        setError(null);
        try {
            const data = await authenticatedFetchV2(`/api/v1/llm/fix`, {
                method: "POST",
                body: JSON.stringify({
                    notebook,
                    traceback,
                    notebook_id: notebookId,
                }),
            });
            return {
                notebook: data.notebook,
                message: data.message,
                changes_made: data.changes_made,
                cells_modified: data.cells_modified,
            };
        } catch (error) {
            setError(error.message);
            if (error.message.includes("401")) {
                window.location.href = "/auth";
            }
        }
        finally {
            setLoading(false);
        }
    }

    async function modifyNotebook(notebook, instruction, cellName = null) {
        setLoading(true);
        setError(null);
        try {
            const data = await authenticatedFetchV2(`/api/v1/llm/modify`, {
                method: "POST",
                body: JSON.stringify({
                    notebook,
                    instruction,
                    cell_name: cellName,
                    notebook_id: notebookId,
                }),
            });
            return {
                notebook: data.notebook,
                message: data.message,
                changes_made: data.changes_made,
                cells_modified: data.cells_modified,
            };
        } catch (error) {
            setError(error.message);
            if (error.message.includes("401")) {
                window.location.href = "/auth";
            }
        } finally {
            setLoading(false);
        }
    }

    return {
        generateNotebook,
        fixNotebook,
        modifyNotebook,
        loading,
        error,
    };
}
