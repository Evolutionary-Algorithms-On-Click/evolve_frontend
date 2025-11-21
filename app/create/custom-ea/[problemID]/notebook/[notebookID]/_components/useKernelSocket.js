"use client";

import { useEffect, useRef, useState } from "react";
import { env } from "next-runtime-env";

function makeMsgId() {
    return `msg_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

function toWsUrl(base) {
    if (!base) return null;
    if (base.startsWith("https://")) return base.replace("https://", "wss://");
    if (base.startsWith("http://")) return base.replace("http://", "ws://");
    return base;
}

export default function useKernelSocket(session) {
    const wsRef = useRef(null);
    const pendingRef = useRef({}); // { [msg_id]: { resolve, reject, outputs, execution_count } }
    const [connected, setConnected] = useState(false);
    const [kernelState, setKernelState] = useState("idle"); // "idle" | "busy" | "starting"

    useEffect(() => {
        const kernelId = session?.current_kernel_id;
        if (!kernelId) return;

        // avoid reopening if already connected
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN)
            return;

        const base =
            env("NEXT_PUBLIC_BACKEND_BASE_URL") ?? "http://localhost:8080";
        const wsUrl = toWsUrl(base) + `/api/v1/kernels/${kernelId}/channels`;

        let ws;
        try {
            ws = new WebSocket(wsUrl);
            wsRef.current = ws;
        } catch (err) {
            console.error("Kernel WS construction failed", err, wsUrl);
            setConnected(false);
            Object.values(pendingRef.current).forEach(
                (p) => p.reject && p.reject(err),
            );
            pendingRef.current = {};
            return;
        }

        ws.onopen = (ev) => {
            console.debug("Kernel WS open", wsUrl, ev);
            setConnected(true);
        };

        ws.onmessage = (ev) => {
            let msg;
            try {
                msg = JSON.parse(ev.data);
            } catch (e) {
                console.error("Kernel WS parse error", e, ev.data);
                return;
            }

            const header = msg.header || {};
            const parent_header = msg.parent_header || {};
            const content = msg.content || {};
            const channel = msg.channel;
            const msgType = header.msg_type || msg.msg_type;
            const parentId = parent_header.msg_id;

            // --- Global kernel status tracking ---
            if (msgType === "status" && content.execution_state) {
                setKernelState(content.execution_state); // "busy" | "idle" | "starting"
            }

            // --- Handle stdin (input_request) ---
            if (channel === "stdin" && msgType === "input_request") {
                const promptText = content.prompt || "Input:";
                const isPassword = !!content.password;
                let value = "";

                if (typeof window !== "undefined") {
                    // Later you can replace this with a custom modal
                    value = window.prompt(promptText) || "";
                }

                const reply = {
                    header: {
                        msg_id: makeMsgId(),
                        username: "user",
                        session: session?.id || session?.session || "",
                        date: new Date().toISOString(),
                        msg_type: "input_reply",
                        version: "5.3",
                    },
                    parent_header: header,
                    metadata: {},
                    content: {
                        value: value + "\n", // input() expects newline-terminated
                    },
                    channel: "stdin",
                };

                try {
                    ws.send(JSON.stringify(reply));
                } catch (err) {
                    console.error("Failed to send input_reply", err);
                }

                return;
            }

            // --- Route messages to pending executions by parent msg_id ---
            if (!parentId || !pendingRef.current[parentId]) {
                // not tied to a tracked execute_request (e.g. kernel_info_reply)
                return;
            }

            const entry = pendingRef.current[parentId];

            switch (msgType) {
                case "stream": {
                    entry.outputs.push({
                        type: "stream",
                        name: content.name, // "stdout" | "stderr"
                        text: content.text,
                    });
                    break;
                }

                case "execute_input": {
                    // we only care about execution_count, do NOT push as output
                    entry.execution_count = content.execution_count;
                    break;
                }

                case "execute_result": {
                    entry.outputs.push({
                        type: "execute_result",
                        execution_count: content.execution_count,
                        data: content.data, // mime bundle
                        metadata: content.metadata || {},
                    });
                    break;
                }

                case "display_data": {
                    entry.outputs.push({
                        type: "display_data",
                        data: content.data,
                        metadata: content.metadata || {},
                        transient: content.transient || {},
                    });
                    break;
                }

                case "error": {
                    entry.outputs.push({
                        type: "error",
                        ename: content.ename,
                        evalue: content.evalue,
                        traceback: content.traceback,
                    });

                    // Resolve immediately on error
                    if (entry.onOutput) {
                        try {
                            entry.onOutput(
                                entry.outputs.slice(),
                                entry.execution_count,
                            );
                        } catch (err) {
                            console.error("onOutput handler error", err);
                        }
                    }

                    const result = {
                        outputs: entry.outputs,
                        execution_count: entry.execution_count,
                    };
                    entry.resolve(result);
                    delete pendingRef.current[parentId];

                    break;
                }

                case "status": {
                    // We're already updating kernelState globally above.
                    // We generally don't need to store status in outputs.
                    break;
                }

                case "clear_output": {
                    entry.outputs.push({
                        type: "clear_output",
                        wait: !!content.wait,
                    });
                    break;
                }

                case "execute_reply": {
                    // content.status: "ok" | "error" | "abort"
                    entry.outputs.push({
                        type: "execute_reply",
                        status: content.status,
                        execution_count: content.execution_count,
                        payload: content.payload || [],
                        user_expressions: content.user_expressions || {},
                    });
                    entry.execution_count =
                        entry.execution_count ?? content.execution_count;

                    if (entry.onOutput) {
                        try {
                            entry.onOutput(
                                entry.outputs.slice(),
                                entry.execution_count,
                            );
                        } catch (err) {
                            console.error("onOutput handler error", err);
                        }
                    }

                    // ✅ Resolve as soon as execute_reply is received
                    const result = {
                        outputs: entry.outputs,
                        execution_count: entry.execution_count,
                    };
                    entry.resolve(result);
                    delete pendingRef.current[parentId];
                    break;
                }

                default: {
                    entry.outputs.push({
                        type: "unknown",
                        msgType,
                        channel,
                        content,
                    });
                    break;
                }
            }
            if (entry.onOutput) {
                try {
                    // pass a shallow copy so React doesn’t see mutations
                    entry.onOutput(
                        entry.outputs.slice(),
                        entry.execution_count,
                    );
                } catch (err) {
                    console.error("onOutput handler error", err);
                }
            }
        };

        ws.onclose = (ev) => {
            console.debug(
                "Kernel WS closed",
                ev,
                "code=",
                ev?.code,
                "reason=",
                ev?.reason,
            );
            setConnected(false);
            setKernelState("idle");
            Object.values(pendingRef.current).forEach(
                (p) => p.reject && p.reject(new Error("ws closed")),
            );
            pendingRef.current = {};
        };

        ws.onerror = (e) => {
            try {
                console.error("Kernel WS error", e, {
                    readyState: ws?.readyState,
                    url: wsUrl,
                });
            } catch (err) {
                console.error("Kernel WS error (logging failed)", err);
            }
            setConnected(false);
            setKernelState("idle");
            Object.values(pendingRef.current).forEach(
                (p) => p.reject && p.reject(new Error("ws error")),
            );
            pendingRef.current = {};
        };

        return () => {
            try {
                ws.close();
            } catch (_e) {}
            wsRef.current = null;
            pendingRef.current = {};
            setConnected(false);
            setKernelState("idle");
        };
    }, [session?.current_kernel_id, session?.id, session?.session]);

    function sendExecute(code) {
        return new Promise((resolve, reject) => {
            const ws = wsRef.current;
            if (!ws || ws.readyState !== WebSocket.OPEN) {
                reject(new Error("kernel websocket not connected"));
                return;
            }

            const msg_id = makeMsgId();
            const header = {
                msg_id,
                username: "user",
                session: session?.id || session?.session || "",
                date: new Date().toISOString(),
                msg_type: "execute_request",
                version: "5.3",
            };

            const message = {
                header,
                parent_header: {},
                metadata: {},
                content: {
                    code,
                    silent: false,
                    store_history: true,
                    allow_stdin: true,
                    stop_on_error: true,
                    user_expressions: {},
                },
                channel: "shell",
            };

            pendingRef.current[msg_id] = {
                resolve,
                reject,
                outputs: [],
                execution_count: null,
            };

            try {
                ws.send(JSON.stringify(message));
            } catch (e) {
                delete pendingRef.current[msg_id];
                reject(e);
            }
        });
    }

    return { connected, sendExecute, kernelState };
}
