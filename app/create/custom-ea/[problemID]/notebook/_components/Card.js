"use client";

import React from "react";
import { PlayCircle, BookOpen } from "lucide-react";
import formatDate from "@/app/utils/formatDate";

const Card = ({ item, type }) => {
    const accents = [
        "bg-amber-200",
        "bg-emerald-200",
        "bg-blue-200",
        "bg-purple-200",
        "bg-rose-200",
        "bg-teal-200",
    ];

    const accent = accents[item.id % accents.length];

    return (
        <div className="relative rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden">
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
            </div>
        </div>
    );
};

export default Card;
