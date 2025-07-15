"use client";

import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "./useDarkMode";

export default function DarkModeToggle() {
    const { isDark, isLoaded, toggleDarkMode } = useDarkMode();

    if (!isLoaded) {
        return null; // Don't render until we've loaded the initial state
    }

    return (
        <button
            onClick={toggleDarkMode}
            className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
            aria-label="Toggle dark mode"
        >
            {isDark ? (
                <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
                <Moon className="w-5 h-5 text-gray-700" />
            )}
        </button>
    );
} 