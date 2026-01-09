"use client";

import React from "react";
import NotebookLayout from "./NotebookLayout";
import Toolbar from "./toolbars/Toolbar";
import { NotebookProvider } from "./notebookContext";
import KernelControls from "./KernelControls";
import CodeCell from "./codeCell/CodeCell";
import MarkdownCell from "./MarkdownCell";
import Loader from "@/app/_components/Loader";
import useNotebook from "./useNotebook";
import ChatWindow from "./ChatWindow";
import useNotebookKeybindings from "./hooks/useNotebookKeybindings";

// Main component
export default function NotebookEditor({ notebookId, problemId }) {
    const {
        cells,
        loading,
        error,
        addCodeCell,
        addMarkdownCell,
        updateCell,
        removeCell,
        moveCellUp,
        moveCellDown,
        runCell,
        runAll,
        handleSave,
        session,
        setSession,
        startSessionRef,
        fixCell,
        modifyCell,
    } = useNotebook(notebookId, problemId);

    useNotebookKeybindings();

    if (loading) return <Loader message="Loading notebook..." />;

    if (error) {
        return (
            <div className="p-8 text-red-500">
                <h2 className="text-xl font-bold mb-2">Error</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <NotebookProvider>
            <NotebookLayout>
                <div className="mb-6">
                    <div className="mb-2">
                        <div className="flex items-center justify-between gap-4">
                            <div className="min-w-0">
                                <div
                                    className="text-2xl font-extrabold text-gray-900 truncate max-w-[60vw]"
                                    title={
                                        cells &&
                                        cells[0]?.type === "markdown" &&
                                        cells[0].content
                                            ? cells[0].content
                                                  .split("\n")[0]
                                                  .replace(/^#+\s*/, "")
                                            : `Notebook ${notebookId || ""}`
                                    }
                                >
                                    {cells &&
                                    cells[0]?.type === "markdown" &&
                                    cells[0].content
                                        ? cells[0].content
                                              .split("\n")[0]
                                              .replace(/^#+\s*/, "")
                                        : `Notebook ${notebookId || ""}`}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                    &nbsp;
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

                        <div className="mt-3 flex items-center justify-between">
                            <div>
                                <div className="hidden sm:block">
                                    <Toolbar
                                        mode="add"
                                        onAddCode={addCodeCell}
                                        onAddMarkdown={addMarkdownCell}
                                    />
                                </div>
                                <div className="sm:hidden">
                                    <Toolbar
                                        mode="add"
                                        onAddCode={addCodeCell}
                                        onAddMarkdown={addMarkdownCell}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Toolbar
                                    mode="actions"
                                    onRunAll={runAll}
                                    onSave={handleSave}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    {(cells || []).map((cell) => (
                        <div key={`${cell.id}-${cell.idx}`} className="mb-6" data-cell-id={cell.id} tabIndex={-1}>
                            {cell.type === "code" ? (
                                <CodeCell
                                    cell={cell}
                                    onChange={updateCell}
                                    onRun={runCell}
                                    onRemove={() => removeCell(cell.id)}
                                    onMoveUp={() => moveCellUp(cell.id)}
                                    onMoveDown={() => moveCellDown(cell.id)}
                                    onFix={(cell) => {
                                        const output = cell.outputs.find(o => o.output_type === "error");
                                        if (output) {
                                            fixCell(cell, output.traceback)
                                        } else {
                                            alert("No error found to fix.")
                                        }
                                    }}
                                    onModify={modifyCell}
                                />
                            ) : (
                                <MarkdownCell
                                    cell={cell}
                                    onChange={updateCell}
                                    onRemove={() => removeCell(cell.id)}
                                    onMoveUp={() => moveCellUp(cell.id)}
                                    onMoveDown={() => moveCellDown(cell.id)}
                                />
                            )}
                        </div>
                    ))}
                </div>
                <ChatWindow onModify={modifyCell} />
            </NotebookLayout>
        </NotebookProvider>
    );
}

