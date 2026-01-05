"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle() {
    const { theme, toggleTheme, mounted } = useTheme();

    if (!mounted) return (
        <div className="fixed top-6 right-6 p-3 rounded-full bg-background border border-foreground/10 opacity-0" />
    );

    return (
        <button
            onClick={toggleTheme}
            className="fixed top-6 right-6 p-3 rounded-full bg-background border border-foreground/10 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden z-[100] cursor-pointer"
            aria-label="Toggle Theme"
        >
            <div className="relative w-6 h-6 pointer-events-none">
                <div className={`absolute inset-0 transition-all duration-500 transform ${theme === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'}`}>
                    <Sun size={24} className="text-yellow-500" />
                </div>
                <div className={`absolute inset-0 transition-all duration-500 transform ${theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`}>
                    <Moon size={24} className="text-blue-400" />
                </div>
            </div>
            <span className="absolute inset-0 bg-foreground/5 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full pointer-events-none" />
        </button>
    );
}
