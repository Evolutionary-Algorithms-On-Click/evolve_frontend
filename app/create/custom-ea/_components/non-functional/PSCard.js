import React, { useState } from "react";
import Link from "next/link";
import { FileText, Trash2, X } from "lucide-react";
import formatDate from "@/app/utils/formatDate";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Button,
    IconButton,
} from "@mui/material";

// Custom styled Dialog for confirmation
const DeleteProblemDialog = ({ open, onClose, onConfirm }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                style: {
                    backgroundColor: "#1e293b", // slate-800
                    color: "white",
                    borderRadius: "1rem",
                    border: "1px solid #334155", // slate-700
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                },
            }}
        >
            <DialogTitle className="flex items-center justify-between">
                <span className="text-xl font-medium">Confirm Deletion</span>
                <IconButton onClick={onClose} size="small">
                    <X className="w-5 h-5 text-slate-400" />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <p className="text-slate-300 mb-6">
                    Are you sure you want to delete this problem? This action cannot
                    be undone.
                </p>
                <div className="flex justify-end gap-4">
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        style={{
                            color: "#cbd5e1", // slate-300
                            borderColor: "#475569", // slate-600
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        variant="contained"
                        style={{
                            backgroundColor: "#be123c", // rose-700
                            color: "white",
                        }}
                        startIcon={<Trash2 />}
                    >
                        Delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};


// Statement Card Component (NotebookLM style)
const StatementCard = ({ statement, onDelete }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    // Use a set of fallback gradient color pairs (hex) so we can always render
    // a visual background even if Tailwind classes are removed at build-time
    const gradients = [
        ["#b45309", "#7c2d12"], // amber-700 -> amber-900
        ["#065f46", "#064e3b"], // emerald-700 -> emerald-900
        ["#2563eb", "#1e40af"], // blue-600 -> blue-800
        ["#6d28d9", "#4c1d95"], // purple-700 -> purple-900
        ["#be123c", "#881337"], // rose-700 -> rose-900
        ["#0f766e", "#134e4a"], // teal-700 -> teal-900
        ["#9a3412", "#451a03"], // orange-800 -> orange-950
        ["#166534", "#14532d"], // green-800 -> green-900
        ["#86198f", "#581c87"], // fuchsia-800 -> fuchsia-900
        ["#4338ca", "#312e81"], // indigo-700 -> indigo-900
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

    const handleMenuClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDialogOpen(true);
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(statement.id ?? statement._id);
        }
        setDialogOpen(false);
    };

    const handleClose = () => {
        setDialogOpen(false);
    };


    const linkHref = `/create/custom-ea/${statement.id ?? statement._id}/notebook`;

    return (
        <>
            <Link
                href={linkHref}
                className={`relative rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden`}
                style={inlineStyle}
            >
                {/* Three dots menu */}
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={handleMenuClick}
                        className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
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
            <DeleteProblemDialog
                open={dialogOpen}
                onClose={handleClose}
                onConfirm={handleDelete}
            />
        </>
    );
};

export default StatementCard;
