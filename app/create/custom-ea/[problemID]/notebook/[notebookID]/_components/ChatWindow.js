
"use client";

import React, { useState } from "react";
import { ChatIcon, CloseIcon, SendIcon } from "./ChatIcons";

export default function ChatWindow({ onModify }) {
    const [instruction, setInstruction] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [history, setHistory] = useState([]);

    async function handleModify() {
        if (instruction.trim() !== "") {
            const newHistory = [...history, { type: "user", message: instruction }];
            setHistory(newHistory);
            await onModify(null, instruction);
            setInstruction("");
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
                        <h3 className="font-semibold text-lg">Modify Notebook</h3>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto">
                        {history.map((item, index) => (
                            <div key={index} className={`chat ${item.type === 'user' ? 'chat-end' : 'chat-start'}`}>
                                <div className="chat-bubble">
                                    {item.message}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-gray-200 flex items-center">
                        <input
                            type="text"
                            value={instruction}
                            onChange={(e) => setInstruction(e.target.value)}
                            placeholder="Enter instruction..."
                            className="w-full p-2 border rounded-md"
                            onKeyPress={(e) => e.key === 'Enter' && handleModify()}
                        />
                        <button
                            onClick={handleModify}
                            className="ml-2 p-2 bg-blue-600 text-white rounded-md"
                        >
                            <SendIcon />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

