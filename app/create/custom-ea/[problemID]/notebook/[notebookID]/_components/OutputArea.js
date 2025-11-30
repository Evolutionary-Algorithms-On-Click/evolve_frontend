"use client";

import React from "react";

function stripAnsi(str = "") {
    return str.replace(
        // ANSI color escape sequences
        /\x1b\[[0-9;]*m/g,
        "",
    );
}

export default function OutputArea({ outputs = [] }) {
    if (!outputs || outputs.length === 0) {
        return null;
    }

    // try to find an execution count for labeling
    const execCount = (() => {
        for (const o of outputs) {
            if (o.execution_count) return o.execution_count;
            if (o.execution_count === 0) return 0;
        }
        return null;
    })();

    return (
        <div className="mt-3 bg-gray-900 text-gray-100 rounded-lg p-3 text-sm font-mono border border-gray-800">
            {execCount !== null && (
                <div className="text-xs text-gray-400 mb-2">
                    Out [{execCount}]:
                </div>
            )}
            <div className="space-y-1">
                {outputs.map((out, idx) => {
                    if (!out || !out.type) return null;

                    // ----- STDOUT / STDERR -----
                    if (out.type === "stream") {
                        const isErr = out.name === "stderr";
                        const text = stripAnsi(out.text || "");

                        return (
                            <pre
                                key={idx}
                                className={
                                    "whitespace-pre-wrap" +
                                    (isErr ? " text-red-400" : " text-gray-100")
                                }
                            >
                                {text}
                            </pre>
                        );
                    }

                    // ----- EXECUTE RESULT / DISPLAY DATA -----
                    if (
                        out.type === "execute_result" ||
                        out.type === "display_data"
                    ) {
                        const data = out.data || {};

                        // ----- IMAGE PNG -----
                        if (data["image/png"]) {
                            return (
                                <img
                                    key={idx}
                                    src={`data:image/png;base64,${data["image/png"]}`}
                                    alt="png output"
                                    className="my-2 max-w-full rounded"
                                />
                            );
                        }

                        // ----- IMAGE JPEG -----
                        if (data["image/jpeg"]) {
                            return (
                                <img
                                    key={idx}
                                    src={`data:image/jpeg;base64,${data["image/jpeg"]}`}
                                    alt="jpeg output"
                                    className="my-2 max-w-full rounded"
                                />
                            );
                        }

                        // ----- SVG -----
                        if (data["image/svg+xml"]) {
                            return (
                                <div
                                    key={idx}
                                    className="my-2"
                                    dangerouslySetInnerHTML={{
                                        __html: data["image/svg+xml"],
                                    }}
                                />
                            );
                        }

                        // ----- HTML -----
                        if (data["text/html"]) {
                            return (
                                <div
                                    key={idx}
                                    className="my-2"
                                    dangerouslySetInnerHTML={{
                                        __html: data["text/html"],
                                    }}
                                />
                            );
                        }

                        // ----- FALLBACK: text/plain -----
                        return (
                            <pre
                                key={idx}
                                className="whitespace-pre-wrap text-gray-100"
                            >
                                {data["text/plain"] ||
                                    JSON.stringify(data, null, 2)}
                            </pre>
                        );
                    }

                    // ----- PYTHON ERRORS -----
                    if (out.type === "error") {
                        const raw = Array.isArray(out.traceback)
                            ? out.traceback.join("\n")
                            : `${out.ename || "Error"}: ${out.evalue || ""}`;

                        const tb = stripAnsi(raw);

                        return (
                            <pre
                                key={idx}
                                className="whitespace-pre-wrap text-red-400"
                            >
                                {tb}
                            </pre>
                        );
                    }

                    // ----- EXECUTE INPUT (In [x]) -----
                    if (out.type === "execute_input") {
                        return (
                            <pre
                                key={idx}
                                className="whitespace-pre-wrap text-blue-300"
                            >
                                In [{out.execution_count}]: {out.code}
                            </pre>
                        );
                    }

                    // ----- STATUS / EXECUTE_REPLY / CLEAR_OUTPUT -----
                    // We usually hide these in UI.
                    if (
                        out.type === "status" ||
                        out.type === "execute_reply" ||
                        out.type === "clear_output"
                    ) {
                        return null;
                    }

                    // ----- Unknown fallback (rare)
                    return (
                        <pre key={idx} className="text-yellow-300">
                            {`[${out.type}] ${JSON.stringify(out, null, 2)}`}
                        </pre>
                    );
                })}
            </div>
        </div>
    );
}
