"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { env } from "next-runtime-env";

export default function Register() {
    const [formData, setFormData] = useState({
        username: "",
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        setIsLoading(true);

        const inputData = {
            username: formData.username,
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
        };

        try {
            const res = await fetch(
                (env("NEXT_PUBLIC_AUTH_BASE_URL") ?? "http://localhost:5000") +
                    "/api/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(inputData),
                },
            );

            if (res.ok) {
                router.push(
                    "/auth/register/verify?m=" + encodeURI(formData.email),
                );
            } else {
                let errorData = {
                    message: `Registration failed with status: ${res.status}`,
                };
                try {
                    errorData = await res.json();
                } catch (parseError) {
                    console.error(
                        "Could not parse error response:",
                        parseError,
                    );
                }
                alert(
                    errorData.message ??
                        "An unknown error occurred during registration.",
                );
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Registration request failed:", error);
            alert(
                "Failed to connect to the server. Please check your network or try again later.",
            );
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen font-[family-name:var(--font-geist-mono)] p-8 bg-background">
            <div className="flex items-center justify-center overflow-hidden h-32">
                <Image
                    src="/LOGO.png"
                    alt="EVOLVE OnClick logo"
                    height={320}
                    width={680}
                />
            </div>
            <div className="flex flex-col items-center justify-center flex-grow w-fit min-w-[32%]">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-1 p-4 w-full bg-gray-900 shadow-sm border border-dashed border-gray-700 rounded-3xl"
                >
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold text-center text-foreground">
                            Sign Up for EvOC
                        </h2>
                        <p className="text-xs text-gray-400 text-center">
                            Create your account to get started.
                        </p>
                    </div>
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full p-2 mt-4 border border-gray-600 rounded-xl bg-gray-800 text-foreground"
                        required
                        disabled={isLoading}
                    />
                    <input
                        type="text"
                        name="username"
                        placeholder="Choose an Username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full p-2 mt-4 border border-gray-600 rounded-xl bg-gray-800 text-foreground"
                        required
                        disabled={isLoading}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 mt-4 border border-gray-600 rounded-xl bg-gray-800 text-foreground"
                        required
                        disabled={isLoading}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-2 mt-4 border border-gray-600 rounded-xl bg-gray-800 text-foreground"
                        required
                        disabled={isLoading}
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full p-2 mt-4 mb-3 border border-gray-600 rounded-xl bg-gray-800 text-foreground"
                        required
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className={`rounded-full transition-colors flex items-center justify-center bg-yellow-500 text-black hover:bg-yellow-600 text-sm sm:text-base p-2 w-full border border-yellow-600 gap-2 mt-4 ${
                            isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing Up..." : "Sign Up"}{" "}
                    </button>
                </form>
                <div className="flex flex-wrap gap-4 justify-center mt-8">
                    <p className="text-gray-400 text-center">
                        Already have an account?
                    </p>
                    <Link
                        className={`flex items-center gap-2 underline underline-offset-4 decoration-dashed text-foreground ${
                            isLoading ? "pointer-events-none opacity-50" : ""
                        }`}
                        href="/auth"
                        aria-disabled={isLoading}
                        tabIndex={isLoading ? -1 : undefined}
                    >
                        Sign In →
                    </Link>
                </div>
            </div>
        </div>
    );
}
