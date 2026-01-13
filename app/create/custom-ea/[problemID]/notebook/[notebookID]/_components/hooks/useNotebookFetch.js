"use client";

import { useEffect, useState } from "react";
import { env } from "next-runtime-env";

// Lightweight decoder copied from previous implementation
const tryDecodePayload = (p) => {
    if (p === null || p === undefined) return p;
    if (typeof p === "object") return p;
    if (typeof p !== "string") return p;
    const s = p.trim();
    if (s.startsWith("{") || s.startsWith("[")) {
        try {
            return JSON.parse(s);
        } catch (e) {}
    }
    try {
        let b64 = s.replace(/-/g, "+").replace(/_/g, "/");
        while (b64.length % 4 !== 0) b64 += "=";
        const decoded = atob(b64);
        try {
            return JSON.parse(decoded);
        } catch (e) {
            try {
                const utf8 = decodeURIComponent(
                    Array.prototype.map
                        .call(
                            decoded,
                            (c) =>
                                "%" +
                                ("00" + c.charCodeAt(0).toString(16)).slice(-2),
                        )
                        .join(""),
                );
                try {
                    return JSON.parse(utf8);
                } catch (e2) {
                    return utf8;
                }
            } catch (e3) {
                return decoded;
            }
        }
    } catch (err) {
        return s;
    }
};

const removeEmpty = (obj) => {
    if (obj === null || obj === undefined) return null;
    if (Array.isArray(obj))
        return obj.map(removeEmpty).filter((i) => i !== null);
    if (typeof obj === "object") {
        return Object.entries(obj)
            .map(([k, v]) => [k, removeEmpty(v)])
            .filter(([, v]) => v !== null && v !== "" && v !== undefined)
            .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
    }
    return obj;
};

export default function useNotebookFetch(notebookId, problemId, session) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [initialCells, setInitialCells] = useState(null);

    useEffect(() => {
        let mounted = true;
        const controller = new AbortController();

        const uid = (prefix = "id") =>
            `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

        const fetchNotebook = async () => {
            if (!notebookId) return;
            setLoading(true);
            setError(null);
            try {
                const base =
                    env("NEXT_PUBLIC_BACKEND_BASE_URL") ??
                    "http://localhost:8080";
                const res = await fetch(
                    `${base}/api/v1/notebooks/${notebookId}`,
                    {
                        method: "GET",
                        credentials: "include",
                        signal: controller.signal,
                    },
                );
                if (res.status === 401) {
                    window.location.href = "/auth";
                    return;
                }
                if (!res.ok)
                    throw new Error(
                        `Failed to fetch notebook: ${res.statusText}`,
                    );

                const notebookData = await res.json();
                const currentCells = notebookData?.data?.cells ?? [];

                if (currentCells.length === 0) {
                    // generate via LLM
                    if (!problemId) {
                        setError(
                            "Cannot generate notebook: Missing Problem ID.",
                        );
                        setLoading(false);
                        return;
                    }
                    // fetch problem and generate
                    const problemRes = await fetch(
                        `${base}/api/v1/problems/${problemId}`,
                        { credentials: "include", signal: controller.signal },
                    );
                    if (!problemRes.ok)
                        throw new Error("Failed to fetch problem.");
                    const problemData = await problemRes.json();
                    const problemDetails = problemData?.data ?? problemData;

                    let payload =
                        problemDetails &&
                        (problemDetails.description_json || problemDetails);
                    const decoded = tryDecodePayload(payload);
                    const cleanedProblem = removeEmpty(decoded);

                    const user_id = session?.user_id
                        ? String(session.user_id)
                        : "";
                    const notebook_id = notebookId ? String(notebookId) : "";

                    payload = {
                        ...(cleanedProblem || {}),
                        notebook_id,
                        // TODO: Later fetch user ID from session/auth context
                        user_id: "UserID should be taken from session",
                    };

                    const llmRes = await fetch(`${base}/api/v1/llm/generate`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify(payload),
                        signal: controller.signal,
                    });
                    if (!llmRes.ok)
                        throw new Error(
                            "Failed to generate notebook from LLM.",
                        );
                    const llmNotebook = await llmRes.json();

                    const newCells =
                        llmNotebook?.notebook?.cells.map((c, i) => ({
                            id: uid(c.cell_type || "cell"),
                            idx: i,
                            cell_name: c.cell_name,
                            cell_type: c.cell_type || "code",
                            source: Array.isArray(c.source)
                                ? c.source.join("")
                                : c.source || "",
                            outputs: [],
                            execution_count: c.execution_count || 0,
                        })) ?? [];

                    if (newCells.length > 0) setInitialCells(newCells);
                    else
                        setInitialCells([
                            {
                                id: uid("md"),
                                cell_type: "markdown",
                                source: "# New Notebook",
                            },
                        ]);
                } else {
                    setInitialCells(
                        currentCells.map((c, i) => ({
                            ...c,
                            id: uid(c.cell_type || "cell"),
                            idx: i,
                            cell_name: c.cell_name,
                            cell_type: c.cell_type || "code",
                            source: c.source || "",
                            execution_count: c.execution_count || 0,
                        })),
                    );
                }
            } catch (err) {
                if (controller.signal.aborted) return;
                console.error(err);
                setError(err.message || "An error occurred.");
                setInitialCells([]);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchNotebook();

        return () => {
            mounted = false;
            controller.abort();
        };
        // Intentionally exclude `session` from dependencies so starting/setting a kernel
        // session does not re-trigger a full notebook fetch/generation which caused
        // the UI to refresh repeatedly when starting a session.
    }, [notebookId, problemId]);

    return { loading, error, initialCells, setInitialCells };
}
