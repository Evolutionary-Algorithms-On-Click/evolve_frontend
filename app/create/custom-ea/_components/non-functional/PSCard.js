import React from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
import formatDate from "@/app/utils/formatDate";

// Statement Card Component (NotebookLM style)
const StatementCard = ({ statement }) => {
    // Use a set of fallback gradient color pairs (hex) so we can always render
    // a visual background even if Tailwind classes are removed at build-time
    const gradients = [
        ["#b45309", "#7c2d12"], // amber-700 -> amber-900
        ["#065f46", "#064e3b"], // emerald-700 -> emerald-900
        ["#2563eb", "#1e40af"], // blue-600 -> blue-800
        ["#6d28d9", "#4c1d95"], // purple-700 -> purple-900
        ["#be123c", "#881337"], // rose-700 -> rose-900
        ["#0f766e", "#134e4a"], // teal-700 -> teal-900
    ];

    const getIndex = (id, len) => {
        if (typeof id === "number" && Number.isFinite(id)) return id % len;
        if (!id) return 0;
        // string id (e.g. Mongo _id) -> compute simple hash
        const s = String(id);
        let sum = 0;
        for (let i = 0; i < s.length; i++) sum += s.charCodeAt(i);
        return sum % len;
    };

    const idx = getIndex(statement.id ?? statement._id, gradients.length);
    const [fromColor, toColor] = gradients[idx];

    const displayDate = statement.created_at
        ? formatDate(statement.created_at)
        : statement.date || "Unknown date";

    const owner =
        statement.created_by || statement.author || statement.owner || null;

    const inlineStyle = {
        background: `linear-gradient(135deg, ${fromColor}, ${toColor})`,
    };

    const linkHref = `/create/custom-ea/${statement.id ?? statement._id}/notebook`;

    return (
        <Link
            href={linkHref}
            className={`relative rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden`}
            style={inlineStyle}
        >
            {/* Three dots menu */}
            <div className="absolute top-4 right-4 z-10">
                <button className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex flex-col gap-1">
                        <div className="w-1 h-1 rounded-full bg-white"></div>
                        <div className="w-1 h-1 rounded-full bg-white"></div>
                        <div className="w-1 h-1 rounded-full bg-white"></div>
                    </div>
                </button>
            </div>

            {/* Card content */}
            <div className="p-6">
                {/* Icon */}
                <div className="mb-6">
                    <div className="w-16 h-16 flex items-center justify-center">
                        <FileText className="w-12 h-12 text-white/90" />
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-medium text-white mb-3 line-clamp-2 min-h-[3.5rem]">
                    {statement.title}
                </h3>

                {/* Metadata */}
                <div className="flex items-center gap-3 text-sm text-white/80">
                    <span>{displayDate}</span>
                    {owner && (
                        <>
                            <span>•</span>
                            <span>{owner}</span>
                        </>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default StatementCard;
