"use client";

import React, { useState } from "react";
import { Remarkable } from "remarkable";
import * as linkifyImport from "remarkable/linkify";

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
}) {
    const [editing, setEditing] = React.useState(false);
    const [value, setValue] = React.useState(cell.source || "");

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
        <div className="mb-4 group">
            <div className="flex items-start justify-between mb-2">
                <div className="text-sm text-slate-600">Markdown</div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={onMoveUp}
                        title="Move cell up"
                        className="text-xs p-1 bg-gray-50 hover:bg-gray-100 rounded border border-gray-100"
                    >
                        ▲
                    </button>
                    <button
                        onClick={onMoveDown}
                        title="Move cell down"
                        className="text-xs p-1 bg-gray-50 hover:bg-gray-100 rounded border border-gray-100"
                    >
                        ▼
                    </button>
                    {onRemove && (
                        <button
                            onClick={() => onRemove()}
                            className="text-xs px-2 py-1 border rounded text-gray-700 bg-gray-50 border-gray-100"
                        >
                            Delete
                        </button>
                    )}
                    {!editing ? (
                        <button
                            onClick={() => setEditing(true)}
                            className="text-xs px-2 py-1 border rounded bg-gray-50 text-gray-700 border-gray-100"
                        >
                            Edit
                        </button>
                    ) : null}
                </div>
            </div>

            {!editing ? (
                <div
                    className="border border-gray-100 rounded-lg p-4 prose max-w-none"
                    dangerouslySetInnerHTML={{
                        __html: simpleMarkdownToHtml(cell.source),
                    }}
                />
            ) : (
                <div className="border border-gray-100 rounded-lg p-3">
                    <textarea
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full min-h-[120px] p-2 border rounded font-sans text-sm"
                    />
                    <div className="mt-2 flex items-center gap-2">
                        <button
                            onClick={save}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                        >
                            Save
                        </button>
                        <button
                            onClick={cancel}
                            className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
