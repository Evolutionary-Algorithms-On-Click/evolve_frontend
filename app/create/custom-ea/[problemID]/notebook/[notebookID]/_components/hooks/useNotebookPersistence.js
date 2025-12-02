"use client";

import { env } from "next-runtime-env";

export default function useNotebookPersistence() {
    const saveNotebook = async (notebookId, currentCells) => {
        const base =
            env("NEXT_PUBLIC_BACKEND_BASE_URL") ?? "http://localhost:8080";
        try {
            await fetch(`${base}/api/v1/notebooks/${notebookId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    cells: currentCells.map(({ id, ...rest }) => rest),
                }),
            });
        } catch (err) {
            console.error("Failed to save notebook:", err);
            alert("Warning: Failed to save notebook state to the server.");
        }
    };

    return { saveNotebook };
}
