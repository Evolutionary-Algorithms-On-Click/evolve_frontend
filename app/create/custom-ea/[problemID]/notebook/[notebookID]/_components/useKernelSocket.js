"use client";

import { useEffect, useRef, useState } from "react";
import { env } from "next-runtime-env";

function makeMsgId() {
    return `msg_${Math.random().toString(36).slice(2, 9)}`;
}

function toWsUrl(base) {
    if (!base) return null;
    if (base.startsWith("https://")) return base.replace("https://", "wss://");
    if (base.startsWith("http://")) return base.replace("http://", "ws://");
    return base;
}

export default function useKernelSocket(session) {
    const wsRef = useRef(null);
    const pendingRef = useRef({});
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        // open websocket when session with kernel id present
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
            try {
                const msg = JSON.parse(ev.data);
                const parent = msg.parent_header && msg.parent_header.msg_id;
                if (parent && pendingRef.current[parent]) {
                    const entry = pendingRef.current[parent];
                    // push outputs based on msg_type
                    const mt = msg.msg_type || msg.header?.msg_type;
                    if (mt === "stream") {
                        entry.outputs.push({
                            type: "stream",
                            data: msg.content,
                        });
                    } else if (mt === "execute_input") {
                        entry.execution_count = msg.content.execution_count;
                    } else if (mt === "execute_reply") {
                        entry.outputs.push({
                            type: "execute_reply",
                            data: msg.content,
                        });
                        // resolve when reply arrives on shell channel
                        entry.resolve({
                            outputs: entry.outputs,
                            execution_count: entry.execution_count,
                        });
                        delete pendingRef.current[parent];
                    } else if (mt === "status") {
                        entry.outputs.push({
                            type: "status",
                            data: msg.content,
                        });
                    } else if (
                        mt === "display_data" ||
                        mt === "execute_result"
                    ) {
                        entry.outputs.push({ type: mt, data: msg.content });
                    } else if (mt === "error") {
                        entry.outputs.push({
                            type: "error",
                            data: msg.content,
                        });
                        entry.resolve({
                            outputs: entry.outputs,
                            execution_count: entry.execution_count,
                        });
                        delete pendingRef.current[parent];
                    }
                }
            } catch (e) {
                // ignore parse errors
                console.error("Kernel WS parse error", e);
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
            // reject any pending
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
            Object.values(pendingRef.current).forEach(
                (p) => p.reject && p.reject(new Error("ws error")),
            );
            pendingRef.current = {};
        };

        return () => {
            try {
                ws.close();
            } catch (e) {}
            wsRef.current = null;
            pendingRef.current = {};
            setConnected(false);
        };
    }, [session?.current_kernel_id]);

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
                content: { code, silent: false },
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

    return { connected, sendExecute };
}
