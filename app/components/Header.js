"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
    const pathname = usePathname();
    const isHome = pathname === "/";

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        if (localStorage.getItem("id")) {
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-[100] flex justify-between items-center px-6 py-4 pointer-events-none">
            <div
                className={`transition-all duration-300 pointer-events-auto ${isHome ? "opacity-0 -translate-x-4" : "opacity-100 translate-x-0"}`}
            >
                <Link
                    href={isLoggedIn ? "/create" : "/"}
                    className="flex items-center gap-2 group"
                >
                    <div className="bg-foreground text-background p-1.5 rounded-lg rotate-[-4deg] group-hover:rotate-0 transition-transform duration-200">
                        <Image
                            src="/EvOCicon.png"
                            alt="EvOC Icon"
                            width={24}
                            height={24}
                            className="invert dark:invert-0"
                        />
                    </div>
                    <span className="font-bold text-xl tracking-tight hidden sm:block">
                        EvOC
                    </span>
                </Link>
            </div>
        </header>
    );
}
