"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle() {
    const { theme, toggleTheme, mounted } = useTheme();

    if (!mounted)
        return (
            <div className="h-9 w-[68px] rounded-full bg-background border border-foreground/10 opacity-0" />
        );

    return (
        <div className="flex items-center">
            <button
                onClick={toggleTheme}
                className="relative h-9 w-[68px] rounded-full bg-background border-2 border-foreground hover:bg-foreground/[0.03] cursor-pointer transition-all duration-200 overflow-hidden flex items-center group shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] active:translate-y-[1px] active:shadow-none"
                aria-label="Toggle Theme"
            >
                {/* Sliding indicator */}
                <div
                    className={`absolute top-0.5 bottom-0.5 w-[28px] rounded-full transition-all duration-300 ease-in-out ${
                        theme === "light"
                            ? "left-0.5 bg-yellow-400 border border-black"
                            : "left-[35.5px] bg-blue-500 border border-white/20"
                    }`}
                />

                {/* Icons */}
                <div className="relative flex items-center justify-between w-full px-2 z-10 pointer-events-none">
                    <Sun
                        size={14}
                        strokeWidth={2.5}
                        className={`transition-all duration-300 ${theme === "light" ? "text-black" : "text-foreground/30"}`}
                    />
                    <Moon
                        size={14}
                        strokeWidth={2.5}
                        className={`transition-all duration-300 ${theme === "dark" ? "text-white" : "text-foreground/30"}`}
                    />
                </div>
            </button>
        </div>
    );
}
