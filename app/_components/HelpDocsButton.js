"use client";

import { usePathname } from "next/navigation";
import { BookOpen, BookUp2, ExternalLink } from "lucide-react";
const HelpDocsButton = () => {
    const pathname = usePathname();
    if (pathname === "/") return null;
    return (
    <a
    href="https://evolutionary-algorithms-on-click.github.io/user_docs/user-guide/ea-run.html"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 border-2 border-black"
    id="help-docs-button"
    >
    <BookUp2 size={20} />
    <span className="hidden md:inline">Read our docs</span>
    
    <ExternalLink size={16} className="opacity-70" />
    </a>
    );
};

export default HelpDocsButton;
