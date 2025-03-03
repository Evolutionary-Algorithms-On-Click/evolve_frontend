"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function VerifyOTP() {
    const [otp, setOtp] = useState("");

    const email = useSearchParams().get("m");

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const inputData = {
            otp: otp,
        };

        const response = await fetch(
            (process.env.NEXT_PUBLIC_AUTH_BASE_URL ?? "http://localhost:5000") +
                "/api/register/verify",
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
                alert("Registration successful!");
                router.push("/auth");

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
            <div className="flex flex-col items-center justify-center flex-grow w-fit min-w-[32%]">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-1 p-4 w-full bg-white shadow-sm border border-dashed border-gray-200 rounded-3xl"
                >
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold text-center">
                            Verify OTP
                        </h2>
                        <p className="text-xs text-gray-500 text-center">
                            Please enter the OTP sent to {email}.
                        </p>
                    </div>
                    <input
                        type="text"
                        name="otp"
                        placeholder="OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full p-2 mt-4 border rounded-xl"
                        required
                    />
                    <button
                        type="submit"
                        className="rounded-full transition-colors flex items-center justify-center bg-yellow-400 text-black hover:bg-yellow-50 text-sm sm:text-base p-2 w-full border border-black gap-2 mt-4"
                    >
                        Verify OTP
                    </button>
                </form>
            </div>
        </div>
    );
}
