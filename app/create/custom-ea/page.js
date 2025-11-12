"use client";
import React, { useState } from "react";
import CreateNewAction from "./_components/non-functional/newPSActionButton";
import StatementCard from "./_components/non-functional/PSCard";
import ProblemStatementForm from "./_components/non-functional/PSform";

// Parent Component
export default function CustomEA() {
    const [isCreating, setIsCreating] = useState(false);
    const [statements, setStatements] = useState([
        {
            id: 1,
            title: "User Authentication Flow",
            description:
                "Redesign the authentication process to improve security",
            date: "Nov 10, 2025",
            collaborators: 3,
        },
        {
            id: 2,
            title: "Dashboard Performance",
            description: "Optimize dashboard loading times and reduce latency",
            date: "Nov 8, 2025",
            collaborators: 5,
        },
        {
            id: 3,
            title: "Mobile Responsiveness",
            description: "Improve mobile experience across all pages",
            date: "Nov 5, 2025",
            collaborators: 2,
        },
        {
            id: 4,
            title: "Data Export Feature",
            description: "Implement data export options in various formats",
            date: "Nov 1, 2025",
            collaborators: 4,
        },
        {
            id: 5,
            title: "Notification System",
            description: "Develop a real-time notification system for users",
            date: "Oct 28, 2025",
            collaborators: 3,
        },
    ]);

    const handleCreateNew = () => {
        setIsCreating(true);
    };

    const handleCancelCreate = () => {
        setIsCreating(false);
    };

    const handleSubmitStatement = (newStatement) => {
        setStatements([
            {
                id: statements.length + 1,
                ...newStatement,
                date: new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                }),
                collaborators: 1,
            },
            ...statements,
        ]);
        setIsCreating(false);
    };

    return (
        <div className="h-screen bg-gray-50 flex">
            {/* Left Half */}
            <div className="w-1/2 border-r border-gray-200">
                {!isCreating ? (
                    <CreateNewAction onCreateNew={handleCreateNew} />
                ) : (
                    <ProblemStatementForm
                        onCancel={handleCancelCreate}
                        onSubmit={handleSubmitStatement}
                    />
                )}
            </div>

            {/* Right Half */}
            <div className="w-1/2">
                <StatementsList statements={statements} />
            </div>
        </div>
    );
}

// Statements List Component (Right side)
const StatementsList = ({ statements }) => {
    return (
        <div className="h-full overflow-y-auto bg-gray-50 p-8">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    Problem Statements
                </h2>
                <p className="text-gray-600 mt-1">{statements.length} total</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {statements.map((statement) => (
                    <StatementCard key={statement.id} statement={statement} />
                ))}
            </div>
        </div>
    );
};
