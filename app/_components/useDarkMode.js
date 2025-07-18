"use client";

import { useEffect, useState } from "react";

export function useDarkMode() {
    const [isDark, setIsDark] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Check localStorage first, then system preference
        const stored = localStorage.getItem("darkMode");
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        
        const shouldBeDark = stored !== null ? stored === "true" : systemPrefersDark;
        
        setIsDark(shouldBeDark);
        setIsLoaded(true);
        
        // Apply the class to document
        if (shouldBeDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !isDark;
        setIsDark(newDarkMode);
        localStorage.setItem("darkMode", newDarkMode.toString());
        
        if (newDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    const getLogo = () => {
        // Check if we're on the client side and if the document has the dark class
        if (typeof window !== 'undefined' && document.documentElement.classList.contains('dark')) {
            return "/LOGO-W.png";
        }
        return "/LOGO.png";
    };

    return { isDark, isLoaded, toggleDarkMode, getLogo };
} 