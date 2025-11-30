"use client";

import React from "react";

function simpleMarkdownToHtml(md) {
    if (!md) return "";
    // Very small markdown -> HTML converter: headings and paragraphs and code blocks
    const escaped = md
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const lines = escaped.split(/\n\n+/).map((para) => {
        // heading
        if (/^#{1,6} /.test(para)) {
            const m = para.match(/^(#{1,6}) (.*)$/m);
            const level = m[1].length;
            return `<h${level} class="font-semibold mt-2 mb-1">${m[2]}</h${level}>`;
        }
        if (/^```/.test(para)) {
            const code = para.replace(/^```\w*\n?|```$/g, "");
            return `<pre class="bg-gray-100 text-gray-800 p-2 rounded"><code>${code}</code></pre>`;
        }
        return `<p class="mb-2">${para.replace(/\n/g, "<br />")}</p>`;
    });
    return lines.join("\n");
}

export default function MarkdownCell({ cell, onChange, onRemove }) {
    const [editing, setEditing] = React.useState(false);
    const [value, setValue] = React.useState(cell.content || "");

    React.useEffect(() => {
        setValue(cell.content || "");
    }, [cell.content]);

    function save() {
        setEditing(false);
        onChange && onChange({ ...cell, content: value });
    }

    function cancel() {
        setEditing(false);
        setValue(cell.content || "");
    }

    return (
        <div className="mb-4">
            <div className="flex items-start justify-between mb-2">
                <div className="text-sm text-gray-600">Markdown</div>
                <div className="flex items-center gap-2">
                    {onRemove && (
                        <button
                            onClick={() => onRemove(cell.id)}
                            className="text-xs px-2 py-1 border rounded text-gray-600 bg-white"
                        >
                            Delete
                        </button>
                    )}
                    {!editing ? (
                        <button
                            onClick={() => setEditing(true)}
                            className="text-xs px-2 py-1 border rounded bg-white text-gray-700"
                        >
                            Edit
                        </button>
                    ) : null}
                </div>
            </div>

            {!editing ? (
                <div
                    className="bg-white border border-gray-100 rounded-lg p-4 prose max-w-none shadow-sm"
                    dangerouslySetInnerHTML={{
                        __html: simpleMarkdownToHtml(cell.content),
                    }}
                />
            ) : (
                <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
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
