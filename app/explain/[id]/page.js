"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useChat } from "ai/react";
import { Bot, Loader2, Send, User, Code, FileJson } from "lucide-react";
import ReactMarkdown from "react-markdown";
import LightBulbToggle from "../../_components/LightBulbToggle";

export default function ExplainPage() {
    const [codeContent, setCodeContent] = useState(null);
    const [configContent, setConfigContent] = useState(null);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState(null);
    const [showCode, setShowCode] = useState(true);
    const [showConfig, setShowConfig] = useState(false);

    const { id } = useParams();
    const router = useRouter();
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            setIsLoadingData(true);
            setError(null);
            let codeFetched = false;
            let configFetched = false;
            try {
                const codeRes = await fetch(
                    `${process.env.NEXT_PUBLIC_MINIO_BASE_URL ?? "http://localhost:9000"}/code/${id}/code.py`,
                );
                if (!codeRes.ok)
                    throw new Error(
                        `Failed to fetch code file (status: ${codeRes.status}).`,
                    );
                const codeText = await codeRes.text();
                setCodeContent(codeText);
                codeFetched = true;
                const configRes = await fetch(
                    `${process.env.NEXT_PUBLIC_MINIO_BASE_URL ?? "http://localhost:9000"}/code/${id}/input.json`,
                );
                if (!configRes.ok)
                    throw new Error(
                        `Failed to fetch config file (status: ${configRes.status}).`,
                    );
                const configJson = await configRes.json();
                setConfigContent(configJson);
                configFetched = true;
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(`Failed to load context data: ${err.message}`);
            } finally {
                setIsLoadingData(false);
                if (!codeFetched || !configFetched) {
                    setError(
                        (prevError) =>
                            prevError || "Could not load required context.",
                    );
                    if (!codeFetched) setCodeContent(null);
                    if (!configFetched) setConfigContent(null);
                }
            }
        };
        fetchData();
    }, [id]);

    const {
        messages,
        input,
        handleInputChange,
        handleSubmit: originalHandleSubmit,
        isLoading: isChatLoading,
        error: chatError,
        append,
    } = useChat({
        api: "/api/chat/explain",
        body: {
            runId: id,
            code: codeContent,
            config: JSON.stringify(configContent, null, 2),
        },
        initialMessages: [],
        onError: (err) => {
            console.error("Chat hook error:", err);
            setError(`Chat Error: ${err.message}`);
        },
    });

    const [initialPromptSent, setInitialPromptSent] = useState(false);
    useEffect(() => {
        if (
            !isLoadingData &&
            codeContent &&
            configContent &&
            !isChatLoading &&
            !initialPromptSent &&
            messages.length === 0
        ) {
            append(
                {
                    role: "user",
                    content:
                        "Provide a concise explanation of the provided Python code and its purpose based on the configuration. Split code into sections mapping to the evolutionary algorithm concepts and explain each section. Use the configuration to understand the code's context. Represent grouped code as code blocks.",
                },
                {
                    options: {
                        body: {
                            code: codeContent,
                            config: JSON.stringify(configContent, null, 2),
                        },
                    },
                },
            );
            setInitialPromptSent(true);
        }
    }, [
        isLoadingData,
        codeContent,
        configContent,
        isChatLoading,
        initialPromptSent,
        append,
        messages.length,
    ]);

    const handleSubmitWithContext = (e) => {
        e.preventDefault();
        if (!input.trim() || !codeContent || !configContent) {
            setError(
                "Cannot send message: Code or configuration context is missing.",
            );
            return;
        }
        setError(null);
        originalHandleSubmit(e, {
            options: {
                body: {
                    codeContent: codeContent,
                    configContent: JSON.stringify(configContent, null, 2),
                },
            },
        });
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    if (isLoadingData) {
        return (
            <main className="flex flex-col items-center justify-center min-h-screen font-[family-name:var(--font-geist-mono)] p-8 bg-slate-100">
                <Loader2 className="h-12 w-12 animate-spin text-slate-600" />
                <p className="mt-4 text-slate-600">
                    Loading code and configuration...
                </p>
            </main>
        );
    }

    if (!codeContent || (!configContent && error)) {
        return (
            <main className="flex flex-col items-center justify-center min-h-screen font-[family-name:var(--font-geist-mono)] p-8 bg-slate-100">
                <BadgeX className="h-12 w-12 text-red-500" />
                <h2 className="mt-4 text-xl font-bold text-red-600">
                    Error Loading Context
                </h2>
                <p className="mt-2 text-center text-red-500 max-w-lg">
                    {error ||
                        "Could not load essential context data. Please check the run ID or try again."}
                </p>
                <button
                    onClick={router.back}
                    className="mt-6 rounded-full border border-solid border-black/[.08] transition-colors flex items-center justify-center bg-white text-slate-900 hover:bg-slate-900 hover:text-white text-sm sm:text-base px-4 py-2"
                >
                    ← Back to Execution Details
                </button>
            </main>
        );
    }

    return (
        <div className="flex h-screen w-screen bg-slate-100 font-[family-name:var(--font-geist-mono)]">
            <LightBulbToggle />
            <div className="w-[37%] flex-shrink-0 border-r border-slate-300 bg-white">
                <div className="h-full flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
                        <h2 className="text-lg font-semibold text-slate-800 truncate pr-2">
                            Context (ID: {id})
                        </h2>
                        <div className="flex gap-2 items-center flex-shrink-0">
                            {codeContent && (
                                <button
                                    onClick={() => {
                                        setShowCode(true);
                                        setShowConfig(false);
                                    }}
                                    className={`p-2 rounded-lg transition-colors ${showCode ? "bg-blue-100 text-blue-700" : "text-slate-500 hover:bg-slate-100"}`}
                                    title="Show Code"
                                >
                                    {" "}
                                    <Code size={18} />{" "}
                                </button>
                            )}
                            {configContent && (
                                <button
                                    onClick={() => {
                                        setShowCode(false);
                                        setShowConfig(true);
                                    }}
                                    className={`p-2 rounded-lg transition-colors ${showConfig ? "bg-green-100 text-green-700" : "text-slate-500 hover:bg-slate-100"}`}
                                    title="Show Configuration"
                                >
                                    {" "}
                                    <FileJson size={18} />{" "}
                                </button>
                            )}
                            <button
                                onClick={() => router.back()}
                                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                                title="Go Back"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="flex-grow overflow-y-auto p-6 bg-slate-50 text-sm">
                        {showCode && codeContent && (
                            <div>
                                {" "}
                                <h3 className="text-base font-medium text-slate-700 mb-2">
                                    code.py
                                </h3>{" "}
                                <pre className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm overflow-auto text-xs">
                                    <code>{codeContent}</code>
                                </pre>{" "}
                            </div>
                        )}
                        {showConfig && configContent && (
                            <div>
                                {" "}
                                <h3 className="text-base font-medium text-slate-700 mb-2">
                                    input.json
                                </h3>{" "}
                                <pre className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm overflow-auto text-xs">
                                    <code>
                                        {JSON.stringify(configContent, null, 2)}
                                    </code>
                                </pre>{" "}
                            </div>
                        )}
                        {!codeContent && (
                            <p className="text-yellow-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-center">
                                Code context missing.
                            </p>
                        )}
                        {!configContent && (
                            <p className="text-yellow-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-center mt-2">
                                Configuration context missing.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="w-[63%] flex-shrink-0 bg-slate-100">
                <div className="h-full flex flex-col overflow-hidden">
                    {(error || chatError) && (
                        <div className="p-3 border-b border-red-200 bg-red-50 text-center flex-shrink-0">
                            <p className="text-sm text-red-700">
                                {error ||
                                    (chatError &&
                                        `Chat Error: ${chatError.message}`) ||
                                    "An error occurred."}
                            </p>
                        </div>
                    )}
                    <div
                        ref={chatContainerRef}
                        className="flex-grow overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-slate-50 to-slate-100"
                    >
                        {messages.length === 0 &&
                            !isChatLoading &&
                            initialPromptSent && (
                                <div className="flex justify-center items-center h-full">
                                    <p className="text-slate-500">
                                        Waiting for initial explanation...
                                    </p>
                                </div>
                            )}
                        {messages?.map((m) => (
                            <div
                                key={m.id}
                                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`flex items-start gap-3 max-w-[80%] ${m.role === "user" ? "flex-row-reverse" : ""}`}
                                >
                                    <span
                                        className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-white ${m.role === "user" ? "bg-blue-500" : "bg-slate-700"}`}
                                    >
                                        {m.role === "user" ? (
                                            <User size={16} />
                                        ) : (
                                            <Bot size={16} />
                                        )}
                                    </span>
                                    <div
                                        className={`px-4 py-3 text-sm break-words shadow-sm ${m.role === "user" ? "bg-blue-500 text-white rounded-l-xl rounded-br-xl" : "bg-white text-slate-800 border border-slate-200 rounded-r-xl rounded-bl-xl"}`}
                                    >
                                        <ReactMarkdown
                                            components={{
                                                p: ({ node, ...props }) => (
                                                    <p
                                                        className="mb-2 last:mb-0"
                                                        {...props}
                                                    />
                                                ),
                                                pre: ({ node, ...props }) => (
                                                    <pre
                                                        className="my-2 bg-slate-100 p-2 rounded-lg overflow-x-auto border border-slate-300 text-xs font-mono"
                                                        {...props}
                                                    />
                                                ),
                                                code: ({
                                                    node,
                                                    inline,
                                                    className,
                                                    children,
                                                    ...props
                                                }) =>
                                                    inline ? (
                                                        <code
                                                            className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded text-xs mx-0.5"
                                                            {...props}
                                                        >
                                                            {children}
                                                        </code>
                                                    ) : (
                                                        <code
                                                            className={`font-mono ${className}`}
                                                            {...props}
                                                        >
                                                            {children}
                                                        </code>
                                                    ),
                                                ol: ({ node, ...props }) => (
                                                    <ol
                                                        className="list-decimal list-inside ml-4 my-2 space-y-1"
                                                        {...props}
                                                    />
                                                ),
                                                ul: ({ node, ...props }) => (
                                                    <ul
                                                        className="list-disc list-inside ml-4 my-2 space-y-1"
                                                        {...props}
                                                    />
                                                ),
                                                li: ({ node, ...props }) => (
                                                    <li
                                                        className="mb-1"
                                                        {...props}
                                                    />
                                                ),
                                            }}
                                        >
                                            {m.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isChatLoading && (
                            <div className="flex justify-start">
                                <div className="flex items-start gap-3 max-w-[80%]">
                                    <span className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-slate-700 text-white">
                                        <Bot size={16} />
                                    </span>
                                    <div className="rounded-r-xl rounded-bl-xl px-4 py-3 text-sm bg-white text-slate-800 border border-slate-200 flex items-center shadow-sm">
                                        <Loader2 className="h-4 w-4 animate-spin mr-2 text-slate-500" />{" "}
                                        <span>Thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-slate-200 bg-white flex-shrink-0">
                        <form
                            onSubmit={handleSubmitWithContext}
                            className="flex items-center gap-3"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={handleInputChange}
                                placeholder={
                                    !codeContent || !configContent
                                        ? "Context missing..."
                                        : "Ask EvOC AI..."
                                }
                                className="flex-grow border border-slate-300 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 disabled:opacity-50 disabled:bg-slate-100 transition-shadow"
                                disabled={
                                    isLoadingData ||
                                    isChatLoading ||
                                    !codeContent ||
                                    !configContent
                                }
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-blue-400 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                disabled={
                                    isChatLoading ||
                                    !input.trim() ||
                                    !codeContent ||
                                    !configContent
                                }
                                title="Send Message"
                            >
                                {" "}
                                <Send size={18} />{" "}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
