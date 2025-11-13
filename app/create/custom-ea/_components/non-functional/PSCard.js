import React from "react";
import { FileText } from "lucide-react";

// Statement Card Component (NotebookLM style)
const StatementCard = ({ statement }) => {
    const gradients = [
        "from-amber-700 to-amber-900",
        "from-emerald-700 to-emerald-900",
        "from-blue-600 to-blue-800",
        "from-purple-700 to-purple-900",
        "from-rose-700 to-rose-900",
        "from-teal-700 to-teal-900",
    ];

    const gradient = gradients[statement.id % gradients.length];

    return (
        <div
            className={`relative rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden bg-gradient-to-br ${gradient}`}
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
                    <span>{statement.date}</span>
                    <span>•</span>
                    <span>{statement.collaborators} sources</span>
                </div>
            </div>
        </div>
    );
};

export default StatementCard;
