"use client";

import { authenticatedFetchV2 } from "../../../../../../../utils/api";

export default function useNotebookPersistence() {
    const saveNotebook = async (notebookId, currentCells) => {
        try {
            await authenticatedFetchV2(`/api/v1/notebooks/${notebookId}`, {
                method: "PUT",
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
