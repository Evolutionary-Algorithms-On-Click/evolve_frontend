"use client";

import React, { useState } from "react";
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
    readOnly = false,
}) {
    const [value, setValue] = useState(cell.content || "");
    const [editorHeight, setEditorHeight] = useState(cell._editorHeight || 200);

    function handleChange(v) {
        setValue(v);
        onChange && onChange({ ...cell, content: v });
    }

    async function handleRun(cellOverride) {
        const payload = cellOverride
            ? { ...cellOverride, content: value }
            : { ...cell, content: value };
        if (onRun) await onRun(payload);
    }

    return (
        <div className="mb-4 group relative">
            <div className="rounded-lg border border-gray-100 overflow-hidden relative bg-white">
                {cell._isRunning && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-t-transparent border-blue-600 rounded-full animate-spin" />
                            <div className="text-sm text-blue-700 font-medium">
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
                />

                <CodeCellEditor
                    cell={cell}
                    value={value}
                    onChange={handleChange}
                    editorHeight={editorHeight}
                    setEditorHeight={setEditorHeight}
                />
            </div>

            <OutputArea outputs={cell.outputs || []} />
        </div>
    );
}
