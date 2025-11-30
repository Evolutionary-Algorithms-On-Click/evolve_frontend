"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { LogOut, Plus, PlayCircle, BookOpen } from "lucide-react";
import formatDate from "@/app/utils/formatDate";
import Loader from "@/app/_components/Loader";
import { env } from "next-runtime-env";
import { Card, CreateCard, PSDetails } from "./_components";

// Main App
export default function NotebookDashboard() {
    const [notebooksState, setNotebooksState] = useState(null); // null = loading
    const [loadingNotebooks, setLoadingNotebooks] = useState(true);
    const [notebooksError, setNotebooksError] = useState(null);
    const [creating, setCreating] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newNotebookName, setNewNotebookName] = useState("");
    const router = useRouter();

    // route params (client) - preferred source for problem id
    const params = useParams();
    const routeProblemId = params?.problemID ?? null;

    const [problemStatement, setProblemStatement] = useState(null);
    const [loadingProblem, setLoadingProblem] = useState(false);
    const [problemError, setProblemError] = useState(null);

    const previousRuns = [
        {
            id: 0,
            title: "Q3 Sales Analysis Run",
            date: "Nov 10, 2025",
            metadata: "5 cells executed",
        },
        {
            id: 1,
            title: "Data Cleaning Pipeline",
            date: "Nov 8, 2025",
            metadata: "23 cells executed",
        },
        {
            id: 2,
            title: "ML Model Training",
            date: "Nov 5, 2025",
            metadata: "18 cells executed",
        },
        {
            id: 3,
            title: "Statistical Analysis",
            date: "Nov 2, 2025",
            metadata: "15 cells executed",
        },
    ];

    // notebooksState will be populated from the backend; fallback to empty array
    const notebooks = notebooksState ?? [];

    useEffect(() => {
        let mounted = true;
        const controller = new AbortController();

        const fetchNotebooks = async () => {
            setLoadingNotebooks(true);
            setNotebooksError(null);
            try {
                const base =
                    env("NEXT_PUBLIC_BACKEND_BASE_URL") ??
                    "http://localhost:8080";
                const res = await fetch(base + "/api/v1/notebooks", {
                    method: "GET",
                    credentials: "include",
                    signal: controller.signal,
                });

                if (!mounted) return;

                if (res.status === 401) {
                    window.location.href = "/auth";
                    return;
                }

                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Error ${res.status}: ${text}`);
                }

                const data = await res.json();
                if (Array.isArray(data)) {
                    setNotebooksState(data);
                } else if (data && Array.isArray(data.data)) {
                    setNotebooksState(data.data);
                } else {
                    setNotebooksState([]);
                }
            } catch (err) {
                if (controller.signal.aborted) return;
                console.error("Failed to fetch notebooks:", err);
                setNotebooksError(err.message ?? "Failed to load notebooks.");
                setNotebooksState([]);
            } finally {
                if (mounted) setLoadingNotebooks(false);
            }
        };

        fetchNotebooks();

        // fetch problem statement details (if routeProblemId present)
        const fetchProblem = async () => {
            if (!routeProblemId) return;
            setLoadingProblem(true);
            setProblemError(null);
            try {
                const base =
                    env("NEXT_PUBLIC_BACKEND_BASE_URL") ??
                    "http://localhost:8080";
                const res = await fetch(
                    base + `/api/v1/problems/${routeProblemId}`,
                    {
                        method: "GET",
                        credentials: "include",
                        signal: controller.signal,
                    },
                );

                if (!mounted) return;

                if (res.status === 401) {
                    window.location.href = "/auth";
                    return;
                }

                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Error ${res.status}: ${text}`);
                }

                const data = await res.json();
                const stmt = data && data.data ? data.data : data;
                setProblemStatement(stmt);
            } catch (err) {
                if (controller.signal.aborted) return;
                console.error("Failed to fetch problem statement:", err);
                setProblemError(err.message ?? "Failed to load problem.");
                setProblemStatement(null);
            } finally {
                if (mounted) setLoadingProblem(false);
            }
        };

        fetchProblem();

        return () => {
            mounted = false;
            controller.abort();
        };
    }, []);

    const handleCreateNotebook = async () => {
        const name =
            newNotebookName || window.prompt("Notebook name:", "My Notebook");
        if (!name || name.trim() === "") return;
        // Prefer problem id from route
        const problemId = routeProblemId ?? null;

        setCreating(true);
        try {
            const base =
                env("NEXT_PUBLIC_BACKEND_BASE_URL") ?? "http://localhost:8080";
            const payload = {
                title: name.trim(),
                problem_statement_id:
                    problemId && problemId.trim() !== ""
                        ? problemId.trim()
                        : null,
            };

            const res = await fetch(base + "/api/v1/notebooks", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.status === 401) {
                window.location.href = "/auth";
                return;
            }

            if (res.status === 400) {
                const txt = await res.text();
                throw new Error(txt || "Bad Request");
            }

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(`Error ${res.status}: ${txt}`);
            }

            const created = await res.json();
            const added = created && created.data ? created.data : created;

            setNotebooksState((prev) => [added, ...(prev || [])]);
            // close modal
            setShowCreateModal(false);
            setNewNotebookName("");
            // navigate to notebook view if id present
            const nbId = added.id ?? added._id ?? null;
            if (nbId) {
                const encodedNbId = encodeURIComponent(nbId);
                if (routeProblemId && routeProblemId.trim() !== "") {
                    const pid = encodeURIComponent(routeProblemId.trim());
                    // navigate to /create/custom-ea/[problemID]/notebook/[notebookID]
                    router.push(
                        `/create/custom-ea/${pid}/notebook/${encodedNbId}`,
                    );
                    return;
                }
                // fallback
                router.push(`/notebooks/${encodedNbId}`);
                return;
            }
            alert(`Created notebook "${added.name || added.id}"`);
        } catch (err) {
            console.error("Failed to create notebook:", err);
            alert(`Failed to create notebook: ${err.message}`);
        } finally {
            setCreating(false);
        }
    };

    return (
        <main className="flex flex-col justify-center items-center min-h-screen font-[family-name:var(--font-geist-mono)] p-8">
            <div className="text-center">
                <h1 className="text-3xl sm:text-4xl font-bold">
                    Evolve OnClick
                </h1>
                <p>Run and Visualize algorithms with just a click.</p>
            </div>

            <div className="flex flex-row gap-4 mt-4">
                <Link
                    href="/create"
                    className="rounded-full border border-solid border-black/[.08] transition-colors flex items-center justify-center bg-background text-foreground hover:bg-[#000000] hover:text-background text-sm sm:text-base px-4 py-2 mt-2"
                >
                    ← Go Back
                </Link>
            </div>

            <div className="w-full max-w-8xl mt-8 bg-gray-50 rounded-2xl overflow-hidden shadow-md">
                <div className="p-8">
                    {/* Problem Statement preview (compact) */}
                    {routeProblemId && (
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                Problem Statement
                            </h2>
                            {loadingProblem ? (
                                <div className="text-sm text-gray-500">
                                    Loading problem...
                                </div>
                            ) : problemError ? (
                                <div className="text-sm text-red-500">
                                    {problemError}
                                </div>
                            ) : problemStatement ? (
                                <div className="mb-6">
                                    <PSDetails statement={problemStatement} />
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500">
                                    Problem not found.
                                </div>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-8">
                        {/* Notebooks Section */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                                Notebooks
                            </h2>
                            <div className="grid grid-cols-2 gap-6">
                                <CreateCard
                                    onClick={() => setShowCreateModal(true)}
                                    label={
                                        creating
                                            ? "Creating..."
                                            : "Create Notebook"
                                    }
                                />
                                {loadingNotebooks ? (
                                    <div className="col-span-2">
                                        <Loader
                                            type={"inline"}
                                            message={"Loading notebooks..."}
                                        />
                                    </div>
                                ) : notebooks.length === 0 ? (
                                    <div className="col-span-2 text-sm text-gray-500">
                                        No notebooks found.
                                    </div>
                                ) : (
                                    notebooks.map((notebook) => (
                                        <Card
                                            key={`nb-${notebook.id ?? notebook._id ?? notebook._id}`}
                                            item={notebook}
                                            type="notebook"
                                            onClick={() => {
                                                const nbId =
                                                    notebook.id ??
                                                    notebook._id ??
                                                    null;
                                                if (!nbId) {
                                                    alert(
                                                        "Notebook id not found",
                                                    );
                                                    return;
                                                }
                                                const encodedNbId =
                                                    encodeURIComponent(nbId);
                                                if (
                                                    routeProblemId &&
                                                    routeProblemId.trim() !== ""
                                                ) {
                                                    const pid =
                                                        encodeURIComponent(
                                                            routeProblemId.trim(),
                                                        );
                                                    router.push(
                                                        `/create/custom-ea/${pid}/notebook/${encodedNbId}`,
                                                    );
                                                    return;
                                                }
                                                router.push(
                                                    `/notebooks/${encodedNbId}`,
                                                );
                                            }}
                                        />
                                    ))
                                )}
                            </div>
                            {/* Create modal (simple) */}
                            {showCreateModal && (
                                <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
                                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                                        <h3 className="text-lg font-semibold mb-3">
                                            Create Notebook
                                        </h3>
                                        <label className="text-sm text-gray-600">
                                            Name
                                        </label>
                                        <input
                                            value={newNotebookName}
                                            onChange={(e) =>
                                                setNewNotebookName(
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full border rounded px-3 py-2 mt-1 mb-4"
                                            placeholder="Notebook name"
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    setShowCreateModal(false);
                                                    setNewNotebookName("");
                                                }}
                                                className="px-3 py-2 rounded bg-gray-100"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleCreateNotebook}
                                                className="px-3 py-2 rounded bg-sky-600 text-white"
                                            >
                                                Create
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Previous Runs Section */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                                Previous Runs
                            </h2>
                            <div className="grid grid-cols-2 gap-6">
                                {previousRuns.map((run) => (
                                    <Card
                                        key={`run-${run.id}`}
                                        item={run}
                                        type="run"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
