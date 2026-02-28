"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { authenticatedFetch } from "../../../../../../utils/api";
import useNotebookFetch from "../_components/hooks/useNotebookFetch";
import useNotebookFiles from "../_components/hooks/useNotebookFiles";
import NotebookLoadingScreen from "../_components/NotebookLoadingScreen";
import { env } from "next-runtime-env";
import { FileIcon, StopCircle } from "lucide-react"; // Import StopCircle
import Editor from "@monaco-editor/react";
import FitnessGraph from "./FitnessGraph";

export default function VolpePage() {
    const params = useParams();
    const { problemID, notebookID } = params;
    const router = useRouter();

    const { loading, initialCells, error: fetchError } = useNotebookFetch(notebookID, problemID);
    const { files, fetchFiles, loading: filesLoading } = useNotebookFiles(notebookID);

    const [logs, setLogs] = useState([]);
    const [status, setStatus] = useState("idle");
    const [population, setPopulation] = useState(null);
    const [selectedFile, setSelectedFile] = useState("");
    const [fitnessHistory, setFitnessHistory] = useState([]);
    
    // Refs to manage connection lifecycle
    const eventSourceRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const statusRef = useRef("idle"); // Mirror status in ref for callbacks

    // Update status ref whenever state changes
    useEffect(() => {
        statusRef.current = status;
    }, [status]);

    useEffect(() => {
        if (notebookID) {
            fetchFiles();
        }
    }, [notebookID, fetchFiles]);

    useEffect(() => {
        if (files && files.length > 0 && !selectedFile) {
            const defaultFile = files.find(f => f === "data.csv") || files[0];
            setSelectedFile(defaultFile);
        }
    }, [files, selectedFile]);

    const getFullCode = () => {
        if (!initialCells) return "";
        return initialCells
            .filter((cell) => cell.cell_type === "code")
            .map((cell) => cell.source)
            .join("\n\n");
    };

    const connectToStream = (url) => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }

        const eventSource = new EventSource(url, { withCredentials: true });
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
            setLogs((prev) => [...prev, "Stream connected."]);
        };

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.population) {
                    setPopulation(data.population);
                    
                    if (data.population.length > 0) {
                         const bestInd = data.population[0];
                         setFitnessHistory(prev => [...prev, { timestamp: Date.now(), fitness: bestInd.fitness }]);
                         setLogs((prev) => [
                            ...prev,
                            `Best Fit: ${bestInd.fitness.toFixed(4)} | Genome: ${String(bestInd.genotype).substring(0, 50)}...`,
                        ]);
                    }
                }
            } catch (e) {
                console.error("Error parsing SSE data:", e);
            }
        };

        eventSource.onerror = (err) => {
            console.error("SSE Error:", err);
            eventSource.close();

            // If we are still supposed to be running, try to reconnect
            if (statusRef.current === "running") {
                setLogs((prev) => [...prev, "Stream closed unexpectedly. Reconnecting in 3s..."]);
                
                if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
                
                reconnectTimeoutRef.current = setTimeout(() => {
                    if (statusRef.current === "running") { // Double check
                        setLogs((prev) => [...prev, "Attempting reconnection..."]);
                        connectToStream(url);
                    }
                }, 3000);
            } else {
                 setLogs((prev) => [...prev, "Stream connection closed."]);
            }
        };
    };

    const handleRun = async () => {
        if (status === "running") return;
        if (!selectedFile) {
             setLogs((prev) => [...prev, "Error: No file selected."]);
             return;
        }

        setStatus("running");
        setLogs((prev) => [...prev, `Initiating VolPE submission with ${selectedFile}...`]);
        setPopulation(null);
        setFitnessHistory([]);

        try {
            const sessionId = notebookID;
            const payload = {
                notebook_id: notebookID,
                filename: selectedFile,
                session_id: sessionId,
            };

            await authenticatedFetch("/api/v1/submission/submit", {
                method: "POST",
                body: JSON.stringify(payload),
            });

            setLogs((prev) => [...prev, "Submission successful. Connecting to stream..."]);

            const baseUrl = env("NEXT_PUBLIC_BACKEND_BASE_URL") ?? "http://localhost:8080";
            const url = `${baseUrl}/api/v1/submission/results/${sessionId}`;

            connectToStream(url);

        } catch (err) {
            console.error("Run failed:", err);
            setStatus("error");
            setLogs((prev) => [...prev, `Error: ${err.message}`]);
        }
    };

    const handleStop = () => {
        setStatus("idle");
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
        setLogs((prev) => [...prev, "Stopped by user."]);
    };

    useEffect(() => {
        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, []);

    if (loading) return <NotebookLoadingScreen />;
    if (fetchError) return <div className="p-8 text-red-500">Error: {fetchError}</div>;

    const code = getFullCode();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-[family-name:var(--font-geist-mono)]">
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="text-slate-600 hover:text-slate-900 flex items-center gap-2 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        Back
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">VolPE Runner</h1>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                        <FileIcon size={16} className="text-gray-500" />
                        <select 
                            value={selectedFile} 
                            onChange={(e) => setSelectedFile(e.target.value)}
                            className="bg-transparent text-sm text-gray-700 outline-none min-w-[150px]"
                            disabled={status === "running" || filesLoading}
                        >
                            <option value="" disabled>Select a file...</option>
                            {files && files.map((file) => (
                                <option key={file} value={file}>
                                    {file}
                                </option>
                            ))}
                        </select>
                    </div>

                    {status === "running" ? (
                        <button
                            onClick={handleStop}
                            className="px-6 py-2 rounded-full font-semibold text-white shadow-md transition-all bg-red-500 hover:bg-red-600 active:scale-95 flex items-center gap-2"
                        >
                            <StopCircle size={16} />
                            Stop
                        </button>
                    ) : (
                        <button
                            onClick={handleRun}
                            disabled={!selectedFile}
                            className={`px-6 py-2 rounded-full font-semibold text-white shadow-md transition-all ${!selectedFile ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700 hover:shadow-lg active:scale-95"}`}
                        >
                            Run using VolPE
                        </button>
                    )}
                </div>
            </div>
            <div className="flex-1 flex overflow-hidden">
                <div className="w-1/2 flex flex-col border-r border-gray-200 bg-white">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Notebook Source</h2>
                    </div>
                    <div className="flex-1 overflow-hidden p-0 h-full">
                        <Editor
                            height="100%"
                            defaultLanguage="python"
                            value={code}
                            options={{
                                readOnly: true,
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                fontSize: 13,
                                fontFamily: "var(--font-geist-mono)",
                                renderLineHighlight: "all",
                            }}
                        />
                    </div>
                </div>

                <div className="w-1/2 flex flex-col bg-gray-50/30">
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-center">
                            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Results Stream</h2>
                            {population && <span className="text-xs font-mono text-teal-600 bg-teal-50 px-2 py-1 rounded">Generations Active</span>}
                        </div>
                        <div className="flex-1 overflow-auto p-6 space-y-4">
                            <FitnessGraph data={fitnessHistory} />
                            {population ? (
                                population.map((ind, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start gap-4 mb-2">
                                            <span className="text-xs font-bold text-gray-400 uppercase">Genotype</span>
                                            <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                                                Fitness: {ind.fitness.toFixed(4)}
                                            </span>
                                        </div>
                                        <div className="font-mono text-sm text-gray-700 break-all">
                                            {ind.genotype}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                                    <p>Waiting for execution...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="h-48 border-t border-gray-200 bg-black text-green-400 font-mono text-xs overflow-auto p-4">
                        <div className="mb-2 font-bold uppercase opacity-50 text-[10px]">System Logs</div>
                        <div className="space-y-1">
                            {logs.map((log, i) => (
                                <div key={i} className="flex gap-2">
                                    <span className="opacity-50">[{new Date().toLocaleTimeString()}]</span>
                                    <span>{log}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}