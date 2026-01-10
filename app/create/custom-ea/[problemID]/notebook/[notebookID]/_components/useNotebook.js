"use client";

import { useEffect, useRef, useState } from "react";
import useNotebookFetch from "./hooks/useNotebookFetch";
import useNotebookPersistence from "./hooks/useNotebookPersistence";
import useNotebookCells from "./hooks/useNotebookCells";
import useNotebookExecution from "./hooks/useNotebookExecution";
import useNotebookLLM from "./hooks/useNotebookLLM";

export default function useNotebook(notebookId, problemId) {
    const [session, setSession] = useState(null);
    const startSessionRef = useRef(null);

    // fetch/generate initial cells
    const { loading, error, initialCells, setInitialCells } = useNotebookFetch(
        notebookId,
        problemId,
        session,
    );

    // cells management
    const cellsHook = useNotebookCells(null);
    const {
        cells,
        setInitial,
        addCodeCell,
        addMarkdownCell,
        updateCell,
        removeCell,
        moveCellUp,
        moveCellDown,
        setCells,
    } = cellsHook;

    // when fetch completes populate cell state
    useEffect(() => {
        if (initialCells !== null) {
            setInitial(initialCells);
        }
    }, [initialCells]);

    // persistence
    const { saveNotebook } = useNotebookPersistence();

    // execution: provide a ref so execution hook can call back into updateCell
    const updateCellRef = useRef(null);
    // keep latest updateCell function in the ref
    useEffect(() => {
        updateCellRef.current = updateCell;
    }, [updateCell]);

    const { runCell: execRunCell, runAll: execRunAll } = useNotebookExecution(
        session,
        updateCellRef,
    );

    const { fixNotebook, modifyNotebook } = useNotebookLLM(notebookId);

    const runCell = async (cell) => execRunCell(cell, startSessionRef);
    const runAll = async () => execRunAll(cells, startSessionRef);

    async function fixCell(cell, traceback) {
        const transformedNotebook = {
            cells: cells.map(c => ({
                ...c,
                cell_type: c.cell_type,
                execution_count: c.execution_count || 0,
            }))
        };
        const updatedNotebook = await fixNotebook(transformedNotebook, traceback);
        if (updatedNotebook) {
            setCells(updatedNotebook.cells);
        }
    }

    async function modifyCell(cell, instruction) {
        const cellName = cell ? cell.id : null;
        const transformedNotebook = {
            cells: cells.map(c => ({
                ...c,
                cell_type: c.cell_type,
                execution_count: c.execution_count || 0,
            }))
        };
        const updatedNotebook = await modifyNotebook(transformedNotebook, instruction, cellName);
        if (updatedNotebook) {
            setCells(updatedNotebook.cells);
        }
    }

    function handleSave() {
        if (!cells) {
            alert("No notebook content to save.");
            return;
        }
        saveNotebook(notebookId, cells);
        alert("Notebook saved!");
    }

    return {
        cells,
        loading,
        error,
        addCodeCell,
        addMarkdownCell,
        updateCell,
        removeCell,
        moveCellUp,
        moveCellDown,
        runCell,
        runAll,
        handleSave,
        session,
        setSession,
        startSessionRef,
        fixCell,
        modifyCell,
    };
}
