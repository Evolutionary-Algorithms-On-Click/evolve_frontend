import { BookUp2, Pickaxe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center p-8 sm:p-20 bg-background font-[family-name:var(--font-geist-mono)]">
            <main className="flex flex-col items-center flex-grow w-full max-w-3xl">
                <div className="flex flex-col items-center justify-center flex-1 w-full">
                    <div className="flex items-center justify-center overflow-hidden h-40 mb-8">
                        <Image
                            src="/LOGO.png"
                            alt="EVOLVE OnClick logo"
                            height={360}
                            width={720}
                            priority
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-center font-bold w-full max-w-md">
                        <Link
                            className="rounded-full border border-solid border-black transition-colors flex items-center justify-center bg-background text-foreground gap-2 hover:bg-gray-100 text-sm sm:text-base p-4 w-full h-12"
                            href="/auth"
                        >
                            <Pickaxe size={24} />
                            Get Started
                        </Link>
                        <Link
                            className="rounded-full transition-colors flex items-center justify-center bg-yellow-400 text-black hover:bg-yellow-50 text-sm sm:text-base h-12 p-4 w-full border border-black gap-2"
                            href="https://evolutionary-algorithms-on-click.github.io/user_docs/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <BookUp2 size={24} />
                            Read our docs
                        </Link>
                    </div>
                </div>

                <div className="mt-auto pt-12 w-full max-w-md">
                    <div className="rounded-xl border border-black/20 bg-background p-4 sm:p-5 text-center">
                        <p className="text-foreground/70 text-xs sm:text-sm mb-3">
                            Explore the foundational research behind EvOC's
                            innovative approach.
                        </p>
                        <a
                            className="text-foreground text-xs sm:text-sm underline underline-offset-4 hover:text-yellow-400"
                            href="https://dl.acm.org/doi/10.1145/3712255.3726652"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Read the Research Paper
                        </a>
                    </div>
                </div>
            </main>

            <footer className="mt-12 flex items-center justify-center py-4 w-full">
                <Link
                    className="flex items-center gap-2 text-sm text-foreground hover:underline hover:underline-offset-4"
                    href="https://github.com/orgs/Evolutionary-Algorithms-On-Click/repositories"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        aria-hidden
                        src="/org.jpg"
                        alt="Organization logo"
                        width={24}
                        height={24}
                        className="rounded-full"
                    />
                    Source Code →
                </Link>
            </footer>
        </div>
    );
}
