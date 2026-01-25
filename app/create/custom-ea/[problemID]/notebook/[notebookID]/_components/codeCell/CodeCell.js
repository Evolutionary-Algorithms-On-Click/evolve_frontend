"use client";

import React, { useState, useEffect, useRef } from "react";
import OutputArea from "./OutputArea";
import CodeCellEditor from "./CodeCellEditor";
import CodeCellControls from "./CodeCellControls";
import { Plus, X } from "lucide-react";
import AddCellMenu from "../toolbars/AddCellMenu";

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
    addCodeCell,
    addMarkdownCell,
    llmLoading,
    readOnly = false,
}) {
    const [value, setValue] = useState(cell.source || "");
    const [editorHeight, setEditorHeight] = useState(cell._editorHeight || 200);
    const [showAddMenu, setShowAddMenu] = useState(null); // null, 'top', or 'bottom'

    // useEffect(() => {
    //     setValue(cell.source || "");
    // }, [cell.source]);

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
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                {showAddMenu === 'top' ? (
                    <AddCellMenu
                        onAddCode={() => { addCodeCell(cell.idx); setShowAddMenu(null); }}
                        onAddMarkdown={() => { addMarkdownCell(cell.idx); setShowAddMenu(null); }}
                        onClose={() => setShowAddMenu(null)}
                    />
                ) : (
                    <button
                        onClick={() => setShowAddMenu('top')}
                        className="p-1 rounded-full bg-gray-100 border border-gray-300 text-gray-600 hover:bg-teal-100 hover:text-teal-600"
                        title="Add Cell Above"
                    >
                        <Plus size={16} />
                    </button>
                )}
            </div>
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
                    onRemove={onRemove}
                    onMoveUp={onMoveUp}
                    onMoveDown={onMoveDown}
                    onFix={onFix}
                    onModify={onModify}
                    llmLoading={llmLoading}
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
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                {showAddMenu === 'bottom' ? (
                    <AddCellMenu
                        onAddCode={() => { addCodeCell(cell.idx + 1); setShowAddMenu(null); }}
                        onAddMarkdown={() => { addMarkdownCell(cell.idx + 1); setShowAddMenu(null); }}
                        onClose={() => setShowAddMenu(null)}
                    />
                ) : (
                    <button
                        onClick={() => setShowAddMenu('bottom')}
                        className="p-1 rounded-full bg-gray-100 border border-gray-300 text-gray-600 hover:bg-teal-100 hover:text-teal-600"
                        title="Add Cell Below"
                    >
                        <Plus size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}
