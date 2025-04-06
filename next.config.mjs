/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        domains: ["localhost", "github.com"],
        // remotePatterns: [
        //     {
        //         protocol: "http",
        //         hostname: "localhost",
        //         port: "8000",
        //         pathname: "/.*",
        //         search: "",
        //     },
        //     {
        //         protocol: "https",
        //         hostname: "github.com",
        //         port: "",
        //         pathname: "/.*",
        //         search: "",
        //     },
        // ],
    },
};

export default nextConfig;
