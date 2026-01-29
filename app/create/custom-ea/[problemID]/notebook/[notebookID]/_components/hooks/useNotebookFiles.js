import { useState, useCallback } from "react";
import { env } from "next-runtime-env";

const base = env("NEXT_PUBLIC_V2_BACKEND_BASE_URL") ?? "http://localhost:8080";

export default function useNotebookFiles(notebookId) {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchFiles = useCallback(async () => {
        if (!notebookId) return;

        setLoading(true);
        setError(null);
        try {
            const url = `${base}/api/v1/sessions/${notebookId}/files`;
            
            const res = await fetch(url, {
                credentials: "include",
            });
            
            if (!res.ok) throw new Error("Failed to fetch files");
            const data = await res.json();
            
            if (Array.isArray(data)) {
                setFiles(data);
            } else if (data.files && Array.isArray(data.files)) {
                setFiles(data.files);
            } else if (data.uploaded_files && Array.isArray(data.uploaded_files)) {
                setFiles(data.uploaded_files);
            } else {
                setFiles([]);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [notebookId]);

    const uploadFile = useCallback(async (file) => {
        if (!notebookId) return;
        setLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append("file", file, file.name);

            // Upload to the notebookId path
            const res = await fetch(`${base}/api/v1/sessions/${notebookId}/files`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || "Failed to upload file");
            }
            
            await fetchFiles(); 
        } catch (err) {
            console.error("Upload error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [notebookId, fetchFiles]);

    const deleteFile = useCallback(async (filename) => {
        if (!notebookId || !filename) return;
        setLoading(true);
        setError(null);
        try {
            const url = `${base}/api/v1/sessions/${notebookId}/files/${filename}`;
            const res = await fetch(url, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) {
                 const errorText = await res.text();
                 throw new Error(errorText || "Failed to delete file");
            }

            await fetchFiles();
        } catch (err) {
             console.error("Delete error:", err);
             setError(err.message);
        } finally {
             setLoading(false);
        }
    }, [notebookId, fetchFiles]);

    return {
        files,
        loading,
        error,
        fetchFiles,
        uploadFile,
        deleteFile
    };
}