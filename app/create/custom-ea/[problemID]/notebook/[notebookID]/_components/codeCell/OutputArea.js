"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

function stripAnsi(str = "") {
    return str.replace(/\x1b\[[0-9;]*m/g, "");
}

function ErrorOutput({ out }) {
    const [showTraceback, setShowTraceback] = useState(false);
    const raw = Array.isArray(out.traceback)
        ? out.traceback.join("\n")
        : `${out.ename || "Error"}: ${out.evalue || ""}`;
    const tb = stripAnsi(raw);

    return (
        <div className="bg-red-50 p-2 rounded border border-red-200">
            <div className="text-red-700 font-semibold">
                {out.ename || "Error"}: {out.evalue || ""}
            </div>
            <button
                onClick={() => setShowTraceback(!showTraceback)}
                className="text-red-600 hover:underline text-sm mt-1"
            >
                {showTraceback ? "Hide Traceback" : "Show Traceback"}
            </button>
            {showTraceback && (
                <pre className="whitespace-pre-wrap mt-2 text-red-700 text-xs">
                    {tb}
                </pre>
            )}
        </div>
    );
}

export default function OutputArea({ outputs = [], onClear }) {
    if (!outputs || outputs.length === 0) return null;

    const execCount = (() => {
        for (const o of outputs) {
            if (o.execution_count) return o.execution_count;
            if (o.execution_count === 0) return 0;
        }
        return null;
    })();

    return (
        <div className="mt-3 bg-teal-100 text-gray-800 rounded-lg p-3 text-sm font-mono border border-teal-500 relative">
            {onClear && (
                <button
                    onClick={onClear}
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-teal-100"
                    title="Clear output"
                >
                    <X size={16} className="text-teal-700" />
                </button>
            )}
            {execCount !== null && (
                <div className="text-xs text-teal-700 mb-2 font-semibold">
                    Out [{execCount}]:
                </div>
            )}
            <div className="">
                <div className="max-h-96 overflow-auto space-y-1">
                    {outputs.map((out, idx) => {
                        if (!out || !out.type) return null;
                        if (out.type === "stream") {
                            const isErr = out.name === "stderr";
                            const text = stripAnsi(out.text || "");
                            return (
                                <pre
                                    key={idx}
                                    className={
                                        "whitespace-pre-wrap p-2 rounded text-sm font-mono bg-white" +
                                        (isErr
                                            ? " text-red-600"
                                            : " text-gray-800")
                                    }
                                >
                                    {text}
                                </pre>
                            );
                        }
                        if (
                            out.type === "execute_result" ||
                            out.type === "display_data"
                        ) {
                            const data = out.data || {};
                            if (data["image/png"])
                                return (
                                    <img
                                        key={idx}
                                        src={`data:image/png;base64,${data["image/png"]}`}
                                        alt="png output"
                                        className="my-2 max-w-full rounded border border-gray-200"
                                    />
                                );
                            if (data["image/jpeg"])
                                return (
                                    <img
                                        key={idx}
                                        src={`data:image/jpeg;base64,${data["image/jpeg"]}`}
                                        alt="jpeg output"
                                        className="my-2 max-w-full rounded"
                                    />
                                );
                            if (data["image/svg+xml"])
                                return (
                                    <div
                                        key={idx}
                                        className="my-2 bg-white p-2 rounded"
                                        dangerouslySetInnerHTML={{
                                            __html: data["image/svg+xml"],
                                        }}
                                    />
                                );
                            if (data["text/html"])
                                return (
                                    <div
                                        key={idx}
                                        className="my-2 bg-white p-2 rounded"
                                        dangerouslySetInnerHTML={{
                                            __html: data["text/html"],
                                        }}
                                    />
                                );
                            return (
                                <pre
                                    key={idx}
                                    className="whitespace-pre-wrap p-2 rounded bg-white text-gray-800"
                                >
                                    {data["text/plain"] ||
                                        JSON.stringify(data, null, 2)}
                                </pre>
                            );
                        }
                        if (out.type === "error") {
                            return <ErrorOutput key={idx} out={out} />;
                        }
                        if (out.type === "execute_input") {
                            return null;
                        }
                        if (
                            out.type === "status" ||
                            out.type === "execute_reply" ||
                            out.type === "clear_output"
                        )
                            return null;
                        return (
                            <pre
                                key={idx}
                                className="text-yellow-500"
                            >{`[${out.type}] ${JSON.stringify(out, null, 2)}`}</pre>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
