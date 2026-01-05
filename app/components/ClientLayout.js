"use client";

import { ThemeProvider } from "../contexts/ThemeContext";
import ThemeToggle from "./ThemeToggle";

export default function ClientLayout({ children }) {
    return (
        <ThemeProvider>
            <ThemeToggle />
            {children}
        </ThemeProvider>
    );
}
