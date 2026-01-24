"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { mapToApiFormat } from '../utils/notebook-mapper';
import isEqual from 'lodash.isequal'; // Using a library for deep equality check is more robust

const AUTOSAVE_INTERVAL = 30 * 1000; // 30 seconds

export default function useAutosave(notebookId, cells, deletedCellIds, clearDeletedCellIds, requirements) {
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaveTime, setLastSaveTime] = useState(null);
    const [isDirty, setIsDirty] = useState(false);
    const [cleanCells, setCleanCells] = useState(null);

    // Set initial clean state when cells are first loaded
    useEffect(() => {
        if (cells && cleanCells === null) {
            setCleanCells(cells);
        }
    }, [cells, cleanCells]);

    // Effect to detect if the notebook is "dirty"
    useEffect(() => {
        if (cleanCells && cells) {
            // Check if order has changed
            const currentOrder = cells.map(c => c.id);
            const cleanOrder = cleanCells.map(c => c.id);
            if (!isEqual(currentOrder, cleanOrder)) {
                setIsDirty(true);
                return;
            }

            // Check if content has changed or cells are added/deleted
            if (cells.length !== cleanCells.length) {
                setIsDirty(true);
                return;
            }

            const cleanCellMap = new Map(cleanCells.map(c => [c.id, c]));
            for (const cell of cells) {
                const cleanCell = cleanCellMap.get(cell.id);
                if (
                    !cleanCell ||
                    cell.source !== cleanCell.source ||
                    cell.execution_count !== cleanCell.execution_count
                ) {
                    setIsDirty(true);
                    return;
                }
            }
        }
         if (deletedCellIds.size > 0) {
            setIsDirty(true);
        }

    }, [cells, cleanCells, deletedCellIds]);

    const autosave = useCallback(async () => {
        if (!isDirty || isSaving || !cells || !notebookId) {
            return;
        }

        setIsSaving(true);
        console.log("Autosaving started...");

        const cleanCellMap = new Map(cleanCells.map(c => [c.id, c]));
        const currentOrder = cells.map(c => c.id);
        const cleanOrder = cleanCells.map(c => c.id);

        // 1. Find updated order
        const updated_order = !isEqual(currentOrder, cleanOrder) ? currentOrder : undefined;

        // 2. Find cells to delete
        const cells_to_delete = deletedCellIds.size > 0 ? Array.from(deletedCellIds) : undefined;
        
        // 3. Find cells to upsert (new or modified)
        const cells_to_upsert_map = {};
        for (const cell of cells) {
            const cleanCell = cleanCellMap.get(cell.id);
            // If cell is new or source has changed, add to upsert list
            if (
                !cleanCell ||
                cell.source !== cleanCell.source ||
                cell.execution_count !== cleanCell.execution_count
            ) {
                 cells_to_upsert_map[cell.id] = mapToApiFormat({ cells: [cell] }).cells[0];
            }
        }

        const payload = {
            updated_order,
            cells_to_delete,
            cells_to_upsert: Object.keys(cells_to_upsert_map).length > 0 ? cells_to_upsert_map : undefined,
            requirements: requirements || undefined, // Add requirements if present
        };

        // Only save if there's something to save
        if (!payload.updated_order && !payload.cells_to_delete && !payload.cells_to_upsert) {
            setIsSaving(false);
            // It might be dirty due to other reasons, reset it if nothing to send
            if (isDirty) {
                setCleanCells(cells);
                clearDeletedCellIds();
                setIsDirty(false);
            }
            console.log("Autosave: No changes to save.");
            return;
        }
        
        try {
            const base = process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? "http://localhost:8080";
            const res = await fetch(`${base}/api/v1/notebooks/${notebookId}/cells`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error(`Failed to save notebook: ${res.statusText}`);
            }

            // On successful save, update the clean state
            setCleanCells(cells);
            clearDeletedCellIds();
            setIsDirty(false);
            setLastSaveTime(new Date());
            console.log("Autosave successful.", payload);

        } catch (error) {
            console.error("Autosave failed:", error);
            // Optionally, handle the error in the UI
        } finally {
            setIsSaving(false);
        }
    }, [isDirty, isSaving, cells, cleanCells, deletedCellIds, notebookId, clearDeletedCellIds, requirements]);

    // Timer effect
    useEffect(() => {
        const timerId = setInterval(autosave, AUTOSAVE_INTERVAL);
        return () => clearInterval(timerId);
    }, [autosave]);

    return { isSaving, lastSaveTime, triggerSave: autosave };
}
