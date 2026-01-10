"use client";

import React, { useState, useEffect, useRef } from "react";
import { Remarkable } from "remarkable";
import * as linkifyImport from "remarkable/linkify";
import { Plus, ChevronUp, ChevronDown, Pencil, X } from "lucide-react";
import AddCellMenu from "./toolbars/AddCellMenu";

// Using a proper markdown parser and the linkify plugin.
// The linkify module can export different shapes depending on bundler;
// support default and named exports gracefully.
const md = new Remarkable({
    html: false,
    xhtmlOut: false,
    breaks: true,
});

try {
    const linkify = linkifyImport && (linkifyImport.default || linkifyImport);
    if (typeof linkify === "function") {
        md.use(linkify);
    }
} catch (e) {
    // If plugin doesn't load, continue without linkify (fallback)
    // Linkifying will still work for many cases or can be added later.
}

function simpleMarkdownToHtml(s) {
    if (!s) return "";
    try {
        return md.render(String(s));
    } catch (e) {
        return String(s);
    }
}

export default function MarkdownCell({
    cell,
    onChange,
    onRemove,
    onMoveUp,
    onMoveDown,
    addCodeCell,
    addMarkdownCell,
}) {
    const [editing, setEditing] = React.useState(false);
    const [value, setValue] = React.useState(cell.source || "");
    const [showAddMenu, setShowAddMenu] = useState(null); // null, 'top', or 'bottom'

    React.useEffect(() => {
        setValue(cell.source || "");
    }, [cell.source]);

    function save() {
        setEditing(false);
        onChange && onChange({ ...cell, source: value });
    }

    function cancel() {
        setEditing(false);
        setValue(cell.source || "");
    }

    return (
        <div className="mb-4 group relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                {showAddMenu === 'top' ? (
                    <AddCellMenu
                        onAddCode={() => { addCodeCell(cell.idx); setShowAddMenu(null); }}
                        onAddMarkdown={() => { addMarkdownCell(cell.idx); setShowAddMenu(null); }}
                        onClose={() => setShowAddMenu(null)}
                    />
                ) : (
                    <button
                        onClick={() => setShowAddMenu('top')}
                        className="p-1 rounded-full bg-gray-100 border border-gray-300 text-gray-600 hover:bg-teal-100 hover:text-teal-600"
                        title="Add Cell Above"
                    >
                        <Plus size={16} />
                    </button>
                )}
            </div>
            <div className="relative rounded-xl border border-gray-200 overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start justify-between p-3 border-b border-gray-100 bg-gray-100">
                    <div className="text-sm text-slate-600">Markdown</div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onMoveUp}
                            title="Move cell up"
                            className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-slate-600 border border-gray-300"
                        >
                            <ChevronUp size={14} />
                        </button>
                        <button
                            onClick={onMoveDown}
                            title="Move cell down"
                            className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-slate-600 border border-gray-300"
                        >
                            <ChevronDown size={14} />
                        </button>
                        {onRemove && (
                            <button
                                onClick={() => onRemove()}
                                title="Remove cell"
                                className="p-1.5 bg-gray-50 hover:bg-red-50 rounded-full text-gray-600 hover:text-red-600 border border-gray-300"
                            >
                                <X size={16} />
                            </button>
                        )}
                        {!editing ? (
                            <button
                                onClick={() => setEditing(true)}
                                className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-slate-600 border border-gray-300"
                            >
                                <Pencil size={16} />
                            </button>
                        ) : null}
                    </div>
                </div>

                {!editing ? (
                    <div
                        className="p-4 prose max-w-none"
                        dangerouslySetInnerHTML={{
                            __html: simpleMarkdownToHtml(cell.source),
                        }}
                    />
                ) : (
                    <div className="p-3">
                        <textarea
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="w-full min-h-[120px] p-2 border rounded font-sans text-sm"
                        />
                        <div className="mt-2 flex items-center gap-2">
                            <button
                                onClick={save}
                                className="px-3 py-1 bg-teal-600 text-white rounded text-sm hover:bg-teal-700"
                            >
                                Save
                            </button>
                            <button
                                onClick={cancel}
                                className="px-3 py-1 bg-gray-300 text-gray-800 rounded text-sm hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                {showAddMenu === 'bottom' ? (
                    <AddCellMenu
                        onAddCode={() => { addCodeCell(cell.idx + 1); setShowAddMenu(null); }}
                        onAddMarkdown={() => { addMarkdownCell(cell.idx + 1); setShowAddMenu(null); }}
                        onClose={() => setShowAddMenu(null)}
                    />
                ) : (
                    <button
                        onClick={() => setShowAddMenu('bottom')}
                        className="p-1 rounded-full bg-gray-100 border border-gray-300 text-gray-600 hover:bg-teal-100 hover:text-teal-600"
                        title="Add Cell Below"
                    >
                        <Plus size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}
