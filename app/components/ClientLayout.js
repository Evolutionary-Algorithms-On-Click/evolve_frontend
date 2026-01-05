"use client";

import { ThemeProvider } from "../contexts/ThemeContext";
import Header from "./Header";


export default function ClientLayout({ children }) {
    return (
        <ThemeProvider>
            <Header />
            {children}
        </ThemeProvider>
    );
}
