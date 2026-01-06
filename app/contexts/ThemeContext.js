"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        let savedTheme = "light";
        try {
            savedTheme = localStorage.getItem("theme") || "light";
        } catch (e) {
            console.error(e);
        }
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
        document.body.setAttribute("data-theme", savedTheme);
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        const nextTheme = theme === "light" ? "dark" : "light";
        setTheme(nextTheme);
        document.documentElement.setAttribute("data-theme", nextTheme);
        document.body.setAttribute("data-theme", nextTheme);
        try {
            localStorage.setItem("theme", nextTheme);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
