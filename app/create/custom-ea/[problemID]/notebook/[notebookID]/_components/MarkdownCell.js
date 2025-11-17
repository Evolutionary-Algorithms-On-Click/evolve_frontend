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
            return `<pre class="bg-gray-800 text-gray-100 p-2 rounded"><code>${code}</code></pre>`;
        }
        return `<p class="mb-2">${para.replace(/\n/g, "<br />")}</p>`;
    });
    return lines.join("\n");
}

export default function MarkdownCell({ cell }) {
    return (
        <div className="mb-4">
            <div
                className="bg-white border border-gray-100 rounded-lg p-4 prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                    __html: simpleMarkdownToHtml(cell.content),
                }}
            />
        </div>
    );
}
