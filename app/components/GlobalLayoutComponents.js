"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import VideoAcademy from "../_components/VideoAcademy.js";
import HelpDocsButton from "../_components/HelpDocsButton.js";

const notebookPathRegex = /^\/create\/custom-ea\/[^/]+\/notebook\/[^/]+$/;

export default function GlobalLayoutComponents() {
    const pathname = usePathname();
    const router = useRouter();
    const isNotebookPage = notebookPathRegex.test(pathname);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        if (localStorage.getItem("id")) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("id");
        localStorage.removeItem("email");
        localStorage.removeItem("jwt_token");
        // TODO: Check for cookies and clear them if necessary
        setIsLoggedIn(false);
        router.push("/");
    };

    if (isNotebookPage) {
        return null;
    }

    return (
        <>
            {isLoggedIn && (
                <div className="fixed bottom-4 left-4 z-[100] pointer-events-auto">
                    <button
                        onClick={handleLogout}
                        className="bg-white/70 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all duration-200 text-red-500 hover:text-red-700"
                        title="Logout"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                            />
                        </svg>
                    </button>
                </div>
            )}
            <VideoAcademy />
            <HelpDocsButton />
        </>
    );
}
