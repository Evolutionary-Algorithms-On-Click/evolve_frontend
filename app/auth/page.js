"use client";

import Link from "next/link";

export default function Auth() {
    return (
        <div className="flex items-center justify-center min-h-screen font-[family-name:var(--font-geist-mono)] p-8 bg-gray-100">
            <main className="flex flex-col items-center">
                {/* TODO: Add login form. */}
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
