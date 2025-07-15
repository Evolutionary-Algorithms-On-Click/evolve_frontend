"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function DynamicLogo({ height = 360, width = 720, className = "", alt = "EVOLVE OnClick logo" }) {
    const [logoSrc, setLogoSrc] = useState("/LOGO.png");
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const updateLogo = () => {
            const isDark = document.documentElement.classList.contains('dark');
            setLogoSrc(isDark ? "/LOGO-W.png" : "/LOGO.png");
        };

        // Initial check
        updateLogo();
        setIsLoaded(true);

        // Watch for theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    updateLogo();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    if (!isLoaded) {
        // Show default logo during SSR
        return (
            <Image
                src="/LOGO.png"
                alt={alt}
                height={height}
                width={width}
                className={className}
            />
        );
    }

    return (
        <Image
            src={logoSrc}
            alt={alt}
            height={height}
            width={width}
            className={className}
        />
    );
} 