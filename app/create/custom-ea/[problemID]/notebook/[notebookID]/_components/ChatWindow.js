"use client";

import React, { useState } from "react";
import { ChatIcon, CloseIcon, SendIcon } from "./ChatIcons";

export default function ChatWindow({ onModify, messages, addMessage }) {
    const [instruction, setInstruction] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    async function handleModify() {
        if (instruction.trim() !== "") {
            const newInstruction = instruction;
            setInstruction("");
            addMessage({ type: "user", message: newInstruction });
            await onModify(null, newInstruction);
        }
    }

    return (
        <div className="fixed bottom-4 right-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white p-4 rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
            >
                {isOpen ? <CloseIcon /> : <ChatIcon />}
            </button>
            {isOpen && (
                <div className="bg-white w-96 h-96 rounded-lg shadow-lg mt-2 flex flex-col">
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="font-semibold text-lg">
                            Modify Notebook
                        </h3>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((item, index) => (
                            <div
                                key={index}
                                className={`flex ${
                                    item.type === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >
                                <div
                                    className={`p-3 rounded-lg max-w-xs ${
                                        item.type === "user"
                                            ? "bg-teal-500 text-white"
                                            : "bg-gray-200 text-gray-800"
                                    }`}
                                >
                                    <p>{item.message}</p>
                                    {item.changes && (
                                        <div className="mt-2 text-sm">
                                            <p className="font-semibold">Changes:</p>
                                            <p>{item.changes.join("\n")}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-gray-200 flex items-center">
                        <textarea
                            value={instruction}
                            onChange={(e) => setInstruction(e.target.value)}
                            placeholder="Enter instruction..."
                            className="w-full p-2 border rounded-md"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleModify();
                                }
                            }}
                        />
                        <button
                            onClick={handleModify}
                            className="ml-2 p-2 bg-teal-600 text-white rounded-md"
                        >
                            <SendIcon />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
