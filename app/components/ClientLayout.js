"use client";

import Header from "./Header";

export default function ClientLayout({ children }) {
    return (
        <>
            <Header />
            {children}
        </>
    );
}
