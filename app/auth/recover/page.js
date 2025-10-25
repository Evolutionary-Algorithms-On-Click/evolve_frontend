"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Recover() {
    const [formData, setFormData] = useState({
        email: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const inputData = {
            email: formData.email,
        };

        try {
            const res = await fetch(
                (process.env.NEXT_PUBLIC_AUTH_BASE_URL ??
                    "http://localhost:5000") + "/api/password/reset",
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
                router.push("recover/verify?m=" + encodeURI(formData.email));
            } else {
                let errorData = {
                    message: `Password reset failed with status: ${res.status}`,
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
                        "An unknown error occured during password reset.",
                );
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Password reset request failed:", error);
            alert(
                "Failed to connect to the server. Please check your network or try again later.",
            );
            setIsLoading(false);
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
            <div className="flex flex-col items-center justify-center flex-grow w-fit min-w-[32%]">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-1 p-4 w-full bg-white shadow-sm border border-dashed border-gray-200 rounded-3xl"
                >
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold text-center">
                            Recover Your Password
                        </h2>
                        <p className="text-xs text-gray-500 text-center">
                            Enter your email to get started.
                        </p>
                    </div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 mt-4 border rounded-xl"
                        required
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className={`rounded-full transition-colors flex items-center justify-center bg-yellow-400 text-black hover:bg-yellow-50 text-sm sm:text-base p-2 w-full border border-black gap-2 mt-4 ${
                            isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isLoading}
                    >
                        {isLoading ? "Sending OTP..." : "Send OTP"}{" "}
                    </button>
                </form>
                <div className="flex flex-wrap gap-4 justify-center mt-8">
                    <p className="text-gray-500 text-center">
                        Create a new account
                    </p>
                    <Link
                        className={`flex items-center gap-2 underline underline-offset-4 decoration-dashed text-foreground ${
                            isLoading ? "pointer-events-none opacity-50" : ""
                        }`}
                        href="/auth/register"
                        aria-disabled={isLoading}
                        tabIndex={isLoading ? -1 : undefined}
                    >
                        Sign Up now →
                    </Link>
                </div>
            </div>
        </div>
    );
}
