import React from "react";
import StatementCard from "../non-functional/PSCard";

// Statements List Component (Right side)
const StatementsList = ({ statements, loading = false, error = null }) => {
    return (
        <div className="h-full overflow-y-auto bg-gray-50 p-8">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    Problem Statements
                </h2>
                <p className="text-gray-600 mt-1">
                    {loading
                        ? "Loading..."
                        : `${(statements || []).length} total`}
                </p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-48">
                    <div className="text-gray-500">
                        Loading problem statements...
                    </div>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                    <p className="text-red-500 mb-2">{error}</p>
                    <p className="text-sm text-gray-600">
                        Try refreshing the page or checking your connection.
                    </p>
                </div>
            ) : !statements || statements.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-gray-600">
                    No problem statements found.
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-6">
                    {statements.map((statement) => (
                        <StatementCard
                            key={statement.id}
                            statement={statement}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default StatementsList;
