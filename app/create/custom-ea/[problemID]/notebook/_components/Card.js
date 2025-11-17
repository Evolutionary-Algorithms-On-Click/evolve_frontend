"use client";

import React, { useEffect, useRef, useState } from "react";
import { PlayCircle, BookOpen, MoreVertical, Edit, Trash2 } from "lucide-react";
import formatDate from "@/app/utils/formatDate";

const Card = ({ item, type, onRename, onDelete, onClick }) => {
    const accents = [
        "bg-amber-200",
        "bg-emerald-200",
        "bg-blue-200",
        "bg-purple-200",
        "bg-rose-200",
        "bg-teal-200",
    ];

    const accent = accents[item.id % accents.length];

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const onDocClick = (e) => {
            if (!menuRef.current) return;
            if (!menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        if (menuOpen) document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, [menuOpen]);

    const handleRename = () => {
        setMenuOpen(false);
        const newName = window.prompt(
            "Rename item",
            item.title || item.name || "",
        );
        if (!newName) return;
        if (typeof onRename === "function") return onRename(item, newName);
        // fallback: notify user that a handler should be provided
        alert(
            `Rename requested: ${newName}. Provide an onRename callback to persist.`,
        );
    };

    const handleDelete = () => {
        setMenuOpen(false);
        if (!confirm("Delete this item?")) return;
        if (typeof onDelete === "function") return onDelete(item);
        alert("Delete requested. Provide an onDelete callback to persist.");
    };

    return (
        <div
            onClick={(e) => {
                if (typeof onClick === "function") return onClick(e);
            }}
            className="relative rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
        >
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${accent}`} />

            <div className="p-4 pl-7 flex items-center gap-4">
                <div className="w-10 h-10 grid place-items-center">
                    {type === "run" ? (
                        <PlayCircle className="w-6 h-6 text-gray-600" />
                    ) : (
                        <BookOpen className="w-6 h-6 text-gray-600" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium text-gray-900 truncate">
                        {item.title}
                    </h3>
                    <div className="text-xs text-gray-500 mt-1 truncate">
                        {formatDate(item.created_at || item.date)}
                        {item.metadata ? ` • ${item.metadata}` : ""}
                    </div>
                </div>

                <div className="ml-3 relative" ref={menuRef}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen((s) => !s);
                        }}
                        aria-expanded={menuOpen}
                        aria-haspopup="true"
                        className="p-1 rounded hover:bg-gray-100"
                    >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                            <button
                                className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRename();
                                }}
                            >
                                <Edit className="w-4 h-4" /> Rename
                            </button>
                            <button
                                className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 text-red-600"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete();
                                }}
                            >
                                <Trash2 className="w-4 h-4" /> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Card;
