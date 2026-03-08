"use client";

import Loader from "@/app/_components/Loader";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";
import CreateNewAction from "./_components/non-functional/newPSActionButton";
import ProblemStatementForm from "./_components/non-functional/PSform";
import StatementsList from "./_components/feature/PSList";
import { authenticatedFetchV2 } from "@/app/utils/api";

// Parent Component
export default function CustomEA() {
    const router = useRouter();
    const [userData, setUserData] = useState({});
    useEffect(() => {
        if (!localStorage.getItem("id")) {
            window.location.href = "/auth";
            return;
        } else {
            setUserData({
                email: localStorage.getItem("email"),
                userName: localStorage.getItem("userName"),
                fullName: localStorage.getItem("fullName"),
                id: localStorage.getItem("id"),
            });
        }
    }, []);

    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [statements, setStatements] = useState(null); // null = not loaded yet
    const [loadingStatements, setLoadingStatements] = useState(true);
    const [statementsError, setStatementsError] = useState(null);
    const [submitError, setSubmitError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        let mounted = true;
        const controller = new AbortController();

        const fetchProblems = async () => {
            setLoadingStatements(true);
            setStatementsError(null);
            try {
                const data = await authenticatedFetchV2("/api/v1/problems", {
                    method: "GET",
                    signal: controller.signal,
                });

                if (!mounted) return;

                // Expecting an array of problems per spec
                if (Array.isArray(data)) {
                    setStatements(data);
                } else if (data && Array.isArray(data.data)) {
                    setStatements(data.data);
                } else {
                    // Backend returned null or unexpected shape
                    setStatements([]);
                }
            } catch (err) {
                if (controller.signal.aborted) return;
                console.error("Failed to fetch problems:", err);
                if (err.message.includes("401")) {
                    window.location.href = "/auth";
                    return;
                }
                setStatementsError(err.message ?? "Failed to load problems.");
                setStatements([]);
            } finally {
                if (mounted) setLoadingStatements(false);
            }
        };

        fetchProblems();

        return () => {
            mounted = false;
            controller.abort();
        };
    }, []);

    const handleCreateNew = () => {
        setIsCreating(true);
    };

    const handleCancelCreate = () => {
        setIsCreating(false);
    };

        const handleSubmitStatement = async (newStatement) => {
            // client-side validation: require problem name/title
            setSubmitError(null);
            const titleCandidate =
                (newStatement &&
                    (newStatement.problemName || newStatement.title)) ||
                "";
            if (!titleCandidate || titleCandidate.toString().trim() === "") {
                setSubmitError("Problem name is required.");
                return;
            }
    
            setIsLoading(true);
            try {
                // build payload according to API: title + description_json
                const payload = {
                    title:
                        newStatement.problemName ||
                        newStatement.title ||
                        "Untitled Problem",
                    // send the entire form object as description_json so backend has full data
                    description_json: newStatement,
                };
    
                const createdProblem = await authenticatedFetchV2("/api/v1/problems", {
                    method: "POST",
                    body: JSON.stringify(payload),
                });
    
                // Normalize response (accept { data: obj } or obj)
                const added =
                    createdProblem && createdProblem.data
                        ? createdProblem.data
                        : createdProblem;
    
                // Prepend created problem safely even if statements is null
                setStatements([added, ...(statements || [])]);
                setIsCreating(false);
    
                // navigate to the notebook page for the created problem
                const newId = added.id ?? added._id ?? null;
                if (newId) {
                    router.push(`/create/custom-ea/${newId}/notebook`);
                    return; // navigation will happen
                }
    
                // show inline success message briefly if no id to navigate
                setSuccessMessage(
                    `Created problem "${added.title || added.id || "Untitled"}`,
                );
                setTimeout(() => setSuccessMessage(null), 4000);
                setSubmitError(null);
            } catch (err) {
                console.error("Failed to create problem:", err);
                if (err.message.includes("401")) {
                    window.location.href = "/auth";
                    return;
                }
                alert(`Failed to create problem: ${err.message}`);
                setSubmitError(err.message ?? "Failed to create problem.");
            } finally {
                setIsLoading(false);
            }
        };
    
        const handleDeleteStatement = async (id) => {
            try {
                await authenticatedFetchV2(`/api/v1/problems/${id}`, {
                    method: "DELETE",
                });
        
                // Update state by filtering out the deleted statement
                setStatements((prevStatements) =>
                    prevStatements.filter((stmt) => (stmt.id ?? stmt._id) !== id)
                );
            } catch (err) {
                console.error("Failed to delete problem:", err);
                alert(`Failed to delete problem: ${err.message}`);
            }
        };
    
        return isLoading ? (
            <Loader type={"full"} message={"Creating Problem Statement..."} />
        ) : (
            <main className="flex flex-col justify-center items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-mono)] p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg rotate-3">E</div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">EvoLab</h1>
                    </div>
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.3em] ml-10">The Evolutionary Ecosystem</p>
                </div>
    
                {userData.fullName && (
                    <div className="mt-4 flex flex-row gap-2 bg-gray-900 rounded-full px-4 text-[#6eff39] items-center">
                        <div className="py-2">
                            <p className="text-xs">
                                {userData.fullName} {"</>"} @{userData.userName}
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                localStorage.clear();
                                window.location.href = "/auth";
                            }}
                            className="text-[#ff2e2e] font-semibold border-l border-[#ffffff] pl-3 py-2 flex flex-row justify-center items-center"
                        >
                            <LogOut className="mx-1" size={16} />
                        </button>
                    </div>
                )}
    
                <div className="flex flex-row gap-4">
                    <Link
                        href="/"
                        className="rounded-full border border-solid border-black/[.08] transition-colors flex items-center justify-center bg-background text-foreground hover:bg-[#000000] hover:text-background text-sm sm:text-base px-4 py-2 mt-8"
                    >
                        ← Go Back
                    </Link>
                </div>
    
                <div className="w-full max-w-8xl mt-8 h-[70vh] bg-gray-50 rounded-2xl overflow-hidden shadow-md flex">
                    {/* Left Half */}
                    <div className="w-1/2 border-r border-gray-200">
                        {!isCreating ? (
                            <CreateNewAction onCreateNew={handleCreateNew} />
                        ) : (
                            <ProblemStatementForm
                                onCancel={handleCancelCreate}
                                onSubmit={handleSubmitStatement}
                            />
                        )}
                    </div>
    
                    {/* Right Half */}
                    <div className="w-1/2">
                        <StatementsList
                            statements={statements}
                            loading={loadingStatements}
                            error={statementsError}
                            onDelete={handleDeleteStatement}
                        />
                    </div>
                </div>
            </main>
        );
    }
