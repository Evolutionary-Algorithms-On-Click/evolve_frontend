"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
    ChevronDown,
    ChevronUp,
    Pencil,
    Play,
    Send,
    Wand2,
    X,
} from "lucide-react";
import { stripAnsi } from "./OutputArea";

export default function CodeCellControls({
    cell,
    onRun,
    onMoveUp,
    onMoveDown,
    onRemove,
    onFix,
    onModify,
    llmLoading,
}) {
    const execCount = useMemo(
        () => cell.execution_count || " ",
        [cell.execution_count],
    );

    const [isModifying, setIsModifying] = useState(false);
    const [modifyInstruction, setModifyInstruction] = useState("");
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [showNoTracebackPopup, setShowNoTracebackPopup] = useState(false);

    useEffect(() => {
        if (showNoTracebackPopup) {
            const timer = setTimeout(() => {
                setShowNoTracebackPopup(false);
            }, 3000); // Popup disappears after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [showNoTracebackPopup]);

    async function handleRun() {
        if (onRun) await onRun({ ...cell });
    }

    async function handleFix() {
        const errorOutput = cell.outputs?.find(o => o.type === "error" && o.traceback);
        if (onFix && errorOutput) {
            const fullTraceback = stripAnsi(errorOutput.traceback.join("\n"));
            await onFix(cell, fullTraceback);
        } else {
            setShowNoTracebackPopup(true);
        }
    }

    async function handleSendModify() {
        if (modifyInstruction.trim() !== "" && !llmLoading) {
            if (onModify) await onModify(cell, modifyInstruction);
            setIsModifying(false);
            setModifyInstruction("");
        }
    }

    function handleModify() {
        if (isModifying) {
            setModifyInstruction("");
        }
        setIsModifying(!isModifying);
    }

    function handleDeleteClick() {
        setShowConfirmDelete(true);
    }

    function handleConfirmDelete() {
        onRemove();
        setShowConfirmDelete(false);
    }

    function handleCancelDelete() {
        setShowConfirmDelete(false);
    }

    function handleModify() {
        if (isModifying) {
            setModifyInstruction("");
        }
        setIsModifying(!isModifying);
    }

    function handleDeleteClick() {
        setShowConfirmDelete(true);
    }

    function handleConfirmDelete() {
        onRemove();
        setShowConfirmDelete(false);
    }

    function handleCancelDelete() {
        setShowConfirmDelete(false);
    }

    return (
        <div className="flex items-start gap-4 p-3 border-b border-gray-100 bg-gray-50 relative">
            {showConfirmDelete && (
                <div
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-lg shadow-lg border border-gray-200 z-50 flex flex-col items-center`}
                >
                    <p className="mb-2 text-xs text-gray-700">
                        Delete this cell?
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={handleConfirmDelete}
                            className="px-3 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600"
                        >
                            Yes
                        </button>
                        <button
                            onClick={handleCancelDelete}
                            className="px-3 py-1 bg-gray-300 text-gray-800 rounded-md text-xs hover:bg-gray-400"
                        >
                            No
                        </button>
                    </div>
                </div>
            )}
            <div className="flex items-center gap-2">
                <button
                    onClick={handleRun}
                    disabled={!!cell._isRunning || llmLoading}
                    aria-label={cell._isRunning ? "Running" : "Run cell"}
                    className={
                        "w-9 h-9 flex items-center justify-center rounded-full text-white shadow-sm " +
                        (cell._isRunning || llmLoading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-teal-600 hover:bg-teal-700")
                    }
                >
                    {llmLoading ? (
                        <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                    ) : (
                        <Play size={16} className="text-white" />
                    )}
                </button>

                <div className="text-xs text-gray-700 font-semibold px-2 py-1 bg-gray-100 rounded">
                    In [{execCount}]
                </div>
            </div>

            <div className="flex-1 text-sm text-gray-700 flex items-center gap-2">
                {isModifying ? (
                    <>
                        <input
                            type="text"
                            value={modifyInstruction}
                            onChange={(e) =>
                                setModifyInstruction(e.target.value)
                            }
                            placeholder={llmLoading ? "Processing..." : "Enter modification instruction"}
                            className="w-full p-2 border rounded"
                            disabled={llmLoading}
                        />
                        <button
                            onClick={handleSendModify}
                            title="Send modification"
                            className={`p-1.5 left bg-teal-500 hover:bg-teal-600 rounded-full text-white border border-teal-600 ${
                                llmLoading ? "cursor-not-allowed bg-opacity-50" : ""
                            }`}
                            disabled={llmLoading}
                        >
                            {llmLoading ? (
                                <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                            ) : (
                                <Send className="-left-4" size={16} />
                            )}
                        </button>
                    </>
                ) : (
                    <div className="pt-2">
                        {cell.metadata?.title || "Code cell"}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity pt-1">
                <div className="w-px h-6 bg-gray-300 mx-2"></div>

                <button
                    onClick={handleModify}
                    title="Modify code"
                    className={
                        "p-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-slate-600 border border-gray-300"
                    }
                    disabled={llmLoading}
                >
                    <Pencil
                        className={isModifying ? "text-teal-500" : ""}
                        size={16}
                    />
                </button>
                <div className="relative overflow-visible">
                    <button
                        onClick={handleFix}
                        title="Fix code"
                        className={
                            "p-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-slate-600 border border-gray-300"
                        }
                        disabled={llmLoading}
                    >
                        <Wand2
                            className={isModifying ? "text-teal-500" : ""}
                            size={16}
                        />
                    </button>
                    {showNoTracebackPopup && (
                        <div className="absolute top-full mb-2 left-1/2 -translate-x-1/2 w-max bg-gray-800 text-white text-[8px] rounded py-1 px-2 shadow-lg">
                            No error traceback found to fix.
                        </div>
                    )}
                </div>
                <button
                    onClick={onMoveUp}
                    title="Move cell up"
                    className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-slate-600 border border-gray-300"
                    disabled={llmLoading}
                >
                    <ChevronUp size={14} />
                </button>

                <button
                    onClick={onMoveDown}
                    title="Move cell down"
                    className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-slate-600 border border-gray-300"
                    disabled={llmLoading}
                >
                    <ChevronDown size={14} />
                </button>

                <button
                    onClick={handleDeleteClick}
                    title="Remove cell"
                    className="p-1.5 bg-gray-50 hover:bg-red-50 rounded-full text-gray-600 hover:text-red-600 border border-gray-300"
                    aria-label="Remove cell"
                    disabled={llmLoading}
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
