"use client";

import React, { useState, useEffect } from "react";
import OutputArea from "./OutputArea";
import CodeCellEditor from "./CodeCellEditor";
import CodeCellControls from "./CodeCellControls";

export default function CodeCell({
    cell,
    onChange,
    onRun,
    onRemove,
    onMoveUp,
    onMoveDown,
    onFix,
    onModify,
    onClear,
    readOnly = false,
}) {
    const [value, setValue] = useState(cell.source || "");
    const [editorHeight, setEditorHeight] = useState(cell._editorHeight || 200);

    useEffect(() => {
        setValue(cell.source || "");
    }, [cell.source]);

    useEffect(() => {
        if (cell.message) {
            const timer = setTimeout(() => {
                onChange({ ...cell, message: null });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [cell.message]);

    function handleChange(v) {
        setValue(v);
        onChange && onChange({ ...cell, source: v });
    }

    async function handleRun(cellOverride) {
        const payload = cellOverride
            ? { ...cellOverride, source: value }
            : { ...cell, source: value };
        if (onRun) await onRun(payload);
    }

    return (
        <div className="mb-4 group relative">
            {cell.message && (
                <div className="absolute top-0 left-0 w-full bg-teal-100 text-teal-800 p-2 text-sm z-20">
                    {cell.message}
                </div>
            )}
            <div className="rounded-xl border border-gray-200 overflow-hidden relative bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                {cell._isRunning && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-t-transparent border-teal-600 rounded-full animate-spin" />
                            <div className="text-sm text-teal-700 font-medium">
                                Running…
                            </div>
                        </div>
                    </div>
                )}

                <CodeCellControls
                    cell={cell}
                    onRun={handleRun}
                    onMoveUp={onMoveUp}
                    onMoveDown={onMoveDown}
                    onRemove={onRemove}
                    onFix={onFix}
                    onModify={onModify}
                />

                <CodeCellEditor
                    cell={cell}
                    value={value}
                    onChange={handleChange}
                    editorHeight={editorHeight}
                    setEditorHeight={setEditorHeight}
                />
            </div>

            <OutputArea outputs={cell.outputs || []} onClear={onClear} />
        </div>
    );
}
