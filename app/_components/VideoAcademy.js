"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Video, X, Youtube, Play } from "lucide-react";
import { videoLibrary } from "@/app/_data/videoLibrary";

const VideoAcademy = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    if (pathname === "/" || pathname.startsWith("/auth")) return null;

    const getCategory = () => {
        if (pathname.includes("/create/gp")) return "gp";
        if (pathname.includes("/create/pso")) return "pso";
        if (pathname.includes("/create/ml")) return "ml";
        if (pathname.includes("/create/non-gp")) return "ea";
        return null;
    };

    const currentCategory = getCategory();
    const videoData = currentCategory ? videoLibrary[currentCategory] : videoLibrary.common;

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-3 right-3 md:top-6 md:right-6 z-50 flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-bold py-2.5 px-5 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 border border-white/20"
                id="video-academy-button"
            >
                <Video size={18} />
                <span className="hidden md:inline text-sm">Video Academy</span>
            </button>

            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div 
                className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-[70] shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="p-6 border-b flex items-center justify-between bg-black text-white">
                    <div className="flex items-center gap-3">
                        <div className="bg-yellow-400 p-1.5 rounded-lg text-black">
                            <Video size={22} fill="currentColor" />
                        </div>
                        <h2 className="text-xl font-bold font-[family-name:var(--font-geist-mono)] tracking-tight text-white">
                            <span className="text-yellow-400">EVOLVE</span> Academy
                        </h2>
                    </div>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 font-[family-name:var(--font-geist-sans)]">
                    
                    <div className="mb-8">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-800 uppercase tracking-widest text-xs">
                            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                            Recommended Intro
                        </h3>
                        

                        <div className="rounded-xl overflow-hidden shadow-xl border border-gray-200 bg-black">
                            <div className="aspect-video w-full">
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${videoData.featured.id}`}
                                    title={videoData.featured.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <div className="p-4 bg-white">
                                <h4 className="font-bold text-gray-900 text-sm mb-1">{videoData.featured.title}</h4>
                                <p className="text-xs text-gray-500 mb-2">{videoData.featured.channel}</p>
                                <p className="text-xs text-gray-600 leading-relaxed">{videoData.featured.description}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 text-center">
                            <h4 className="font-bold text-gray-900 mb-2">Want to learn more?</h4>
                            <p className="text-sm text-gray-600 mb-4">
                                Explore more tutorials and advanced concepts on YouTube.
                            </p>
                            <a 
                                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(videoData.searchQuery)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-[#FF0000] text-white hover:bg-[#D90000] px-6 py-3 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <Youtube size={18} />
                                Search on YouTube
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default VideoAcademy;
