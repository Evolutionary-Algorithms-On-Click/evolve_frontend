"use client";

import { MessageSquare, X, Send } from "lucide-react";

export function ChatIcon() {
    return <MessageSquare size={24} />;
}

export function CloseIcon() {
    return <X size={24} />;
}

export function SendIcon() {
    return <Send size={20} />;
}
