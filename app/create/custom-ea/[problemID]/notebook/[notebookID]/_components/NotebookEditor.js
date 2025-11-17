"use client";

import React, { useState } from "react";
import NotebookLayout from "./NotebookLayout";
import Toolbar from "./Toolbar";
import KernelControls from "./KernelControls";
import CodeCell from "./CodeCell";
import MarkdownCell from "./MarkdownCell";
import { env } from "next-runtime-env";
import useKernelSocket from "./useKernelSocket";

function uid(prefix = "id") {
    return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export default function NotebookEditor({ notebookId, problemId }) {
    const [cells, setCells] = useState([
        { id: uid("md"), type: "markdown", content: "# New Notebook" },
        {
            id: uid("code"),
            type: "code",
            content: "print('Hello from notebook')",
            outputs: [],
        },
    ]);
    const [session, setSession] = useState(null);

    function addCodeCell() {
        setCells((s) => [
            ...s,
            { id: uid("code"), type: "code", content: "", outputs: [] },
        ]);
    }

    function addMarkdownCell() {
        setCells((s) => [
            ...s,
            { id: uid("md"), type: "markdown", content: "New paragraph" },
        ]);
    }

    function updateCell(updated) {
        setCells((s) => s.map((c) => (c.id === updated.id ? updated : c)));
    }

    function removeCell(id) {
        setCells((s) => s.filter((c) => c.id !== id));
    }

    const { connected, sendExecute } = useKernelSocket(session);

    async function runCell(cell) {
        // Only use websocket execution — no HTTP or simulated fallbacks.
        if (session && session.current_kernel_id && connected && sendExecute) {
            try {
                const result = await sendExecute(cell.content);
                // normalize outputs to strings for display
                const outputs = (result.outputs || []).map((o) => {
                    try {
                        // prefer o.data, then o (raw obj)
                        const payload = o.data ?? o;
                        return typeof payload === "string"
                            ? payload
                            : JSON.stringify(payload);
                    } catch (e) {
                        return String(o);
                    }
                });
                updateCell({ ...cell, outputs });
                return;
            } catch (e) {
                console.error("WS execute failed", e);
                updateCell({
                    ...cell,
                    outputs: [`WebSocket execution failed: ${String(e)}`],
                });
                return;
            }
        }

        // If websocket not connected or session missing, produce an explicit error output
        updateCell({
            ...cell,
            outputs: ["Error: WebSocket not connected or session not started"],
        });
    }

    function handleSave() {
        // Save notebook state somewhere. This is a placeholder.
        console.log("Save notebook", { notebookId, problemId, cells });
        alert("Notebook saved (simulated)");
    }

    return (
        <NotebookLayout>
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-700">
                        Problem: {problemId || "—"}
                    </div>
                    <div className="text-sm text-gray-700">
                        Notebook: {notebookId || "—"}
                    </div>
                </div>
                <KernelControls
                    notebookId={notebookId}
                    language="python3"
                    onSessionCreated={setSession}
                />
            </div>

            <Toolbar
                onAddCode={addCodeCell}
                onAddMarkdown={addMarkdownCell}
                onSave={handleSave}
            />

            <div>
                {cells.map((cell) => (
                    <div key={cell.id} className="mb-6">
                        {cell.type === "code" ? (
                            <CodeCell
                                cell={cell}
                                onChange={updateCell}
                                onRun={runCell}
                            />
                        ) : (
                            <MarkdownCell cell={cell} />
                        )}
                    </div>
                ))}
            </div>
        </NotebookLayout>
    );
}
