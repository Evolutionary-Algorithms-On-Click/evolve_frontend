import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-6 row-start-2 items-center">
                <h1 className="text-4xl sm:text-5xl text-center font-bold">
                    Evolve OnClick
                </h1>
                <p className="list-inside list-decimal text-lg text-center font-[family-name:var(--font-geist-mono)]">
                    Run and Visualize algorithms with just a click.
                </p>

                <div className="flex gap-4 items-center flex-col sm:flex-row">
                    <Link
                        className="rounded-full border border-solid transition-colors flex items-center justify-center bg-background text-foreground gap-2 hover:bg-gray-200 text-sm sm:text-base px-6 py-4 sm:px-8 shadow-lg"
                        href="/create"
                    >
                        <Image
                            className="dark:invert"
                            src="https://nextjs.org/icons/vercel.svg"
                            alt="Vercel logomark"
                            width={24}
                            height={24}
                        />
                        Get Started
                    </Link>
                    <p className="rounded-full transition-colors flex items-center justify-center bg-gray-800 text-white hover:bg-gray-700 text-sm sm:text-base h-12 sm:h-14 px-6 sm:px-8 shadow-lg cursor-not-allowed">
                        Read our docs
                        <span className="text-xs font-extralight ml-2">
                            {"coming soon"}
                        </span>
                    </p>
                </div>
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
                <Link
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
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
