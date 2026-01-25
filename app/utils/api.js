// evolve_frontend/app/utils/api.js
import { env } from "next-runtime-env";

const base = env("NEXT_PUBLIC_BACKEND_BASE_URL") ?? "http://localhost:8080";

export const authenticatedFetch = async (url, options = {}) => {
    const headers = {
        ...options.headers,
        "Content-Type": "application/json",
    };

    const response = await fetch(`${base}${url}`, {
        ...options,
        credentials: "include",
        headers,
    });

    if (!response.ok) {
        const errorData = {
            message: `Request failed with status: ${response.status}`,
        };
        try {
            const errorJson = await response.json();
            errorData.message = errorJson.message || errorData.message;
        } catch (parseError) {
            console.error("Could not parse error response:", parseError);
        }
        throw new Error(errorData.message);
    }

    if (response.status === 204) {
        return;
    }

    return response.json();
};
