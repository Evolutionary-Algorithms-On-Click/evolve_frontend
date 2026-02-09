export default function formatDate(iso) {
    if (!iso) return "Unknown";
    try {
        const d = new Date(iso);
        return d.toLocaleString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch (e) {
        return iso;
    }
}
