"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <button
            onClick={toggleTheme}
            className="fixed top-4 left-4 z-50 rounded-full p-2 bg-foreground/10 hover:bg-foreground/20 transition-colors duration-200 flex items-center justify-center"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
            {theme === "dark" ? (
                <Sun size={24} className="text-yellow-400" />
            ) : (
                <Moon size={24} className="text-gray-700" />
            )}
        </button>
    );
}
