"use client";

import React, { useState, useCallback, useEffect } from "react";
import { env } from "next-runtime-env";

export default function KernelControls({
    notebookId,
    language = "python3",
    onSessionCreated,
    onStartAvailable,
}) {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // expose startSession to parent so Run can auto-start a session when needed
    const startSession = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const base =
                env("NEXT_PUBLIC_BACKEND_BASE_URL") ?? "http://localhost:8080";
            const res = await fetch(`${base}/api/v1/sessions`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notebook_id: notebookId, language }),
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to create session");
            }
            const data = await res.json();
            setSession(data);
            onSessionCreated && onSessionCreated(data);
            return data;
        } catch (err) {
            setError(String(err));
            return null;
        } finally {
            setLoading(false);
        }
    }, [notebookId, language, onSessionCreated]);

    useEffect(() => {
        if (onStartAvailable) onStartAvailable(startSession);
    }, [onStartAvailable, startSession]);

    async function stopSession() {
        if (!session) return;
        setLoading(true);
        setError(null);
        try {
            const base =
                env("NEXT_PUBLIC_BACKEND_BASE_URL") ?? "http://localhost:8080";
            await fetch(`${base}/api/v1/sessions/${session.id}`, {
                method: "DELETE",
                credentials: "include",
            });
        } catch (_) {
            // ignore
        } finally {
            setSession(null);
            onSessionCreated && onSessionCreated(null);
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center gap-4">
            <div className="flex-1">
                {session ? (
                    <div className="text-sm">
                        <div className="font-medium text-gray-900">
                            Session active
                        </div>
                        <div className="text-xs text-gray-500">
                            Kernel: {session.current_kernel_id}
                        </div>
                    </div>
                ) : (
                    <div className="text-sm text-gray-600">
                        No active session
                    </div>
                )}
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {session ? (
                <button
                    className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm"
                    onClick={stopSession}
                    disabled={loading}
                >
                    {loading ? "Stopping..." : "Stop Session"}
                </button>
            ) : (
                <button
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
                    onClick={startSession}
                    disabled={loading}
                >
                    {loading ? "Starting..." : "Start Session"}
                </button>
            )}
        </div>
    );
}
