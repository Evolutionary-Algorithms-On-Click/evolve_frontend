"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register() {
    const [formData, setFormData] = useState({
        username: "",
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const inputData = {
            username: formData.username,
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
        };

        const res = await fetch(
            (process.env.NEXT_PUBLIC_AUTH_BASE_URL ?? "http://localhost:5000") +
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

        switch (res.status) {
            case 200:
                router.push(
                    "/auth/register/verify?m=" + encodeURI(formData.email),
                );
                break;
            case 400:
                return res.json().then((error) => {
                    alert(
                        error
                            ? (error.message ?? "Invalid request.")
                            : "Invalid request.",
                    );
                });
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
                            Sign Up for EvOC
                        </h2>
                        <p className="text-xs text-gray-500 text-center">
                            Create your account to get started.
                        </p>
                    </div>
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full p-2 mt-4 border rounded-xl"
                        required
                    />
                    <input
                        type="text"
                        name="username"
                        placeholder="Choose an Username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full p-2 mt-4 border rounded-xl"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 mt-4 border rounded-xl"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-2 mt-4 border rounded-xl"
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full p-2 mt-4 mb-3 border rounded-xl"
                        required
                    />
                    <button
                        type="submit"
                        className="rounded-full transition-colors flex items-center justify-center bg-yellow-400 text-black hover:bg-yellow-50 text-sm sm:text-base p-2 w-full border border-black gap-2 mt-4"
                    >
                        Sign Up
                    </button>
                </form>
                <div className="flex flex-wrap gap-4 justify-center mt-8">
                    <p className="text-gray-500 text-center">
                        Already have an account?
                    </p>
                    <Link
                        className="flex items-center gap-2 underline underline-offset-4 decoration-dashed text-foreground"
                        href="/auth"
                    >
                        Sign In →
                    </Link>
                </div>
            </div>
        </div>
    );
}
