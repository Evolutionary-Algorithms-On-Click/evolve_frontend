"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function VerifyOTP() {
    const [formData, setFormData] = useState({
        otp: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const email = searchParams.get("m");
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate password match
        if (formData.newPassword !== formData.confirmPassword) {
            alert("Passwords do not match. Please try again.");
            return;
        }

        setIsLoading(true);

        const inputData = {
            email: email,
            otp: formData.otp,
            new_password: formData.newPassword,
        };

        try {
            const response = await fetch(
                (process.env.NEXT_PUBLIC_AUTH_BASE_URL ??
                    "http://localhost:5000") + "/api/password/reset/verify",
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
                alert("Password reset successful!");
                setIsLoading(false);
                router.push("/auth");
            } else {
                let errorData = {
                    message: `Verification failed with status: ${response.status}`,
                };
                try {
                    errorData = await response.json();
                } catch (parseError) {
                    console.error(
                        "Could not parse error response:",
                        parseError,
                    );
                }
                alert(
                    errorData.message ?? "Invalid OTP or verification failed.",
                );
                setIsLoading(false);
            }
        } catch (error) {
            console.error("OTP Verification request failed:", error);
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
            <div className="flex flex-col flex-grow min-w-[32%] w-full md:max-w-[80%] lg:max-w-[60%] xl:max-w-[40%] mx-auto justify-center items-center align-middle">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-1 p-4 w-full bg-white shadow-sm border border-dashed border-gray-200 rounded-3xl"
                >
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold text-center">
                            Verify OTP
                        </h2>
                        <p className="text-xs text-gray-500 text-center break-words px-2">
                            {`Please enter the OTP sent to ${email ?? "your email"}.`}
                        </p>
                        <p className="text-xs text-gray-500 text-center break-words px-2 mt-2 mx-auto justify-center items-center align-middle">
                            OTP will be sent only if the email is registered. If you did not receive an OTP, please check the email ID you typed again and{" "}
                            <Link
                                href="/auth/recover"
                                className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
                            >
                                retry
                            </Link>
                            .
                        </p>
                    </div>
                    <input
                        type="text"
                        name="otp"
                        placeholder="Enter OTP"
                        value={formData.otp}
                        onChange={handleChange}
                        className="w-full p-2 mt-4 border rounded-xl"
                        required
                        pattern="\d*"
                        maxLength={6}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        disabled={isLoading}
                    />
                    <input
                        type="password"
                        name="newPassword"
                        placeholder="Enter new password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full p-2 mt-4 border rounded-xl"
                        required
                        disabled={isLoading}
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm new password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full p-2 mt-4 border rounded-xl"
                        required
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className={`rounded-full transition-colors flex items-center justify-center bg-yellow-400 text-black hover:bg-yellow-50 text-sm sm:text-base p-2 w-full border border-black gap-2 mt-4 ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        disabled={isLoading}
                    >
                        {isLoading ? "Verifying..." : "Verify OTP"}
                    </button>
                </form>
            </div>
        </div>
    );
}
