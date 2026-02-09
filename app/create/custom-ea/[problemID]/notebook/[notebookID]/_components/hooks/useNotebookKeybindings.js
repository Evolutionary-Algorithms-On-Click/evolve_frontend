
"use client";

import { useEffect } from "react";

export default function useNotebookKeybindings() {
    useEffect(() => {
        function handleKeyDown(event) {
            if (event.key === "ArrowDown") {
                window.scrollBy(0, 100);
            } else if (event.key === "ArrowUp") {
                window.scrollBy(0, -100);
            } else if (event.key === "Tab") {
                const cells = Array.from(document.querySelectorAll("[data-cell-id]"));
                const activeElement = document.activeElement;
                const activeCellIndex = cells.findIndex(cell => cell.contains(activeElement));

                if (activeCellIndex !== -1) {
                    event.preventDefault();
                    const nextCellIndex = event.shiftKey
                        ? (activeCellIndex - 1 + cells.length) % cells.length
                        : (activeCellIndex + 1) % cells.length;
                    cells[nextCellIndex].focus();
                }
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
}
