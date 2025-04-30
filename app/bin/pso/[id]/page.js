"use client";

import PreviewPSO from "@/app/_components/pso/preview";
import { BadgeX, Share2, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function PSOExecResult() {
    // --- State Variables ---
    const [data, setData] = useState(null);
    const [inputParams, setInputParams] = useState(null);
    const [codeContent, setCodeContent] = useState("");
    const [logsContent, setLogsContent] = useState(""); // For final fetched logs
    const [liveLogs, setLiveLogs] = useState(""); // For SSE streamed logs
    const [bestContent, setBestContent] = useState(""); // Best result (fitness/position for PSO)
    const [executionStatus, setExecutionStatus] = useState("pending"); // pending, running, completed, error, timed_out, failed
    const [sseStatus, setSseStatus] = useState("idle"); // idle, connecting, streaming, closed, error
    const [showCode, setShowCode] = useState(false);
    const [showLogs, setShowLogs] = useState(false);
    const [showSharePopup, setShowSharePopup] = useState(false);
    const [shareEmails, setShareEmails] = useState("");

    const { id } = useParams();

    // --- Refs ---
    const sseAbortControllerRef = useRef(null);
    const logOutputRef = useRef(null);

    // --- Function to Fetch Status and Control SSE (Defined early) ---
    const fetchData = () => {
        const backendBaseUrl =
            process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? "http://localhost:5002";
        console.log("Fetching execution status for PSO Run ID:", id);
        fetch(`${backendBaseUrl}/api/runs/run`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ runID: id }),
        })
            .then((response) => {
                if (!response.ok) {
                    return response
                        .json()
                        .then((errData) => {
                            throw new Error(
                                errData.message ||
                                    `Failed to fetch status: ${response.status}`,
                            );
                        })
                        .catch(() => {
                            throw new Error(
                                `Failed to fetch status: ${response.status}`,
                            );
                        });
                }
                return response.json();
            })
            .then((responseData) => {
                setData(responseData.data);
                const newStatus = responseData.data.status;
                console.log("Received status:", newStatus);
                setExecutionStatus(newStatus); // Update state first

                if (newStatus === "running") {
                    if (
                        sseStatus !== "streaming" &&
                        sseStatus !== "connecting"
                    ) {
                        startLogStreaming(id);
                    }
                } else if (newStatus === "scheduled") {
                    setTimeout(() => {
                        fetchData();
                    }, 2000); // Retry after 2 seconds.
                } else {
                    stopLogStreaming();
                    if (
                        newStatus === "completed" ||
                        newStatus === "timed_out"
                    ) {
                        fetchFinalResults();
                    } else if (
                        newStatus === "error" ||
                        newStatus === "failed"
                    ) {
                        console.error(
                            "Execution reported as failed/error by backend.",
                        );
                        fetchLogsContent();
                    }
                    if (sseStatus !== "closed" && sseStatus !== "error") {
                        setSseStatus("idle");
                    }
                }
            })
            .catch((error) => {
                console.error("Error fetching execution status:", error);
                setExecutionStatus("error");
                stopLogStreaming();
                setSseStatus("error");
            });
    };

    // --- Function to start SSE Streaming ---
    const startLogStreaming = async (runId) => {
        if (sseAbortControllerRef.current) {
            console.log(
                "SSE stream attempt skipped: already active or starting.",
            );
            return;
        }
        setLiveLogs("");
        setSseStatus("connecting");
        console.log("Attempting to connect to SSE for Run ID:", runId);
        sseAbortControllerRef.current = new AbortController();
        const signal = sseAbortControllerRef.current.signal;
        const backendBaseUrl =
            process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? "http://localhost:5002";
        const sseUrl = `${backendBaseUrl.replace(/\/$/, "")}/api/runs/logs`;

        try {
            const response = await fetch(sseUrl, {
                method: "GET",
                headers: { "X-RUN-ID": runId, Accept: "text/event-stream" },
                signal: signal,
            });
            if (!response.ok)
                throw new Error(
                    `SSE connection failed: ${response.status} ${response.statusText}`,
                );
            if (!response.body) throw new Error("SSE response body is null");

            setSseStatus("streaming");
            console.log("SSE Connected and streaming for Run ID:", runId);
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            const processStream = async () => {
                setShowLogs(true);
                while (true) {
                    try {
                        if (signal.aborted) {
                            console.log("SSE Fetch aborted by cleanup.");
                            setSseStatus("closed");
                            break;
                        }
                        const { done, value } = await reader.read();
                        if (signal.aborted) {
                            console.log("SSE Fetch aborted during read.");
                            setSseStatus("closed");
                            break;
                        }
                        if (done) {
                            console.log("SSE Stream finished by server.");
                            setSseStatus("closed");
                            setShowCode(false);
                            setShowLogs(false);
                            sseAbortControllerRef.current = null;
                            fetchData();
                            break;
                        }

                        buffer += decoder.decode(value, { stream: true });
                        let boundaryIndex;
                        while ((boundaryIndex = buffer.indexOf("\n\n")) >= 0) {
                            const message = buffer
                                .slice(0, boundaryIndex)
                                .trim();
                            buffer = buffer.slice(boundaryIndex + 2);
                            if (message.startsWith("data: ")) {
                                const jsonDataString = message
                                    .substring(6)
                                    .trim();
                                try {
                                    const logData = JSON.parse(jsonDataString);
                                    if (
                                        logData &&
                                        typeof logData.line === "string"
                                    ) {
                                        setLiveLogs(
                                            (prev) =>
                                                prev + logData.line + "\n",
                                        );
                                    } else {
                                        console.warn(
                                            "SSE data missing 'line':",
                                            logData,
                                        );
                                        setLiveLogs(
                                            (prev) =>
                                                prev +
                                                `[INFO] ${jsonDataString}\n`,
                                        );
                                    }
                                } catch (e) {
                                    console.warn(
                                        "Non-JSON SSE data:",
                                        jsonDataString,
                                    );
                                    setLiveLogs(
                                        (prev) =>
                                            prev + `[RAW] ${jsonDataString}\n`,
                                    );
                                }
                            } else if (message.startsWith("retry: ")) {
                                console.log(
                                    "Retry interval:",
                                    message.substring(7).trim(),
                                );
                            } else if (message.startsWith("event: ")) {
                                console.log("SSE stream done event.");
                                setSseStatus("closed");
                                setShowCode(false);
                                setShowLogs(false);
                                sseAbortControllerRef.current = null;
                                fetchData();
                            } else if (message && !message.startsWith(":")) {
                                // Ignore comments starting with :
                                // Handle other event types if necessary later
                                console.log(
                                    "Received unexpected SSE line:",
                                    message,
                                );
                            }
                        }
                    } catch (readError) {
                        if (readError.name === "AbortError") {
                            console.log("SSE Fetch aborted by disconnect.");
                            setSseStatus("closed");
                        } else {
                            console.error(
                                "Error reading SSE stream:",
                                readError,
                            );
                            setSseStatus("error");
                        }
                        sseAbortControllerRef.current = null;
                        fetchData();
                        break;
                    }
                }
            };
            processStream();
        } catch (error) {
            if (error.name === "AbortError") {
                console.log("SSE connection attempt aborted.");
                setSseStatus("closed");
            } else {
                console.error("Failed to connect to SSE:", error);
                setSseStatus("error");
                setTimeout(fetchData, 3000);
            }
            sseAbortControllerRef.current = null;
        }
    };

    // --- Function to stop SSE Streaming ---
    const stopLogStreaming = () => {
        if (sseAbortControllerRef.current) {
            console.log("Aborting SSE stream...");
            sseAbortControllerRef.current.abort();
            sseAbortControllerRef.current = null;
            // setSseStatus("closed"); // Avoid race conditions
        }
    };

    // --- Function to fetch final results ---
    const fetchFinalResults = () => {
        console.log("Fetching final results...");
        fetchLogsContent();
        fetchBestContent(); // Use correct function name
    };

    // --- Fetch Static Content & Initial Status ---
    useEffect(() => {
        const minioBaseUrl =
            process.env.NEXT_PUBLIC_MINIO_BASE_URL ?? "http://localhost:9000";
        const fetchInputParams = () => {
            fetch(`${minioBaseUrl}/code/${id}/input.json`)
                .then((response) =>
                    response.ok
                        ? response.json()
                        : Promise.reject("Failed fetch input params"),
                )
                .then((data) => setInputParams(data))
                .catch((error) =>
                    console.error("Error fetching input params:", error),
                );
        };
        const fetchCodeContent = () => {
            fetch(`${minioBaseUrl}/code/${id}/code.py`)
                .then((response) =>
                    response.ok
                        ? response.text()
                        : Promise.reject("Failed fetch code"),
                )
                .then((text) => setCodeContent(text))
                .catch((error) =>
                    console.error("Error fetching code content:", error),
                );
        };

        if (id) {
            console.log(
                "PSO Component Mounted/ID changed. Fetching static data and initial status.",
            );
            fetchInputParams();
            fetchCodeContent();
            fetchData(); // Fetch initial status
        }
        // --- Cleanup Function ---
        return () => {
            console.log(
                "PSO Execution component cleanup: Stopping SSE stream.",
            );
            stopLogStreaming();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // --- Fetch Final Log Content ---
    const fetchLogsContent = () => {
        const minioBaseUrl =
            process.env.NEXT_PUBLIC_MINIO_BASE_URL ?? "http://localhost:9000";
        fetch(`${minioBaseUrl}/code/${id}/logbook.txt`)
            .then((response) =>
                response.ok
                    ? response.text()
                    : Promise.reject("Failed fetch logbook"),
            )
            .then((text) => setLogsContent(text))
            .catch((error) => {
                console.error("Error fetching final logs content:", error);
                setLogsContent("Failed to load final logs.");
            });
    };

    // --- Fetch Final Best Content (e.g., best position/fitness) ---
    const fetchBestContent = () => {
        // Renamed function
        const minioBaseUrl =
            process.env.NEXT_PUBLIC_MINIO_BASE_URL ?? "http://localhost:9000";
        fetch(`${minioBaseUrl}/code/${id}/best.txt`) // Assuming best PSO results are in best.txt
            .then((response) =>
                response.ok
                    ? response.text()
                    : Promise.reject("Failed fetch best content"),
            )
            .then((text) => setBestContent(text)) // Set the correct state
            .catch((error) => {
                console.error("Error fetching best content:", error);
                setBestContent("N/A"); // Use correct state setter
            });
    };

    // --- Auto-Scroll Effect ---
    useEffect(() => {
        if (logOutputRef.current && executionStatus === "running") {
            const element = logOutputRef.current;
            const isScrolledToBottom =
                element.scrollHeight - element.clientHeight <=
                element.scrollTop + 20;
            if (isScrolledToBottom) {
                element.scrollTop = element.scrollHeight;
            }
        }
    }, [liveLogs, executionStatus]);

    // --- Share Submit Handler ---
    const handleShareSubmit = (e) => {
        e.preventDefault();
        // Use NEXT_PUBLIC prefix for browser access
        const backendBaseUrl =
            process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? "http://localhost:5002";

        fetch(`${backendBaseUrl}/api/runs/share`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                runID: id,
                userEmailList: shareEmails
                    .split(",")
                    .map((email) => email.trim())
                    .filter((email) => email), // Filter out empty strings
            }),
        })
            .then(async (response) => {
                if (response.ok) {
                    // Check for 2xx status codes
                    alert("Run shared successfully");
                } else {
                    // Try to parse error message from backend
                    try {
                        const errorData = await response.json();
                        alert(
                            errorData.message ||
                                `Sharing failed: ${response.statusText}`,
                        );
                    } catch {
                        // Fallback if response is not JSON
                        alert(
                            `Sharing failed: ${response.status} ${response.statusText}`,
                        );
                    }
                }
            })
            .catch((error) => {
                console.error("Error sharing run:", error);
                alert("An error occurred while trying to share the run.");
            });

        setShowSharePopup(false);
        setShareEmails("");
    };

    // --- Log display logic ---
    const displayLogs = executionStatus === "running" ? liveLogs : logsContent;
    const canShowLogsButton =
        executionStatus === "running" ||
        (logsContent && logsContent !== "Failed to load final logs.");
    const disableLogsButton =
        executionStatus === "running" &&
        !liveLogs &&
        sseStatus !== "closed" &&
        sseStatus !== "error";
    const showLogsButtonText = showLogs
        ? "Hide Logs (x)"
        : executionStatus === "running"
          ? "Show Live Logs (-)"
          : "Show Final Logs (-)";
    const logTitle =
        executionStatus === "running"
            ? "Live Execution Logs"
            : "Execution Logs";
    const minioBaseUrl =
        process.env.NEXT_PUBLIC_MINIO_BASE_URL ?? "http://localhost:9000";

    return (
        <main className="flex flex-col items-center justify-center min-h-screen font-[family-name:var(--font-geist-mono)] p-4 sm:p-8 bg-gray-100">
            {/* Header */}
            <div className="text-center mb-6">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                    Evolve OnClick - PSO Run
                </h1>
                <p className="text-gray-600">
                    Visualize Particle Swarm Optimization.
                </p>
            </div>

            {/* Execution ID */}
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                Execution ID: {id}
            </h2>

            {/* Execution Status Display */}
            <div className="mt-4 text-center">
                <p className="text-gray-700 font-semibold">
                    Status:
                    <span
                        className={`capitalize font-bold ${executionStatus === "completed" ? "text-green-600" : executionStatus === "running" ? "text-blue-600" : executionStatus === "error" || executionStatus === "failed" ? "text-red-600" : executionStatus === "timed_out" ? "text-yellow-600" : "text-gray-700"}`}
                    >
                        {executionStatus}
                    </span>
                    {executionStatus === "running" && ` (${sseStatus})`}
                </p>
                {executionStatus === "running" &&
                    sseStatus !== "streaming" &&
                    sseStatus === "connecting" && (
                        <div className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-1">
                            <svg
                                className="animate-spin h-4 w-4 text-gray-500" /* ... */
                            >
                                ...
                            </svg>
                            Connecting to log stream...
                        </div>
                    )}
                {executionStatus === "running" && sseStatus === "streaming" && (
                    <div className="text-sm text-green-600 mt-1">
                        Streaming logs live...
                    </div>
                )}
                {(executionStatus === "error" ||
                    executionStatus === "failed") && (
                    <div className="text-sm text-red-500 mt-1">
                        An error occurred during execution.
                    </div>
                )}
                {executionStatus === "timed_out" && (
                    <div className="text-sm text-yellow-600 mt-1">
                        Execution timed out. Partial results may be available.
                    </div>
                )}
                {sseStatus === "error" && executionStatus === "running" && (
                    <div className="text-sm text-red-500 mt-1">
                        Log stream connection error. Attempting to fetch
                        status...
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row items-center gap-2 sm:gap-4 mt-4 flex-wrap justify-center">
                <Link
                    href="/create/pso"
                    className="rounded-full border border-solid border-black/[.08] transition-colors flex items-center justify-center bg-background text-foreground hover:bg-[#000000] hover:text-background text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2"
                >
                    ← Go Back
                </Link>
                {codeContent && (
                    <button
                        className="rounded-full border border-solid border-gray-300 transition-colors flex items-center justify-center bg-white text-gray-900 hover:bg-gray-200 text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowLogs(false);
                            setShowCode(!showCode);
                        }}
                    >
                        {showCode ? "Hide Code </>" : "Show Code </ >"}
                    </button>
                )}
                {canShowLogsButton && (
                    <button
                        className="rounded-full border border-solid border-gray-300 transition-colors flex items-center justify-center bg-white text-gray-900 hover:bg-gray-200 text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowCode(false);
                            setShowLogs(!showLogs);
                        }}
                        disabled={disableLogsButton}
                    >
                        {showLogsButtonText}
                    </button>
                )}
                <button
                    className="rounded-full border border-solid border-gray-300 transition-colors flex items-center justify-center bg-white text-gray-900 hover:bg-gray-200 text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2"
                    onClick={(e) => {
                        e.preventDefault();
                        setShowSharePopup(true);
                    }}
                >
                    <Share2 size={14} className="mr-1 sm:mr-2" /> Share
                </button>
                <Link
                    href="/bin"
                    className="rounded-full border border-solid border-black/[.08] transition-colors flex items-center justify-center bg-background text-foreground hover:bg-[#000000] hover:text-background text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2"
                >
                    All Runs →
                </Link>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col lg:flex-row mt-6 gap-4 w-full max-w-7xl">
                {/* PSO Input Parameters Preview */}
                {inputParams && (
                    <div className="border border-gray-300 rounded-xl bg-white bg-opacity-90 shadow-sm p-0 overflow-hidden w-full lg:w-[350px] lg:max-w-[350px] flex-shrink-0 h-fit">
                        {/* Use PreviewPSO component */}
                        <PreviewPSO
                            algorithm={inputParams.algorithm ?? "N/A"}
                            dimensions={inputParams.dimensions ?? 0}
                            weights={inputParams.weights ?? []} // Default to empty array
                            minPosition={inputParams.minPosition ?? 0}
                            maxPosition={inputParams.maxPosition ?? 0}
                            minSpeed={inputParams.minSpeed ?? 0}
                            maxSpeed={inputParams.maxSpeed ?? 0}
                            phi1={inputParams.phi1 ?? 0}
                            phi2={inputParams.phi2 ?? 0}
                            benchmark={inputParams.benchmark ?? ""}
                            populationSize={inputParams.populationSize ?? 0}
                            generations={inputParams.generations ?? 0}
                            currentStep={11} // Static step? Adjust if needed
                        />
                    </div>
                )}

                {/* Code / Logs / Results Display */}
                <div className="flex flex-col items-start border border-gray-300 rounded-xl p-4 bg-white shadow-sm flex-grow min-h-[300px]">
                    {showCode && codeContent ? (
                        <div className="w-full">
                            {/* ... Code display ... */}
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xl font-bold text-gray-800">
                                    Code
                                </h3>
                                {/* ... Ask AI Button ... */}
                                {process.env.NEXT_PUBLIC_AI === "true" && (
                                    <Link
                                        href={`/explain/${id}`}
                                        className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 border border-slate-300 shadow-sm transition-all duration-200 ease-in-out hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 active:bg-slate-300"
                                    >
                                        <Sparkles
                                            size={14}
                                            className="text-blue-500"
                                            aria-hidden="true"
                                        />
                                        Ask EvoC AI
                                    </Link>
                                )}
                            </div>
                            <pre className="bg-gray-100 p-3 rounded-lg overflow-auto text-xs sm:text-sm mt-2 max-h-[70vh] w-full">
                                <code className="language-python whitespace-pre-wrap break-words">
                                    {codeContent}
                                </code>
                            </pre>
                        </div>
                    ) : showLogs && canShowLogsButton ? (
                        <div className="w-full flex flex-col">
                            {/* ... Log Title and Download Button ... */}
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xl font-bold text-gray-800">
                                    {logTitle}
                                </h3>
                                {executionStatus !== "running" &&
                                    logsContent && (
                                        <button
                                            className="rounded-full border border-solid border-gray-300 transition-colors flex items-center justify-center bg-white text-gray-900 hover:bg-gray-200 text-xs sm:text-sm px-3 py-1.5"
                                            onClick={() => {
                                                const element =
                                                    document.createElement("a");
                                                const file = new Blob(
                                                    [logsContent],
                                                    { type: "text/plain" },
                                                );
                                                element.href =
                                                    URL.createObjectURL(file);
                                                element.download = `logs_${id}.txt`;
                                                document.body.appendChild(
                                                    element,
                                                ); // Required for Firefox
                                                element.click();
                                                document.body.removeChild(
                                                    element,
                                                ); // Clean up
                                            }}
                                        >
                                            Download Logs
                                        </button>
                                    )}
                            </div>
                            {/* Log Output Area */}
                            <pre
                                ref={logOutputRef}
                                className={
                                    "bg-gray-900 text-gray-300 p-3 rounded-lg text-xs sm:text-sm mt-2 w-full overflow-auto max-h-[70vh] font-mono"
                                }
                                style={{ tabSize: 4, MozTabSize: 4 }}
                            >
                                {executionStatus === "running" &&
                                    !liveLogs &&
                                    sseStatus !== "error" &&
                                    sseStatus !== "closed" && (
                                        <span className="italic opacity-60">
                                            Waiting for first log message...
                                        </span>
                                    )}
                                <code className="whitespace-pre-wrap break-words">
                                    {displayLogs}
                                </code>
                                {executionStatus === "running" &&
                                    sseStatus === "closed" && (
                                        <span className="italic opacity-60 block mt-2">
                                            Log stream ended. Fetching final
                                            status...
                                        </span>
                                    )}
                                {executionStatus === "running" &&
                                    sseStatus === "error" && (
                                        <span className="italic text-red-400 block mt-2">
                                            Log stream error.
                                        </span>
                                    )}
                            </pre>
                        </div>
                    ) : executionStatus === "completed" ||
                      executionStatus === "timed_out" ? (
                        <div className="w-full">
                            {/* PSO Specific Results */}
                            {bestContent && (
                                <div className="mb-4">
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                                        Best Result (Position/Fitness)
                                    </h3>
                                    {/* Display best PSO result */}
                                    <pre className="rounded-lg text-sm mt-2 overflow-auto bg-gray-100 p-3 whitespace-pre-wrap break-words">
                                        <code>{bestContent}</code>
                                    </pre>
                                </div>
                            )}
                            {/* PSO Animation */}
                            <div className="mt-4 w-full">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                                    PSO Animation
                                </h3>
                                <Image
                                    src={`${minioBaseUrl}/code/${id}/pso_animation.gif`} // Common name for PSO animation
                                    alt="PSO Animation"
                                    width={800}
                                    height={600} // Adjust size for animation
                                    className="rounded-lg shadow-md object-contain border border-gray-200 w-full h-auto max-w-full"
                                    unoptimized // GIF optimization in Next/Image can be tricky
                                    // Add placeholder or error message display
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                        const parent =
                                            e.currentTarget.parentElement;
                                        if (parent) {
                                            const errorMsg =
                                                document.createElement("p");
                                            errorMsg.textContent =
                                                "Animation failed to load.";
                                            errorMsg.className =
                                                "text-red-500 text-sm mt-2";
                                            parent.appendChild(errorMsg);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    ) : executionStatus === "running" ? ( // Show general loading only if running and logs/code aren't shown
                        <div className="flex items-center justify-center w-full h-full min-h-[200px]">
                            <svg
                                className="animate-spin h-8 w-8 text-gray-600"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            <span className="ml-2 text-gray-600">
                                Processing...
                            </span>
                        </div>
                    ) : executionStatus === "pending" ? ( // Show initial loading indicator
                        <div className="flex items-center justify-center w-full h-full min-h-[200px]">
                            <svg
                                className="animate-spin h-8 w-8 text-gray-600"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            <span className="ml-2 text-gray-600">
                                Loading status...
                            </span>
                        </div>
                    ) : executionStatus === "error" ||
                      executionStatus === "failed" ? ( // Show error message if logs/code aren't shown
                        <div className="flex items-center justify-center w-full h-full min-h-[200px] text-red-500">
                            Execution failed. Check logs if available.
                        </div>
                    ) : null}
                </div>
                {/* Initial Loading Placeholder */}
                {!inputParams && executionStatus === "pending" && (
                    <div className="flex items-center justify-center w-full py-10 text-center text-gray-500">
                        <svg
                            className="animate-spin h-6 w-6 text-gray-500 mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        Loading Run Details...
                    </div>
                )}
            </div>

            {/* Share Run Popup */}
            {showSharePopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
                        <button
                            onClick={() => setShowSharePopup(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                            aria-label="Close share popup"
                        >
                            <BadgeX size={24} />
                        </button>
                        <h3 className="text-xl font-bold mb-4 text-center">
                            Share Run
                        </h3>
                        <form onSubmit={handleShareSubmit}>
                            {/* ... Input and Buttons ... */}
                            <label
                                htmlFor="shareEmailsInput"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Enter email IDs (comma separated):
                            </label>
                            <input
                                id="shareEmailsInput"
                                type="text"
                                value={shareEmails}
                                onChange={(e) => setShareEmails(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="example1@mail.com, example2@mail.com"
                                required
                            />
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowSharePopup(false)}
                                    className="rounded-full px-4 py-2 text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-full transition-colors flex items-center justify-center bg-yellow-400 text-black hover:bg-yellow-50 text-sm sm:text-base h-12 p-4 w-full   border border-black gap-2"
                                >
                                    Share
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
