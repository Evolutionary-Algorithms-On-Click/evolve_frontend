"use client";

import NotebookLayout from "./NotebookLayout";
import Toolbar from "./toolbars/Toolbar";
import { NotebookProvider } from "./notebookContext";
import KernelControls from "./KernelControls";
import CodeCell from "./codeCell/CodeCell";
import MarkdownCell from "./MarkdownCell";
import NotebookLoadingScreen from "./NotebookLoadingScreen";
import useNotebook from "./hooks/useNotebook";
import useNotebookExport from "./hooks/useNotebookExport";
import ChatWindow from "./ChatWindow";
import useNotebookKeybindings from "./hooks/useNotebookKeybindings";
import LLMInfoPopup from "./LLMInfoPopup";
import { Info, Save } from "lucide-react";
import React, { useState } from "react";

const SaveStatus = ({ isSaving, lastSaveTime }) => {
    if (isSaving) {
        return (
            <div className="flex items-center gap-2 text-sm text-gray-500 animate-pulse">
                <Save size={16} />
                <span>Saving...</span>
            </div>
        );
    }
    if (lastSaveTime) {
        return (
            <div className="text-sm text-gray-500">
                Last saved: {lastSaveTime.toLocaleTimeString()}
            </div>
        );
    }
    return <div className="text-sm text-gray-500">All changes saved</div>;
};

// Main component
export default function NotebookEditor({ notebookId, problemId }) {
    useEffect(() => {
        if (!localStorage.getItem("id")) {
            window.location.href = "/auth";
            return;
        }
    }, []);
    
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
        messages,
        addMessage,
        clearOutput,
        llmLoading,
        hasUnreadMessages,
        setHasUnreadMessages,
        isSaving,
        lastSaveTime,
        requirements,
    } = useNotebook(notebookId, problemId);

    const { exportToIpynb, exportToHtml, printToPdf } = useNotebookExport(
        cells,
        notebookId,
    );

    const [showLLMInfo, setShowLLMInfo] = useState(false);

    useNotebookKeybindings();

    if (loading) return <NotebookLoadingScreen />;

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
                                        cells[0]?.cell_type === "markdown" &&
                                        cells[0].source
                                            ? cells[0].source
                                                  .split("\n")[0]
                                                  .replace(/^#+\s*/, "")
                                            : `Notebook ${notebookId || ""}`
                                    }
                                >
                                    {cells &&
                                    cells[0]?.cell_type === "markdown" &&
                                    cells[0].source
                                        ? cells[0].source
                                              .split("\n")[0]
                                              .replace(/^#+\s*/, "")
                                        : `Notebook ${notebookId || ""}`}
                                </div>
                                <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                    <SaveStatus
                                        isSaving={isSaving}
                                        lastSaveTime={lastSaveTime}
                                    />
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
                                    onExportIpynb={exportToIpynb}
                                    onExportHtml={exportToHtml}
                                    onPrintPdf={printToPdf}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="printable-area">
                    {(cells || []).map((cell) => (
                        <div
                            key={`${cell.id}-${cell.idx}`}
                            className="mb-6 cell"
                            data-cell-id={cell.id}
                            tabIndex={-1}
                        >
                            {cell.cell_type === "code" ? (
                                <CodeCell
                                    cell={cell}
                                    onChange={updateCell}
                                    onRun={runCell}
                                    onRemove={() => removeCell(cell.id)}
                                    onMoveUp={() => moveCellUp(cell.id)}
                                    onMoveDown={() => moveCellDown(cell.id)}
                                    onFix={fixCell}
                                    onModify={modifyCell}
                                    onClear={() => clearOutput(cell.id)}
                                    addCodeCell={addCodeCell}
                                    addMarkdownCell={addMarkdownCell}
                                    llmLoading={llmLoading}
                                />
                            ) : (
                                <MarkdownCell
                                    cell={cell}
                                    onChange={updateCell}
                                    onRemove={() => removeCell(cell.id)}
                                    onMoveUp={() => moveCellUp(cell.id)}
                                    onMoveDown={() => moveCellDown(cell.id)}
                                    addCodeCell={addCodeCell}
                                    addMarkdownCell={addMarkdownCell}
                                />
                            )}
                        </div>
                    ))}
                </div>
                <ChatWindow
                    onModify={modifyCell}
                    messages={messages}
                    addMessage={addMessage}
                    llmLoading={llmLoading}
                    hasUnreadMessages={hasUnreadMessages}
                    setHasUnreadMessages={setHasUnreadMessages}
                />
                <button
                    onClick={() => setShowLLMInfo(true)}
                    className="fixed bottom-4 left-4 bg-white p-3 rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-shadow z-50"
                    title="LLM Usage Information"
                >
                    <Info size={24} className="text-gray-600" />
                </button>

                <LLMInfoPopup
                    isOpen={showLLMInfo}
                    onClose={() => setShowLLMInfo(false)}
                    requirements={requirements}
                />
            </NotebookLayout>
        </NotebookProvider>
    );
}

