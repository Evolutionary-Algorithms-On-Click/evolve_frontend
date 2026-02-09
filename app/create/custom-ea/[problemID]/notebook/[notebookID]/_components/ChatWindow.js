"use client";

import React, { useState } from "react";
import { ChatIcon, CloseIcon, SendIcon } from "./ChatIcons";

export default function ChatWindow({ onModify, messages, addMessage, llmLoading, hasUnreadMessages, setHasUnreadMessages }) {
    const [instruction, setInstruction] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    function handleToggleChat() {
        setIsOpen(!isOpen);
        if (!isOpen) { // If opening the chat window
            setHasUnreadMessages(false);
        }
    }

    async function handleModify() {
        if (instruction.trim() !== "" && !llmLoading) {
            const newInstruction = instruction;
            setInstruction("");
            addMessage({ type: "user", message: newInstruction });
            await onModify(null, newInstruction);
        }
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button
                onClick={handleToggleChat}
                className="bg-white p-2 rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-shadow relative"
            >
                {isOpen ? <CloseIcon /> : <ChatIcon />}
                {hasUnreadMessages && !isOpen && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                )}
            </button>
            {isOpen && (
                <div className="bg-white w-96 h-96 rounded-lg shadow-lg mt-2 flex flex-col">
                    <div className="p-3 border-b border-gray-200">
                        <h3 className="font-semibold text-base">
                            Modify Notebook
                        </h3>
                    </div>
                    <div className="flex-1 p-3 overflow-y-auto space-y-3">
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
                                    className={`p-2 rounded-lg max-w-xs ${
                                        item.type === "user"
                                            ? "bg-teal-500 text-white"
                                            : "bg-gray-200 text-gray-800"
                                    }`}
                                >
                                    <p className="text-sm">{item.message}</p>
                                    {item.changes && (
                                        <div className="mt-1 text-xs">
                                            <p className="font-semibold">Changes:</p>
                                            <p>{item.changes.join("\n")}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {llmLoading && (
                            <div className="flex justify-start">
                                <div className="p-2 rounded-lg max-w-xs bg-gray-200 text-gray-800">
                                    <div className="w-5 h-5 border-2 border-t-transparent border-teal-600 rounded-full animate-spin" />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="p-3 border-t border-gray-200 flex items-center">
                        <textarea
                            value={instruction}
                            onChange={(e) => setInstruction(e.target.value)}
                            placeholder={llmLoading ? "Processing..." : "Enter instruction..."}
                            className="w-full p-1.5 border rounded-md text-sm"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleModify();
                                }
                            }}
                            disabled={llmLoading}
                        />
                        <button
                            onClick={handleModify}
                            className={`ml-2 p-1.5 bg-teal-600 text-white rounded-md ${
                                llmLoading ? "cursor-not-allowed bg-opacity-50" : ""
                            }`}
                            disabled={llmLoading}
                        >
                            <SendIcon size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
