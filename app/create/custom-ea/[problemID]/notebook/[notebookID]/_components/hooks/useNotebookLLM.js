
"use client";

import { useState } from "react";

export default function useNotebookLLM(notebookId) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function fixNotebook(notebook, traceback) {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/v1/llm/fix", {
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
            return data.notebook;
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function modifyNotebook(notebook, instruction) {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/v1/llm/modify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    notebook,
                    instruction,
                    user_id: "user_id_placeholder",
                    notebook_id: notebookId,
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to modify notebook");
            }
            const data = await response.json();
            return data.notebook;
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
