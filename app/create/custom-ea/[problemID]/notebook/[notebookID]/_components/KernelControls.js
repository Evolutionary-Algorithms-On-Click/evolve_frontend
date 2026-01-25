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
                env("NEXT_PUBLIC_V2_BACKEND_BASE_URL") ?? "http://localhost:8080";
            const data = await authenticatedFetchV2(`/api/v1/sessions`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notebook_id: notebookId, language }),
            });
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

    // Determine light color and tooltip
    let statusColor = "bg-red-500"; // default no session
    let statusTitle = "No session";
    if (loading) {
        statusColor = "bg-yellow-400";
        statusTitle = "Starting session...";
    } else if (session) {
        statusColor = "bg-green-500";
        statusTitle = `Kernel: ${session.current_kernel_id}`;
    }

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2" title={statusTitle}>
                <span
                    className={`inline-block w-3 h-3 rounded-full ${statusColor} shadow-sm`}
                />
                <span className="sr-only">Session status</span>
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            {session ? (
                <button
                    className="px-3 py-2 bg-teal-900 text-white rounded-lg text-sm"
                    onClick={stopSession}
                    disabled={loading}
                    title={loading ? "Stopping..." : "Stop session"}
                >
                    {loading ? "..." : "Stop Session"}
                </button>
            ) : (
                <button
                    className="px-3 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700"
                    onClick={startSession}
                    disabled={loading}
                    title={loading ? "Starting..." : "Start a session"}
                >
                    {loading ? "..." : "Start Session"}
                </button>
            )}
        </div>
    );
}
