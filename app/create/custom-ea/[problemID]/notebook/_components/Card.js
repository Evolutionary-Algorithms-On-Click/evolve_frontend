"use client";

import React from "react";
import { PlayCircle, BookOpen, Edit, Trash2 } from "lucide-react";
import formatDate from "@/app/utils/formatDate";

const Card = ({ item, type, onRename, onDelete, onClick }) => {
    const accents = [
        "border-amber-400",
        "border-emerald-400",
        "border-blue-400",
        "border-purple-400",
        "border-rose-400",
        "border-teal-400",
    ];

    const accent = accents[(item.id ?? item._id) % accents.length];

    const handleRename = (e) => {
        e.stopPropagation();
        onRename?.(item);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete?.(item);
    };

    return (
        <div
            className={`relative group flex items-center gap-4 p-4 bg-white border-l-4 ${accent} rounded-lg shadow-sm hover:shadow-lg transition-all duration-300`}
        >
            {/* Clickable area for navigation */}
            <div
                className="flex-grow flex items-center gap-4 cursor-pointer"
                onClick={() => onClick?.(item)}
            >
                <div className="flex-shrink-0 w-10 h-10 grid place-items-center bg-gray-50 rounded-full">
                    {type === "run" ? (
                        <PlayCircle className="w-6 h-6 text-gray-500" />
                    ) : (
                        <BookOpen className="w-6 h-6 text-gray-500" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-800 truncate group-hover:text-sky-600 transition-colors">
                        {item.title}
                    </h3>
                    <div className="text-sm text-gray-500 mt-1 truncate">
                        {formatDate(item.created_at || item.date)}
                        {item.metadata ? ` • ${item.metadata}` : ""}
                    </div>
                </div>
            </div>

            {/* Action buttons on the right */}
            <div className="flex items-center gap-2">
                <button
                    onClick={handleRename}
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                    aria-label="Rename notebook"
                >
                    <Edit className="w-5 h-5" />
                </button>
                <button
                    onClick={handleDelete}
                    className="p-2 rounded-full text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                    aria-label="Delete notebook"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default Card;

