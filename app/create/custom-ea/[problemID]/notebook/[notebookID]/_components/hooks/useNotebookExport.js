"use client";

import { useCallback } from "react";
import { Remarkable } from "remarkable";

// This is a simplified mapper. A real implementation would be more robust.
function mapToIpynbFormat(cells) {
    const ipynb = {
        cells: cells.map((cell) => {
            const source = Array.isArray(cell.source)
                ? cell.source
                : cell.source.split("\n").map((line) => line + "\n");

            if (cell.cell_type === "code") {
                return {
                    cell_type: "code",
                    execution_count: cell.execution_count || null,
                    metadata: {
                        cell_name: cell.cell_name,
                    },
                    outputs: cell.outputs ? cell.outputs.map(o => ({
                        ...o,
                        // Ensure output data is in the correct format
                        data: o.data || {},
                    })) : [],
                    source,
                };
            } else {
                // Markdown cell
                return {
                    cell_type: "markdown",
                    metadata: {
                        cell_name: cell.cell_name,
                    },
                    source,
                };
            }
        }),
        metadata: {
            kernelspec: {
                display_name: "Python 3",
                language: "python",
                name: "python3",
            },
            language_info: {
                codemirror_mode: {
                    name: "ipython",
                    version: 3,
                },
                file_extension: ".py",
                mimetype: "text/x-python",
                name: "python",
                nbconvert_exporter: "python",
                pygments_lexer: "ipython3",
                version: "3.10.0", // Or fetch from kernel
            },
        },
        nbformat: 4,
        nbformat_minor: 4,
    };

    return JSON.stringify(ipynb, null, 2);
}

function generateHtml(cells) {
    const md = new Remarkable();
    let html = `
        <html>
            <head>
                <title>Notebook Export</title>
                <style>
                    body { font-family: sans-serif; margin: 40px; }
                    .cell { border: 1px solid #ddd; border-radius: 8px; margin-bottom: 20px; overflow: hidden; }
                    .code-cell, .markdown-cell { padding: 15px; }
                    .code-cell { background-color: #f7f7f7; }
                    .markdown-cell { background-color: #fff; }
                    pre { white-space: pre-wrap; word-wrap: break-word; }
                    .output { padding: 15px; border-top: 1px dashed #ddd; background-color: #fafafa; }
                    .output-text { color: #333; }
                    .output-error { color: red; }
                    img { max-width: 100%; }
                </style>
            </head>
            <body>
                <h1>Notebook Export</h1>
    `;

    cells.forEach(cell => {
        html += '<div class="cell">';
        if (cell.cell_type === 'code') {
            html += `<div class="code-cell"><pre><code>${cell.source}</code></pre></div>`;
            if (cell.outputs && cell.outputs.length > 0) {
                html += '<div class="output">';
                cell.outputs.forEach(output => {
                    if (output.output_type === 'stream') {
                        html += `<pre class="output-text">${output.text.join('')}</pre>`;
                    } else if (output.output_type === 'display_data' && output.data['image/png']) {
                        html += `<img src="data:image/png;base64,${output.data['image/png']}" />`;
                    } else if (output.output_type === 'error') {
                         html += `<pre class="output-error">${output.ename}: ${output.evalue}\n${output.traceback.join('\n')}</pre>`;
                    }
                });
                html += '</div>';
            }
        } else { // Markdown
            html += `<div class="markdown-cell">${md.render(cell.source)}</div>`;
        }
        html += '</div>';
    });

    html += `
            </body>
        </html>
    `;
    return html;
}


export default function useNotebookExport(cells, notebookId) {
    const downloadFile = (content, filename, contentType) => {
        const blob = new Blob([content], { type: contentType });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToIpynb = useCallback(() => {
        if (!cells) return;
        const content = mapToIpynbFormat(cells);
        const notebookName = cells[0]?.source?.split('\\n')[0].replace(/[^a-zA-Z0-9]/g, '_') || notebookId;
        downloadFile(content, `${notebookName}.ipynb`, "application/json");
    }, [cells, notebookId]);

    const exportToHtml = useCallback(() => {
        if (!cells) return;
        const content = generateHtml(cells);
        const notebookName = cells[0]?.source?.split('\\n')[0].replace(/[^a-zA-Z0-9]/g, '_') || notebookId;
        downloadFile(content, `${notebookName}.html`, "text/html");
    }, [cells, notebookId]);

    const printToPdf = useCallback(() => {
        // A simple approach is to just trigger the browser's print dialog.
        // For better results, a dedicated print stylesheet should be used to hide UI elements.
        window.print();
    }, []);

    return {
        exportToIpynb,
        exportToHtml,
        printToPdf,
    };
}
