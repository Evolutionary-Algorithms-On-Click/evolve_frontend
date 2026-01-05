export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-2xl mb-8">Page Not Found</p>
            <a
                href="/"
                className="px-6 py-3 bg-yellow-500 text-black rounded-full hover:bg-yellow-600 transition-colors"
            >
                Go Home
            </a>
        </div>
    );
}
