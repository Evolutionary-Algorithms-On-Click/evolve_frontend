import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-4 row-start-2 items-center">
        <h1 className="text-3xl sm:text-4xl text-center font-bold">
          Evolve OnClick
        </h1>
        <p className="list-inside list-decimal text-sm text-center font-[family-name:var(--font-geist-mono)]">
          Run and Visualize algorithms with just a click.
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-black/[.08] transition-colors flex items-center justify-center bg-background text-foreground gap-2 hover:bg-[#dddddd] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/create"
          >
            <Image
              className="dark:invert"
              src="https://nextjs.org/icons/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Get Started
          </a>
          <p
            className="rounded-full transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44 flex-col bg-foreground text-background cursor-not-allowed"
          >
            Read our docs
            <span className="text-xs font-extralight">{"coming soon"}</span>
          </p>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
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
        </a>
      </footer>
    </div>
  );
}
