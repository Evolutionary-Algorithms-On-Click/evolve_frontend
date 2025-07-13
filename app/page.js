"use client";

import { BookUp2, Pickaxe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
    useEffect(() => {
        // Check if user is already logged in
        if (localStorage.getItem("id")) {
            window.location.href = "/create";
        }
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-between p-8 sm:p-20 bg-background font-[family-name:var(--font-geist-mono)]">
            <main className="flex flex-col items-center gap-6 flex-grow justify-center">
                <div className="flex items-center justify-center overflow-hidden h-40">
                    <Image
                        src="/LOGO.png"
                        alt="EVOLVE OnClick logo"
                        height={360}
                        width={720}
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center font-bold">
                    <Link
                        className="rounded-full border border-solid border-black transition-colors flex items-center justify-center bg-background text-foreground gap-2 hover:bg-gray-100 text-sm sm:text-base p-4 w-full md:w-fit h-12"
                        href="/auth"
                    >
                        <Pickaxe size={24} />
                        Get Started
                    </Link>
                    <Link
                        className="rounded-full transition-colors flex items-center justify-center bg-yellow-400 text-black hover:bg-yellow-50 text-sm sm:text-base h-12 p-4 w-full md:w-fit border border-black gap-2"
                        href="https://evolutionary-algorithms-on-click.github.io/user_docs/"
                        target="_blank"
                    >
                        <BookUp2 size={24} />
                        Read our docs
                    </Link>
                </div>
            </main>
            <footer className="flex gap-6 flex-wrap items-center justify-center py-4">
                <Link
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-foreground"
                    href="https://github.com/orgs/Evolutionary-Algorithms-On-Click/repositories"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        aria-hidden
                        src="/org.jpg"
                        alt="Globe icon"
                        width={30}
                        height={30}
                        className="rounded-full"
                    />
                    Source Code →
                </Link>
            </footer>
        </div>
    );
}
