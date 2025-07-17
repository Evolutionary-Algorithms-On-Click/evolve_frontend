"use client";

import { useDarkMode } from "./useDarkMode";
import { useState, useRef, useEffect } from "react";

export default function LightBulbToggle() {
    const { isDark, isLoaded, toggleDarkMode } = useDarkMode();
    const [isPulling, setIsPulling] = useState(false);
    const [isFlickering, setIsFlickering] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isCooldown, setIsCooldown] = useState(false);
    const handleRef = useRef(null);
    const startYRef = useRef(0);

    useEffect(() => {
        const handleGlobalPointerUp = () => {
            setIsDragging(false);
            setDragOffset(0);
        };

        if (isDragging) {
            document.addEventListener('pointerup', handleGlobalPointerUp);
            document.addEventListener('pointerleave', handleGlobalPointerUp);
        }

        return () => {
            document.removeEventListener('pointerup', handleGlobalPointerUp);
            document.removeEventListener('pointerleave', handleGlobalPointerUp);
        };
    }, [isDragging]);

    useEffect(() => {
        const handleGlobalPointerMove = (e) => {
            if (isDragging) {
                handlePointerMove(e);
            }
        };

        if (isDragging) {
            document.addEventListener('pointermove', handleGlobalPointerMove);
        }

        return () => {
            document.removeEventListener('pointermove', handleGlobalPointerMove);
        };
    }, [isDragging, isPulling]);

    if (!isLoaded) {
        return null;
    }

    const handlePointerDown = (e) => {
        e.preventDefault(); // Prevent text selection
        setIsDragging(true);
        startYRef.current = e.clientY;
        setDragOffset(0);
    };

    const handlePointerMove = (e) => {
        if (!isDragging || isCooldown) return;
        
        e.preventDefault(); // Prevent text selection during drag
        
        const deltaY = e.clientY - startYRef.current;
        const clampedDelta = Math.max(0, Math.min(deltaY, 20)); // Max 20px pull for shorter rope
        setDragOffset(clampedDelta);
        
        // Toggle theme if pulled beyond threshold
        if (deltaY > 12 && !isPulling && !isCooldown) {
            setIsPulling(true);
            setIsFlickering(true);
            setIsCooldown(true);
            toggleDarkMode();
            
            setTimeout(() => {
                setIsPulling(false);
            }, 300);
            
            setTimeout(() => {
                setIsFlickering(false);
            }, 500);
            
            // Cooldown period to prevent rapid changes
            setTimeout(() => {
                setIsCooldown(false);
            }, 1000);
        }
        
        // Visual feedback when approaching threshold
        if (deltaY > 8 && deltaY <= 12) {
            // Add subtle glow to indicate threshold approaching
            const handleElement = handleRef.current;
            if (handleElement) {
                handleElement.style.boxShadow = '0 0 8px rgba(251, 191, 36, 0.6)';
            }
        } else {
            const handleElement = handleRef.current;
            if (handleElement) {
                handleElement.style.boxShadow = '';
            }
        }
    };

    const handlePointerUp = (e) => {
        e.preventDefault(); // Prevent text selection
        setIsDragging(false);
        
        // Always ensure return to original position
        const handleElement = handleRef.current;
        const stringElement = document.querySelector('.light-bulb-string');
        
        // Reset handle position immediately
        if (handleElement) {
            handleElement.style.transform = 'translate(-50%, 0px)';
            handleElement.style.transition = 'transform 0.3s ease-out';
            setTimeout(() => {
                handleElement.style.transition = '';
            }, 300);
        }
        
        // Add spring-back animation for rope
        if (dragOffset > 0 && stringElement) {
            stringElement.classList.add('animate-spring-back');
            setTimeout(() => {
                stringElement.classList.remove('animate-spring-back');
            }, 300);
        }
        
        setDragOffset(0);
    };

    // Add a bounce class for the hand indicator when dragging
    const handBounceClass = isDragging ? 'animate-hand-bounce' : 'animate-pull-indicator';

    return (
        <div className="fixed top-4 right-4 z-50 select-none">
            {/* Light Bulb Container */}
            <div className="relative">
                {/* Bulb */}
                <div 
                    className={`
                        w-10 h-14 transition-all duration-300 ease-in-out relative
                        ${isDark 
                            ? 'opacity-30' 
                            : ''
                        }
                        ${isFlickering ? 'animate-flicker' : ''}
                    `}
                >
                    {/* Bulb Glass (realistic shape) */}
                    <div className={`
                        w-10 h-10 rounded-full border-2 transition-all duration-300 ease-in-out relative
                        ${isDark 
                            ? 'bg-gray-600 border-gray-500' 
                            : 'bg-yellow-300 border-yellow-400'
                        }
                    `}
                    style={{
                        boxShadow: isDark 
                            ? 'none' 
                            : '0 0 15px rgba(251, 191, 36, 0.4)'
                    }}
                    >
                        {/* Bulb Glass Reflection */}
                        <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white opacity-30" />
                        
                        {/* Bulb Filament */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className={`
                                w-1 h-1 rounded-full
                                ${isDark ? 'bg-gray-400' : 'bg-yellow-600'}
                            `} />
                        </div>
                        
                        {/* Bulb neck (curved transition to base) */}
                        <div className={`
                            absolute -bottom-1 left-1/2 transform -translate-x-1/2
                            w-6 h-2 bg-gray-300 border border-gray-400 rounded-b-full
                        `} />
                    </div>
                    
                    {/* Metallic Screw Base */}
                    <div className={`
                        absolute -bottom-3 left-1/2 transform -translate-x-1/2
                        w-5 h-3 bg-gray-400 border border-gray-500 rounded-b-full
                        flex flex-col items-center justify-center
                    `}>
                        {/* Ribbed texture */}
                        <div className="w-4 h-0.5 bg-gray-500 rounded-full mb-0.5" />
                        <div className="w-4 h-0.5 bg-gray-500 rounded-full" />
                    </div>
                </div>

                {/* Pull String - Only below the bulb */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                    {/* Pull indicator - always visible */}
                    <div
                        className={`pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-8 z-10 ${handBounceClass}`}
                        style={{ width: 16, height: 16 }}
                        aria-hidden="true"
                    >
                        {/* Up arrow indicator */}
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 14L8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            <path d="M4 8L8 4L12 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {/* Pull label */}
                        <span
                            className="block text-xs text-green-500 font-semibold mt-1 select-none"
                            style={{
                                position: 'absolute',
                                left: '50%',
                                transform: `translateX(-50%) translateY(${dragOffset}px)`,
                                transition: 'transform 0.2s',
                                whiteSpace: 'nowrap',
                                pointerEvents: 'none',
                            }}
                        >
                            pull
                        </span>
                    </div>
                    
                    <div 
                        className="light-bulb-string w-px h-12 bg-gray-400 transition-transform duration-300 ease-in-out"
                        style={{
                            transform: `scaleY(${1 + (dragOffset / 60)})`,
                            transformOrigin: 'top'
                        }}
                    />
                    
                    {/* Handle */}
                    <div 
                        ref={handleRef}
                        className={`
                            absolute -bottom-1 left-1/2 transform -translate-x-1/2
                            w-4 h-4 rounded-full cursor-grab active:cursor-grabbing transition-all duration-300 ease-in-out
                            ${isDark ? 'bg-gray-500 hover:bg-gray-400' : 'bg-yellow-400 hover:bg-yellow-300'}
                            ${isDragging ? 'scale-110' : 'scale-100'}
                        `}
                        style={{
                            transform: `translate(-50%, ${dragOffset}px)`
                        }}
                        onPointerDown={handlePointerDown}
                        onPointerUp={handlePointerUp}
                        role="button"
                        tabIndex={0}
                        aria-label="Drag to toggle theme"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setIsPulling(true);
                                setIsFlickering(true);
                                toggleDarkMode();
                                
                                setTimeout(() => {
                                    setIsPulling(false);
                                }, 300);
                                
                                setTimeout(() => {
                                    setIsFlickering(false);
                                }, 500);
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
} 