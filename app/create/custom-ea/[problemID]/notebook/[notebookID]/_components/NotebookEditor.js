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
    const [cells, setCells] = useState(null); // null = loading
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { connected, sendExecute } = useKernelSocket(session);

    useEffect(() => {
        let mounted = true;
        const controller = new AbortController();

        const fetchNotebook = async () => {
            if (!notebookId) return;

            setLoading(true);
            setError(null);

            try {
                const base =
                    env("NEXT_PUBLIC_BACKEND_BASE_URL") ??
                    "http://localhost:8080";
                const res = await fetch(
                    `${base}/api/v1/notebooks/${notebookId}`,
                    {
                        method: "GET",
                        credentials: "include",
                        signal: controller.signal,
                    },
                );

                if (res.status === 401) {
                    window.location.href = "/auth";
                    return;
                }
                if (!res.ok) {
                    throw new Error(
                        `Failed to fetch notebook: ${res.statusText}`,
                    );
                }

                const notebookData = await res.json();
                const currentCells = notebookData?.data?.cells ?? [];

                // If notebook is empty, generate from LLM
                if (currentCells.length === 0) {
                    if (!problemId) {
                        setError(
                            "Cannot generate notebook: Missing Problem ID.",
                        );
                        setLoading(false);
                        return;
                    }
                    await generateAndPopulateNotebook(controller.signal);
                } else {
                    setCells(
                        currentCells.map((c) => ({ ...c, id: uid(c.type) })),
                    );
                }
            } catch (err) {
                if (controller.signal.aborted) return;
                console.error(err);
                setError(err.message || "An error occurred.");
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchNotebook();

        return () => {
            mounted = false;
            controller.abort();
        };
    }, [notebookId, problemId]);

    const generateAndPopulateNotebook = async (signal) => {
        try {
            // 1. Fetch problem statement
            const base =
                env("NEXT_PUBLIC_BACKEND_BASE_URL") ?? "http://localhost:8080";
            const problemRes = await fetch(
                `${base}/api/v1/problems/${problemId}`,
                {
                    credentials: "include",
                    signal,
                },
            );
            if (!problemRes.ok) throw new Error("Failed to fetch problem.");
            const problemData = await problemRes.json();
            const problemDetails = problemData?.data ?? problemData;

            // 2. Clean and prepare payload for LLM
            let payload =
                problemDetails &&
                (problemDetails.description_json || problemDetails);
            const decoded = tryDecodePayload(payload);
            const cleanedProblem = removeEmpty(decoded);
            payload = {
                ...cleanedProblem,
                session_id: notebookId,
            };

            // 3. Generate notebook from LLM
            const llmRes = await fetch(`${base}/api/v1/llm/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
                signal,
            });
            if (!llmRes.ok)
                throw new Error("Failed to generate notebook from LLM.");

            const llmNotebook = await llmRes.json();
            const newCells =
                llmNotebook?.notebook?.cells.map((c) => ({
                    ...c,
                    id: uid(c.cell_type),
                    type: c.cell_type,
                    content: c.source,
                    outputs: [],
                })) ?? [];

            if (newCells.length > 0) {
                // 4. Save the new cells to the backend
                await saveNotebook(newCells);
                setCells(newCells);
            } else {
                // Fallback to a default empty notebook if LLM returns nothing
                setCells([
                    {
                        id: uid("md"),
                        type: "markdown",
                        content: "# New Notebook",
                    },
                ]);
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
            // Provide a default empty state on error
            setCells([
                { id: uid("md"), type: "markdown", content: "# Error" },
                {
                    id: uid("code"),
                    type: "code",
                    content:
                        `# Failed to generate notebook\n# ${err.message}`.trim(),
                    outputs: [],
                },
            ]);
        }
    };

    const saveNotebook = async (currentCells) => {
        const base =
            env("NEXT_PUBLIC_BACKEND_BASE_URL") ?? "http://localhost:8080";
        try {
            await fetch(`${base}/api/v1/notebooks/${notebookId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    cells: currentCells.map(
                        ({ id, ...rest }) => rest, // strip client-side id
                    ),
                }),
            });
        } catch (err) {
            console.error("Failed to save notebook:", err);
            // Optionally, inform the user about the save failure
            alert("Warning: Failed to save notebook state to the server.");
        }
    };

    function addCell(type, content) {
        const newCell = {
            id: uid(type),
            type,
            content,
            outputs: type === "code" ? [] : undefined,
        };
        setCells((s) => [...(s || []), newCell]);
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
        if (!session?.current_kernel_id || !connected || !sendExecute) {
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
            return;
        }

        try {
            const handleOutputUpdate = (outputs, execution_count) => {
                updateCell({ ...cell, outputs, execution_count });
            };

            const result = await sendExecute(cell.content, handleOutputUpdate);
            updateCell({ ...cell, ...result });
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
                onAddCode={() => addCell("code", "")}
                onAddMarkdown={() => addCell("markdown", "New paragraph")}
                onSave={handleSave}
            />

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
                                onRemove={() => removeCell(cell.id)}
                            />
                        )}
                    </div>
                ))}
            </div>
        </NotebookLayout>
    );
}
