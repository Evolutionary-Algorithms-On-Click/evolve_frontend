"use client";

import React, { useMemo, useState } from "react";
import { FixIcon, ModifyIcon } from "./Icons";

export default function CodeCellControls({
    cell,
    onRun,
    onMoveUp,
    onMoveDown,
    onRemove,
    onFix,
    onModify,
}) {
    const execCount = useMemo(
        () => cell.execution_count || " ",
        [cell.execution_count],
    );

    const [isModifying, setIsModifying] = useState(false);
    const [modifyInstruction, setModifyInstruction] = useState("");

    async function handleRun() {
        if (onRun) await onRun({ ...cell });
    }

    async function handleFix() {
        if (onFix) await onFix({ ...cell });
    }

    async function handleModify() {
        if (isModifying && modifyInstruction.trim() !== "") {
            if (onModify) await onModify({ ...cell }, modifyInstruction);
            setIsModifying(false);
            setModifyInstruction("");
        } else {
            setIsModifying(true);
        }
    }

    return (
        <div className="flex items-start gap-4 p-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2">
                <button
                    onClick={handleRun}
                    disabled={!!cell._isRunning}
                    aria-label={cell._isRunning ? "Running" : "Run cell"}
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
                {isModifying ? (
                    <input
                        type="text"
                        value={modifyInstruction}
                        onChange={(e) => setModifyInstruction(e.target.value)}
                        placeholder="Enter modification instruction"
                        className="w-full p-2 border rounded"
                    />
                ) : (
                    cell.metadata?.title || "Code cell"
                )}
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleModify}
                    title="Modify code"
                    className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded text-slate-600 border border-gray-100"
                >
                    <ModifyIcon />
                </button>
                <button
                    onClick={handleFix}
                    title="Fix code"
                    className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded text-slate-600 border border-gray-100"
                >
                    <FixIcon />
                </button>
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
    );
}
