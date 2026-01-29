"use client";

import { useEffect, useRef, useState } from "react";
import useNotebookFetch from "./useNotebookFetch";
import useNotebookPersistence from "./useNotebookPersistence";
import useNotebookCells from "./useNotebookCells";
import useNotebookExecution from "./useNotebookExecution";
import useNotebookLLM from "./useNotebookLLM";
import { mapToApiFormat } from "../utils/notebook-mapper";
import useAutosave from "./useAutosave";

const uid = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return `${crypto.randomUUID()}`;
    }

    // Fallback (RFC4122 v4–compatible)
    return `${"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    })}`;
};

export default function useNotebook(notebookId, problemId) {
    const [session, setSession] = useState(null);
    const startSessionRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
    const [requirements, setRequirements] = useState("");
    const [notebookName, setNotebookName] = useState("");

    // fetch/generate initial cells
    const {
        loading,
        error,
        initialCells,
        setInitialCells,
        initialRequirements,
        initialName,
    } = useNotebookFetch(notebookId, problemId, session);

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
        deletedCellIds,
        clearDeletedCellIds,
    } = cellsHook;

    // when fetch completes populate cell state
    useEffect(() => {
        if (initialCells !== null) {
            setInitial(initialCells);
        }
        if (initialRequirements !== null && initialRequirements !== undefined) {
            setRequirements(initialRequirements);
        }
        if (initialName) {
            setNotebookName(initialName);
        }
    }, [initialCells, initialRequirements, initialName]);

    // persistence - OLD
    const { saveNotebook } = useNotebookPersistence();

    // persistence - NEW AUTOSAVE
    const { isSaving, lastSaveTime, triggerSave } = useAutosave(
        notebookId,
        cells,
        deletedCellIds,
        clearDeletedCellIds,
        requirements,
    );

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

    const {
        fixNotebook,
        modifyNotebook,
        loading: llmLoading,
    } = useNotebookLLM(notebookId);

    const runCell = async (cell) => execRunCell(cell, startSessionRef);
    const runAll = async () => execRunAll(cells, startSessionRef);

    function addMessage(message) {
        setMessages((prev) => [...prev, message]);
        if (message.type === "bot") {
            setHasUnreadMessages(true);
        }
    }

    const mapApiResponseToCells = (apiCells) => {
        return apiCells.map((c, i) => ({
            ...c,
            id: uid(),
            idx: i,
            cell_name:
                c.cell_name &&
                typeof c.cell_name === "object" &&
                c.cell_name.Valid
                    ? c.cell_name.String
                    : c.cell_name,
            source: Array.isArray(c.source)
                ? c.source.join("")
                : c.source || "",
        }));
    };

    async function fixCell(cell, traceback) {
        const apiNotebook = mapToApiFormat({ cells, requirements });
        const response = await fixNotebook(apiNotebook, traceback);
        if (response && response.notebook) {
            const newCells = mapApiResponseToCells(response.notebook.cells);
            setCells(newCells);
            if (response.notebook.requirements) {
                setRequirements(
                    response.notebook.requirements &&
                        typeof response.notebook.requirements === "object"
                        ? response.notebook.requirements.String
                        : response.notebook.requirements &&
                            response.notebook.requirements.Valid
                          ? response.notebook.requirements.String
                          : "",
                );
            }
            addMessage({
                type: "bot",
                message:
                    typeof response.message === "string"
                        ? response.message
                        : "Notebook fixed successfully.",
                changes: response.changes_made,
            });
        }
    }

    async function modifyCell(cell, instruction) {
        const cellName = cell ? cell.cell_name : null;
        const apiNotebook = mapToApiFormat({ cells, requirements });
        const response = await modifyNotebook(
            apiNotebook,
            instruction,
            cellName,
        );
        if (response && response.notebook) {
            const newCells = mapApiResponseToCells(response.notebook.cells);
            setCells(newCells);
            if (response.notebook.requirements) {
                setRequirements(
                    response.notebook.requirements &&
                        typeof response.notebook.requirements === "object"
                        ? response.notebook.requirements.String
                        : response.notebook.requirements &&
                            response.notebook.requirements.Valid
                          ? response.notebook.requirements.String
                          : "",
                );
            }
            addMessage({
                type: "bot",
                message:
                    typeof response.message === "string"
                        ? response.message
                        : "Notebook modified successfully.",
                changes: response.changes_made,
            });
        }
    }

    function handleSave() {
        triggerSave();
    }

    function clearOutput(cellId) {
        const newCells = cells.map((c) => {
            if (c.id === cellId) {
                return { ...c, outputs: [] };
            }
            return c;
        });
        setCells(newCells);
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
        messages,
        addMessage,
        clearOutput,
        llmLoading,
        hasUnreadMessages,
        setHasUnreadMessages,
        isSaving,
        lastSaveTime,
        requirements,
        notebookName,
    };
}
