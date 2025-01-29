import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-between p-8 sm:p-20 bg-background font-[family-name:var(--font-geist-mono)]">
            <main className="flex flex-col items-center gap-6 flex-grow justify-center">
                <div className="flex flex-row justify-center items-center gap-4">
                    <Image
                        src="/ewok.png"
                        alt="EVOLVE OnClick"
                        width={100}
                        height={100}
                    />
                    <h1 className="text-4xl sm:text-5xl text-center font-bold text-foreground">
                        Evolve OnClick
                    </h1>
                </div>
                <p className="text-lg text-center text-foreground">
                    Run and Visualize algorithms with just a click.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <Link
                        className="rounded-full border border-solid transition-colors flex items-center justify-center bg-background text-foreground gap-2 hover:bg-gray-100 text-sm sm:text-base px-6 py-4 sm:px-8 shadow-md"
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
                    <p className="rounded-full transition-colors flex items-center justify-center bg-foreground text-background hover:bg-gray-700 text-sm sm:text-base h-12 sm:h-14 px-6 sm:px-8 shadow-md cursor-not-allowed">
                        Read our docs
                        <span className="text-xs font-extralight ml-2">
                            {"coming soon"}
                        </span>
                    </p>
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
