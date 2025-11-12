import React from "react";
import { FileText, Calendar, Users } from "lucide-react";

// Statement Card Component (NotebookLM style)
const StatementCard = ({ statement }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6 cursor-pointer group">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {statement.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {statement.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{statement.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{statement.collaborators} collaborators</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatementCard;
