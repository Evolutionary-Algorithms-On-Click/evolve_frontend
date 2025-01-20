import Link from "next/link";

export default function ChooseGpOrNotGp() {
    return (
        <main className="flex items-center justify-center min-h-screen font-[family-name:var(--font-geist-mono)] p-8">
            <div className="text-center">
                <div className="flex flex-wrap mt-16 gap-4 justify-center">
                    <Link
                        href="/create/non-gp"
                        className="rounded-full border border-solid border-black/[.08] transition-colors flex items-center justify-center bg-background text-foreground gap-2 hover:bg-[#dddddd] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                    >
                        Skip
                    </Link>
                    <Link
                        href="/create/gp"
                        className="rounded-full border border-solid border-black/[.08] transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#dddddd] hover:text-foreground text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                    >
                        I want to use Genetic Programming →
                    </Link>
                </div>
            </div>
        </main>
    );
}
