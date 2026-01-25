"use client";

import React, { useEffect, useRef } from "react";

export default function AddCellMenu({ onAddCode, onAddMarkdown, onClose }) {
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <div ref={menuRef} className="flex gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-lg">
            <button
                onClick={onAddCode}
                className="px-3 py-1 text-xs rounded-md hover:bg-teal-50"
            >
                Code
            </button>
            <button
                onClick={onAddMarkdown}
                className="px-3 py-1 text-xs rounded-md hover:bg-teal-50"
            >
                Markdown
            </button>
        </div>
    );
}
