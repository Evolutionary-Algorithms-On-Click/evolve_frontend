"use client";

import { useState } from "react";

export default function useNotebookLLM(notebookId) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function fixNotebook(notebook, traceback) {
        setLoading(true);
        setError(null);
        try {
            const base =
                process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? "http://localhost:8080";
            const response = await fetch(`${base}/api/v1/llm/fix`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    notebook,
                    traceback,
                    user_id: "user_id_placeholder",
                    notebook_id: notebookId,
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to fix notebook");
            }
            const data = await response.json();
            return {
                notebook: data.notebook,
                message: data.message,
                changes_made: data.changes_made,
                cells_modified: data.cells_modified,
            };
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function modifyNotebook(notebook, instruction, cellName = null) {
        setLoading(true);
        setError(null);
        try {
            const base =
                process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? "http://localhost:8080";
            const response = await fetch(`${base}/api/v1/llm/modify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    notebook,
                    instruction,
                    cell_name: cellName,
                    user_id: "user_id_placeholder",
                    notebook_id: notebookId,
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to modify notebook");
            }
            const data = await response.json();
            return {
                notebook: data.notebook,
                message: data.message,
                changes_made: data.changes_made,
                cells_modified: data.cells_modified,
            };
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return {
        fixNotebook,
        modifyNotebook,
        loading,
        error,
    };
}
