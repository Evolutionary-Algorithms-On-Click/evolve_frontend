"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
    useEffect(() => {
        const script = document.createElement("script");

        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen font-[family-name:var(--font-geist-mono)] p-8 bg-gray-100">
            <main className="flex flex-col items-center">
                {/* TODO: Replace with env actual vals. */}
                <div className="flex flex-row">
                    <div
                        id="g_id_onload"
                        data-client_id="GOOGLE_CLIENT_ID"
                        data-context="use"
                        data-ux_mode="redirect"
                        data-login_uri="GOOGLE_REDIRECT_URL"
                        data-itp_support="true"
                    ></div>

                    <div
                        className="g_id_signin"
                        data-type="standard"
                        data-shape="pill"
                        data-theme="outline"
                        data-text="continue_with"
                        data-size="large"
                        data-logo_alignment="left"
                    ></div>
                </div>

                <p className="text-sm text-foreground mt-2">
                    We only support Google for a simple, secure login.
                </p>

                <div className="flex flex-wrap gap-4 justify-center mt-8">
                    <Link
                        className="flex items-center gap-2 underline underline-offset-4 decoration-dashed text-foreground"
                        href="/create"
                    >
                        I want to experiment first →
                    </Link>
                </div>
            </main>
        </div>
    );
}
