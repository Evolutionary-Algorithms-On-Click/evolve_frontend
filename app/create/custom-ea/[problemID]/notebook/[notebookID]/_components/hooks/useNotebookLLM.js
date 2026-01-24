"use client";

import { useState } from "react";

export default function useNotebookLLM(notebookId) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function generateNotebook(problemId) {
        setLoading(true);
        setError(null);
        try {
            const base =
                process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? "http://localhost:8080";
            const response = await fetch(`${base}/api/v1/llm/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    problem_id: problemId,
                    notebook_id: notebookId,
                    // TODO: Replace with real user ID from session
                    user_id: "user_id_placeholder",
                }),
            });
            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Failed to generate notebook: ${errText}`);
            }
            return await response.json();
        } catch (error) {
            setError(error.message);
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
            return {
                notebook: data.notebook,
                message: data.message,
                changes_made: data.changes_made,
                cells_modified: data.cells_modified,
                requirements: data.notebook.requirements,
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
                requirements: data.notebook.requirements,
            };
        } catch (error) {
            setError(error.message);
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
