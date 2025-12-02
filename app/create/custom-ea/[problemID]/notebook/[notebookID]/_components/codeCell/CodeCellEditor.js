"use client";

import React from "react";
import Editor from "@monaco-editor/react";

export default function CodeCellEditor({
    cell,
    value,
    onChange,
    editorHeight,
    setEditorHeight,
}) {
    return (
        <div className="p-2">
            <div
                className="rounded overflow-hidden shadow-sm"
                style={{ width: "100%" }}
            >
                <Editor
                    key={cell.id}
                    height={
                        String(Math.max(120, Math.min(2000, editorHeight))) +
                        "px"
                    }
                    defaultLanguage="python"
                    language="python"
                    theme="vs"
                    value={value}
                    onChange={onChange}
                    onMount={(editor) => {
                        const editorDisposed = { value: false };
                        let disposable = null;
                        try {
                            editor.updateOptions({
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                wordWrap: "off",
                            });

                            const updateHeight = () => {
                                if (editorDisposed.value) return;
                                try {
                                    if (!editor || !editor.getDomNode) return;
                                    const dom = editor.getDomNode();
                                    if (!dom) return;

                                    const contentHeight = Math.ceil(
                                        editor.getContentHeight(),
                                    );
                                    const h = Math.max(
                                        80,
                                        Math.min(2000, contentHeight),
                                    );
                                    try {
                                        setEditorHeight(h);
                                    } catch (e) {}
                                    try {
                                        const layoutInfo =
                                            editor.getLayoutInfo &&
                                            editor.getLayoutInfo();
                                        const width = layoutInfo
                                            ? layoutInfo.width
                                            : dom.clientWidth || 800;
                                        editor.layout({ width, height: h });
                                    } catch (e) {}
                                } catch (e) {}
                            };

                            updateHeight();
                            disposable =
                                editor.onDidContentSizeChange(updateHeight);
                            editor.onDidDispose(() => {
                                try {
                                    editorDisposed.value = true;
                                    disposable && disposable.dispose();
                                } catch (e) {}
                            });
                        } catch (e) {}
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
    );
}
