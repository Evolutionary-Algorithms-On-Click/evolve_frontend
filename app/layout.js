import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata = {
    title: "EVOLVE OnClick",
    description: "Run and Visualize evolutionary algorithms with just a click.",
    keywords:
        "EVOLVE, EVOLVE OnClick, Evolutionary Algorithms, Genetic Algorithms, Genetic Programming, GP, GA, ML, Machine Learning, EA, GECCO, 2025",
    author: "Ritwik Murali, Ashwin Narayanan S, Abhinav R, Ananya R, Hariharan A",
    icons: {
        icon: "/evoc.ico",
        apple: "/evoc.ico",
        shortcut: "/evoc.ico",
    },
    themeColor: "#343434",
    openGraph: {
        type: "website",
        title: "EVOLVE OnClick",
        description:
            "Run and Visualize evolutionary algorithms with just a click.",
        url: "",
        images: [
            {
                url: "/evoc.png", // LinkedIn preview image
                width: 1200,
                height: 630,
                alt: "EVOLVE OnClick",
            },
        ],
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
