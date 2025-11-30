"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import OutputArea from "./OutputArea";

export default function CodeCell({ cell, onChange, onRun, readOnly = false }) {
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
        <div className="mb-4">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="flex items-start gap-4 p-3 border-b border-gray-100 bg-white">
                    <div className="flex items-center gap-2">
                        <div className="text-xs text-gray-700 font-semibold px-2 py-1 bg-gray-100 rounded">
                            In [{execCount}]
                        </div>
                    </div>
                    <div className="flex-1 text-sm text-gray-700">
                        {cell.metadata?.title || "Code cell"}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleRun}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                            title="Run cell"
                        >
                            Run
                        </button>
                    </div>
                </div>

                <div className="p-2 bg-white">
                    <div
                        className="rounded overflow-hidden"
                        style={{ width: "100%" }}
                    >
                        <Editor
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
                                try {
                                    editor.updateOptions({
                                        minimap: { enabled: false },
                                        scrollBeyondLastLine: false,
                                        wordWrap: "off",
                                    });

                                    const updateHeight = () => {
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
                                        } catch (e) {}
                                        try {
                                            editor.layout({
                                                width: editor.getLayoutInfo()
                                                    .width,
                                                height: h,
                                            });
                                        } catch (e) {
                                            // ignore layout errors
                                        }
                                    };

                                    updateHeight();
                                    const disposable =
                                        editor.onDidContentSizeChange(
                                            updateHeight,
                                        );
                                    // cleanup when editor disposed
                                    editor.onDidDispose(() => {
                                        try {
                                            disposable && disposable.dispose();
                                        } catch (e) {}
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
