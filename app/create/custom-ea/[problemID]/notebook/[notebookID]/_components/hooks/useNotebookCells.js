"use client";

import { useState } from "react";

function uid(prefix = "id") {
    return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export default function useNotebookCells(initial = null) {
    const [cells, setCells] = useState(initial || []);
    const [deletedCellIds, setDeletedCellIds] = useState(new Set());

    const setInitial = (initialCells) =>
        setCells((initialCells || []).map((c, i) => ({ ...c, idx: i })));

    function addCodeCell(index) {
        setCells((s) => {
            const arr = [...(s || [])];
            const newCell = {
                id: uid("code"),
                cell_name: "new_code_cell",
                cell_type: "code",
                source: "",
                outputs: [],
                execution_count: 0,
            };
            if (index !== undefined) {
                arr.splice(index, 0, newCell);
            } else {
                arr.push(newCell);
            }
            return arr.map((c, i) => ({ ...c, idx: i }));
        });
    }

    function addMarkdownCell(index) {
        setCells((s) => {
            const arr = [...(s || [])];
            const newCell = {
                id: uid("md"),
                cell_name: "new_markdown_cell",
                cell_type: "markdown",
                source: "New paragraph",
            };
            if (index !== undefined) {
                arr.splice(index, 0, newCell);
            } else {
                arr.push(newCell);
            }
            return arr.map((c, i) => ({ ...c, idx: i }));
        });
    }

    function updateCell(updated) {
        setCells((s) => {
            const arr = (s || []).map((c) =>
                c.id === updated.id ? { ...updated } : c,
            );
            return arr.map((c, i) => ({ ...c, idx: i }));
        });
    }

    function removeCell(id) {
        setCells((s) => {
            const cellToRemove = s.find(c => c.id === id);
            if (cellToRemove) {
                setDeletedCellIds(prev => new Set(prev).add(id));
            }
            const arr = (s || []).filter((c) => c.id !== id);
            return arr.map((c, i) => ({ ...c, idx: i }));
        });
    }

    function moveCellUp(id) {
        setCells((s) => {
            const arr = [...(s || [])];
            const idx = arr.findIndex((c) => c.id === id);
            if (idx > 0) {
                const [item] = arr.splice(idx, 1);
                arr.splice(idx - 1, 0, item);
            }
            return arr.map((c, i) => ({ ...c, idx: i }));
        });
    }

    function moveCellDown(id) {
        setCells((s) => {
            const arr = [...(s || [])];
            const idx = arr.findIndex((c) => c.id === id);
            if (idx >= 0 && idx < arr.length - 1) {
                const [item] = arr.splice(idx, 1);
                arr.splice(idx + 1, 0, item);
            }
            return arr.map((c, i) => ({ ...c, idx: i }));
        });
    }

    function clearDeletedCellIds() {
        setDeletedCellIds(new Set());
    }

    return {
        cells,
        setInitial,
        addCodeCell,
        addMarkdownCell,
        updateCell,
        removeCell,
        moveCellUp,
        moveCellDown,
        setCells,
        deletedCellIds,
        clearDeletedCellIds,
    };
}
