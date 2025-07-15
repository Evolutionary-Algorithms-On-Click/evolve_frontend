"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import DynamicLogo from "../_components/DynamicLogo";
import LightBulbToggle from "../_components/LightBulbToggle";

export default function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const inputData = {
            email: email,
            userName: email,
            password: password,
        };

        try {
            const response = await fetch(
                (process.env.NEXT_PUBLIC_AUTH_BASE_URL ??
                    "http://localhost:5000") + "/api/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(inputData),
                },
            );

            if (response.ok) {
                let data = await response.json();

                localStorage.setItem("email", data.data.email);
                localStorage.setItem("userName", data.data.userName);
                localStorage.setItem("fullName", data.data.fullName);
                localStorage.setItem("id", data.data.id);

                setIsLoading(false);
                window.location.href = "/create";
            } else {
                let errorData = {
                    message: `Request failed with status: ${response.status}`,
                };
                try {
                    errorData = await response.json();
                } catch (parseError) {
                    console.error(
                        "Could not parse error response:",
                        parseError,
                    );
                }
                alert(errorData.message ?? "An unknown error occurred.");
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Login request failed:", error);
            alert(
                "Failed to connect to the server. Please check your network or try again later.",
            );
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen font-[family-name:var(--font-geist-mono)] p-8 bg-gray-100 dark:bg-gray-900">
            <LightBulbToggle />
            <div className="flex items-center justify-center overflow-hidden h-32">
                <DynamicLogo height={320} width={680} />
            </div>

            <main className="flex flex-col items-center justify-center flex-grow w-fit min-w-[32%]">
                <form
                    onSubmit={handleLogin}
                    className="flex flex-col gap-1 p-4 w-full bg-white dark:bg-gray-800 shadow-sm border border-dashed border-gray-200 dark:border-gray-600 rounded-3xl"
                >
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-gray-100">
                            Sign In To EvOC
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            Sign in to your account to continue.
                        </p>
                    </div>
                    <input
                        type="text"
                        name="email"
                        placeholder="Email/Username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 mt-4 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400"
                        required
                        disabled={isLoading}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 mb-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400"
                        required
                        disabled={isLoading}
                    />

                    <div className="flex flex-wrap gap-2 justify-between mt-2 w-full px-1">
                        <button
                            type="button"
                            className={`underline underline-offset-4 decoration-dashed text-foreground dark:text-gray-300 text-xs ${isLoading ? "pointer-events-none opacity-50" : ""}`}
                            aria-disabled={isLoading}
                            tabIndex={isLoading ? -1 : undefined}
                            onClick={() => {
                                alert(
                                    "This feature is a work in progress - Sorry for the inconvenience.",
                                );
                            }}
                        >
                            {"Recover Password"}
                        </button>
                        <Link
                            className={`underline underline-offset-4 decoration-dashed text-foreground dark:text-gray-300 text-xs ${isLoading ? "pointer-events-none opacity-50" : ""}`}
                            href="/auth/register"
                            aria-disabled={isLoading}
                            tabIndex={isLoading ? -1 : undefined}
                        >
                            {"Sign Up now ->"}
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className={`rounded-full transition-colors flex items-center justify-center bg-yellow-400 dark:bg-yellow-500 text-black dark:text-black hover:bg-yellow-50 dark:hover:bg-yellow-400 text-sm sm:text-base p-2 w-full border border-black dark:border-yellow-600 gap-2 mt-4 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : "Sign In ->"}
                    </button>
                </form>
            </main>
        </div>
    );
}
