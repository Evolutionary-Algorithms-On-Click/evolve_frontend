"use client";

import React, { useState, useEffect } from "react";
import NotebookLayout from "./NotebookLayout";
import Toolbar from "./Toolbar";
import KernelControls from "./KernelControls";
import CodeCell from "./CodeCell";
import MarkdownCell from "./MarkdownCell";
import { env } from "next-runtime-env";
import useKernelSocket from "./useKernelSocket";
import Loader from "@/app/_components/Loader";
import { tryDecodePayload } from "../../_components/PSDetails";

function uid(prefix = "id") {
    return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

// Helper to remove empty values from an object
const removeEmpty = (obj) => {
    if (obj === null || obj === undefined) return null;
    if (Array.isArray(obj)) {
        return obj.map(removeEmpty).filter((item) => item !== null);
    }
    if (typeof obj === "object") {
        return Object.entries(obj)
            .map(([key, value]) => [key, removeEmpty(value)])
            .filter(
                ([, value]) =>
                    value !== null && value !== "" && value !== undefined,
            )
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    }
    return obj;
};

// Main component
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
    const startSessionRef = React.useRef(null);

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
        setCells((s) =>
            (s || []).map((c) => (c.id === updated.id ? updated : c)),
        );
    }

    function removeCell(id) {
        setCells((s) => (s || []).filter((c) => c.id !== id));
    }

    async function runCell(cell) {
        // auto-start session if none
        if (!session && startSessionRef.current) {
            const s = await startSessionRef.current();
            if (s) setSession(s);
        }

        if (session && session.current_kernel_id && connected && sendExecute) {
            try {
                // live update callback
                const handleOutputUpdate = (outputs, execution_count) => {
                    // use latest cell from state by id if you want to be super correct,
                    // but for now this is fine:
                    updateCell({
                        ...cell,
                        outputs,
                        execution_count,
                    });
                };

                const result = await sendExecute(
                    cell.content,
                    handleOutputUpdate,
                );
                const { outputs, execution_count } = result;

                // final state (in case something changed at the very end)
                updateCell({
                    ...cell,
                    outputs,
                    execution_count,
                });
                return;
            } catch (e) {
                console.error("WS execute failed", e);
                updateCell({
                    ...cell,
                    outputs: [
                        {
                            type: "error",
                            ename: "ClientError",
                            evalue: String(e),
                            traceback: [],
                        },
                    ],
                });
                return;
            }
        }

        updateCell({
            ...cell,
            outputs: [
                {
                    type: "error",
                    ename: "ConnectionError",
                    evalue: "WebSocket not connected or session not started",
                    traceback: [],
                },
            ],
        });
    }

    async function runAll() {
        for (const c of cells) {
            if (c.type === "code") {
                // run sequentially so outputs make sense in order
                // find latest cell from state by id
                const stateCell = cells.find((x) => x.id === c.id) || c;
                // await runCell will handle session auto-start
                // eslint-disable-next-line no-await-in-loop
                await runCell(stateCell);
            }
        }
    }

    function handleSave() {
        if (!cells) {
            alert("No notebook content to save.");
            return;
        }
        saveNotebook(cells);
        alert("Notebook saved!");
    }

    if (loading) {
        return <Loader message="Loading notebook..." />;
    }

    if (error) {
        return (
            <div className="p-8 text-red-500">
                <h2 className="text-xl font-bold mb-2">Error</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <NotebookLayout>
            <div className="mb-4">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <div className="text-lg font-semibold text-gray-800">
                            {cells[0]?.type === "markdown" && cells[0].content
                                ? cells[0].content
                                      .split("\n")[0]
                                      .replace(/^#+\s*/, "")
                                : `Notebook ${notebookId ? "" : ""}`}
                        </div>
                        <div className="text-xs text-gray-500">
                            {session
                                ? `Kernel: ${session.current_kernel_id}`
                                : "No session"}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <KernelControls
                            notebookId={notebookId}
                            language="python3"
                            onSessionCreated={setSession}
                            onStartAvailable={(fn) =>
                                (startSessionRef.current = fn)
                            }
                        />
                    </div>
                </div>

                <Toolbar
                    onAddCode={addCodeCell}
                    onAddMarkdown={addMarkdownCell}
                    onSave={handleSave}
                    onRunAll={runAll}
                />
            </div>

            <div>
                {(cells || []).map((cell) => (
                    <div key={cell.id} className="mb-6">
                        {cell.type === "code" ? (
                            <CodeCell
                                cell={cell}
                                onChange={updateCell}
                                onRun={runCell}
                                onRemove={() => removeCell(cell.id)}
                            />
                        ) : (
                            <MarkdownCell
                                cell={cell}
                                onChange={updateCell}
                                onRemove={removeCell}
                            />
                        )}
                    </div>
                ))}
            </div>
        </NotebookLayout>
    );
}
