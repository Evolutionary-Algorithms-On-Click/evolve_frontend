export default function Loader({ type, message }) {
    switch (type) {
        case "full":
            return (
                <main className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="w-12 h-12 border-4 border-t-transparent border-teal-600 rounded-full animate-spin" />
                    <p className="text-sm mt-4 text-teal-700 font-semibold">{message}</p>
                </main>
            );

        default:
            return (
                <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-t-transparent border-teal-600 rounded-full animate-spin" />
                    <p className="text-sm ml-2 text-teal-700">{message}</p>
                </div>
            );
    }
}
