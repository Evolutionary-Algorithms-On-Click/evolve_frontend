import { CircularProgress } from "@mui/material";

export default function Loader({
    type,
    message,
}) {
    switch (type) {
        case "full":
            return (
                <main className="flex flex-col items-center justify-center min-h-screen w-full">
                    <CircularProgress color="inherit" />
                    <p className="text-xs mt-4">{message}</p>
                </main>
            );

        default:
            return (
                <div className="flex items-center justify-center">
                    <CircularProgress color="inherit" />
                    <p className="text-xs ml-2">{message}</p>
                </div>
            );
    }
}