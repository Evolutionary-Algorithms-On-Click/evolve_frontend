"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import OutputArea from "./OutputArea";

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
        // monaco passes value directly
        setValue(v);
        onChange && onChange({ ...cell, content: v });
    }

    async function handleRun() {
        if (onRun) {
            await onRun({ ...cell, content: value });
        }
    }

    const execCount = useMemo(
        () => cell.execution_count || " ",
        [cell.execution_count],
    );

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
                <div className="flex items-start gap-4 p-3 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleRun}
                            disabled={!!cell._isRunning}
                            aria-label={
                                cell._isRunning ? "Running" : "Run cell"
                            }
                            className={
                                "w-9 h-9 flex items-center justify-center rounded-full text-white shadow-sm " +
                                (cell._isRunning
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700")
                            }
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-white"
                            >
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                        </button>

                        <div className="text-xs text-gray-700 font-semibold px-2 py-1 bg-gray-100 rounded">
                            In [{execCount}]
                        </div>
                    </div>

                    <div className="flex-1 text-sm text-gray-700">
                        {cell.metadata?.title || "Code cell"}
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={onMoveUp}
                            title="Move cell up"
                            className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded text-slate-600 border border-gray-100"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 19V6" />
                                <path d="M5 12l7-7 7 7" />
                            </svg>
                        </button>

                        <button
                            onClick={onMoveDown}
                            title="Move cell down"
                            className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded text-slate-600 border border-gray-100"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 5v13" />
                                <path d="M19 12l-7 7-7-7" />
                            </svg>
                        </button>

                        <button
                            onClick={onRemove}
                            className="p-1.5 bg-gray-50 hover:bg-red-50 rounded text-gray-600 hover:text-red-600 border border-gray-100"
                            aria-label="Remove cell"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="p-2">
                    <div
                        className="rounded overflow-hidden shadow-sm"
                        style={{ width: "100%" }}
                    >
                        <Editor
                            key={cell.id}
                            // height is controlled via state so editor expands with content
                            height={
                                String(
                                    Math.max(120, Math.min(2000, editorHeight)),
                                ) + "px"
                            }
                            defaultLanguage="python"
                            language="python"
                            theme="vs"
                            value={value}
                            onChange={handleChange}
                            onMount={(editor) => {
                                // Guarded mount logic: Monaco may call events after dispose/HMR.
                                const editorDisposed = { value: false };
                                let disposable = null;
                                try {
                                    editor.updateOptions({
                                        minimap: { enabled: false },
                                        scrollBeyondLastLine: false,
                                        wordWrap: "off",
                                    });

                                    const updateHeight = () => {
                                        // Skip if editor disposed
                                        if (editorDisposed.value) return;
                                        try {
                                            // ensure editor still has DOM and APIs
                                            if (!editor || !editor.getDomNode)
                                                return;
                                            const dom = editor.getDomNode();
                                            if (!dom) return;

                                            const contentHeight = Math.ceil(
                                                editor.getContentHeight(),
                                            );
                                            const h = Math.max(
                                                80,
                                                Math.min(2000, contentHeight),
                                            );
                                            // update local state so the Editor receives new height
                                            try {
                                                setEditorHeight(h);
                                            } catch (e) {
                                                // ignore
                                            }
                                            try {
                                                const layoutInfo =
                                                    editor.getLayoutInfo &&
                                                    editor.getLayoutInfo();
                                                const width = layoutInfo
                                                    ? layoutInfo.width
                                                    : dom.clientWidth || 800;
                                                editor.layout({
                                                    width,
                                                    height: h,
                                                });
                                            } catch (e) {
                                                // ignore layout errors
                                            }
                                        } catch (e) {
                                            // swallow errors that occur if editor was disposed mid-update
                                        }
                                    };

                                    updateHeight();
                                    disposable =
                                        editor.onDidContentSizeChange(
                                            updateHeight,
                                        );
                                    // cleanup when editor disposed
                                    editor.onDidDispose(() => {
                                        try {
                                            editorDisposed.value = true;
                                            disposable && disposable.dispose();
                                        } catch (e) {
                                            // ignore
                                        }
                                    });
                                } catch (e) {
                                    // ignore mount issues
                                }
                            }}
                            options={{
                                fontSize: 13,
                                fontFamily:
                                    'ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Courier New", monospace',
                                lineNumbers: "on",
                                automaticLayout: true,
                                glyphMargin: true,
                                folding: false,
                            }}
                        />
                    </div>
                </div>
            </div>

            <OutputArea outputs={cell.outputs || []} />
        </div>
    );
}
