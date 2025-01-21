import Link from "next/link";
import Image from "next/image";

export default function ChooseGpOrNotGp() {
    return (
        <main className="flex items-center justify-center min-h-screen font-[family-name:var(--font-geist-mono)] p-8 bg-gray-100">
            <div className="text-center max-w-2xl">
                <h1 className="text-3xl font-bold mb-8">Choose Your Path</h1>
                <p className="mb-8 text-lg text-gray-700">
                    Select whether you want to use Genetic Programming (GP) for
                    your project or skip it.
                </p>
                <div className="flex flex-wrap mt-8 gap-4 justify-center">
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
                <div className="mt-16">
                    <Image
                        src="/gemini_ga.jpg"
                        alt="Genetic Programming"
                        width={500}
                        height={300}
                        className="mx-auto rounded-2xl"
                    />
                </div>
                <div className="mt-16 flex flex-wrap gap-4 justify-center">
                    <Link
                        href="/"
                        className="rounded-full border border-solid border-black/[.08] transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#dddddd] hover:text-foreground text-sm sm:text-base px-4 py-2 mt-8"
                    >
                        ← Go Back
                    </Link>
                    <Link
                        href="/bin"
                        className="rounded-full border border-solid border-black/[.08] transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#dddddd] hover:text-foreground text-sm sm:text-base px-4 py-2 mt-8"
                    >
                        View Previous Runs →
                    </Link>
                </div>
            </div>
        </main>
    );
}
