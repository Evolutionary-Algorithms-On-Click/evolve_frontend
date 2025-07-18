"use client";

import { BookUp2, Pickaxe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DynamicLogo from "./_components/DynamicLogo";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-between p-8 sm:p-20 bg-background dark:bg-gray-900 font-[family-name:var(--font-geist-mono)]">
            <main className="flex flex-col items-center gap-6 flex-grow justify-center">
                <div className="flex items-center justify-center overflow-hidden h-40">
                    <DynamicLogo height={360} width={720} />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center font-bold">
                    <Link
                        className="rounded-full border border-solid border-black dark:border-gray-300 transition-colors flex items-center justify-center bg-background dark:bg-gray-800 text-foreground dark:text-gray-100 gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm sm:text-base p-4 w-full md:w-fit h-12"
                        href="/auth"
                    >
                        <Pickaxe size={24} />
                        Get Started
                    </Link>
                    <Link
                        className="rounded-full transition-colors flex items-center justify-center bg-yellow-400 dark:bg-yellow-500 text-black dark:text-black hover:bg-yellow-50 dark:hover:bg-yellow-400 text-sm sm:text-base h-12 p-4 w-full md:w-fit border border-black dark:border-yellow-600 gap-2"
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
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-foreground dark:text-gray-300"
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
