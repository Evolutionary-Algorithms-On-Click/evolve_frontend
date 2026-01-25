"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

const notebookPathRegex = /^\/create\/custom-ea\/[^/]+\/notebook\/[^/]+$/;

export default function ClientLayout({ children }) {
    const pathname = usePathname();
    const isNotebookPage = notebookPathRegex.test(pathname);

    return (
        <>
            {!isNotebookPage && <Header />}
            {children}
        </>
    );
}
