"use client";

import React, { useState } from "react";
import { Remarkable } from "remarkable";

// Using a proper markdown parser
const md = new Remarkable({
    html: false, // Don't allow HTML in markdown input
    xhtmlOut: false,
    breaks: true,
    linkify: true,
});

export default function MarkdownCell({ cell, onChange, onRemove }) {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(cell.content || "");

    const handleContentChange = (e) => {
        setContent(e.target.value);
        if (onChange) {
            onChange({ ...cell, content: e.target.value });
        }
    };

    const handleViewClick = () => {
        setIsEditing(true);
    };

    const handleEditorBlur = () => {
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="group relative mb-4">
                <textarea
                    className="w-full min-h-[100px] bg-white font-sans text-sm p-3 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={content}
                    onChange={handleContentChange}
                    onBlur={handleEditorBlur}
                    autoFocus
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={onRemove}
                        className="p-1.5 bg-gray-100 hover:bg-red-100 rounded text-gray-500 hover:text-red-600"
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

    return (
        <div
            className="group relative mb-4 p-4 bg-white border border-gray-100 rounded-lg prose dark:prose-invert max-w-none cursor-pointer min-h-[50px]"
            onClick={handleViewClick}
        >
            <div
                dangerouslySetInnerHTML={{
                    __html: md.render(content),
                }}
            />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={onRemove}
                    className="p-1.5 bg-gray-100 hover:bg-red-100 rounded text-gray-500 hover:text-red-600"
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
