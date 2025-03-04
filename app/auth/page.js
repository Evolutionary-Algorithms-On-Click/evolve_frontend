"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        const inputData = {
            email: email,
            userName: email,
            password: password,
        };

        const response = await fetch(
            (process.env.NEXT_PUBLIC_AUTH_BASE_URL ?? "http://localhost:5000") +
                "/api/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(inputData),
            },
        );

        switch (response.status) {
            case 200:
                let data = await response.json();

                localStorage.setItem("email", data.data.email);
                localStorage.setItem("userName", data.data.userName);
                localStorage.setItem("fullName", data.data.fullName);
                localStorage.setItem("id", data.data.id);

                window.location.href = "/create";

                break;
            case 400:
                let error = await response.json();
                alert(
                    error
                        ? (error.message ?? "Invalid request.")
                        : "Invalid request.",
                );
                break;
            default:
                alert("Something went wrong. Please try again later.");
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen font-[family-name:var(--font-geist-mono)] p-8 bg-gray-100">
            <div className="flex items-center justify-center overflow-hidden h-32">
                <Image
                    src="/LOGO.png"
                    alt="EVOLVE OnClick logo"
                    height={320}
                    width={680}
                />
            </div>

            <main className="flex flex-col items-center justify-center flex-grow w-fit min-w-[32%]">
                <form
                    onSubmit={handleLogin}
                    className="flex flex-col gap-1 p-4 w-full bg-white shadow-sm border border-dashed border-gray-200 rounded-3xl"
                >
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold text-center">
                            Sign In To EvOC
                        </h2>
                        <p className="text-xs text-gray-500 text-center">
                            Sign in to your account to continue.
                        </p>
                    </div>
                    <input
                        type="text"
                        name="email"
                        placeholder="Email/Username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 mt-4 border rounded-xl"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 mb-3 border rounded-xl"
                        required
                    />

                    <div className="flex flex-wrap gap-2 justify-between mt-2 w-full px-1">
                        <Link
                            className="underline underline-offset-4 decoration-dashed text-foreground text-xs"
                            href="/auth"
                        >
                            {"Recover Password"}
                        </Link>
                        <Link
                            className="underline underline-offset-4 decoration-dashed text-foreground text-xs"
                            href="/auth/register"
                        >
                            {"Sign Up now ->"}
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="rounded-full transition-colors flex items-center justify-center bg-yellow-400 text-black hover:bg-yellow-50 text-sm sm:text-base p-2 w-full border border-black gap-2 mt-4"
                    >
                        {"Sign In ->"}
                    </button>
                </form>

                <div className="flex flex-wrap gap-4 justify-center mt-8">
                    <Link
                        className="flex items-center gap-2 underline underline-offset-4 decoration-dashed text-foreground"
                        href="/create"
                    >
                        I want to experiment first →
                    </Link>
                </div>
            </main>
        </div>
    );
}
