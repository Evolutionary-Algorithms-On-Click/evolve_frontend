"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

const NotebookContext = createContext(null);

export function NotebookProvider({ children }) {
    const [activeCellId, setActiveCellId] = useState(null);
    const [reorderMode, setReorderMode] = useState(false);
    const [tone, setTone] = useState("soft"); // soft | neutral | vivid

    const setActive = useCallback((id) => {
        setActiveCellId(id);
    }, []);

    const toggleReorder = useCallback(() => {
        setReorderMode((v) => !v);
    }, []);

    const toggleTone = useCallback(() => {
        setTone((t) =>
            t === "soft" ? "vivid" : t === "vivid" ? "neutral" : "soft",
        );
    }, []);

    return (
        <NotebookContext.Provider
            value={{
                activeCellId,
                setActive,
                reorderMode,
                toggleReorder,
                tone,
                toggleTone,
            }}
        >
            {children}
        </NotebookContext.Provider>
    );
}

export function useNotebook() {
    const ctx = useContext(NotebookContext);
    if (!ctx) {
        throw new Error("useNotebook must be used within NotebookProvider");
    }
    return ctx;
}

export default NotebookContext;
