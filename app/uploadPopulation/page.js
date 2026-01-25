"use client";

import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { env } from "next-runtime-env";

export default function UploadPage() {
    useEffect(() => {
        if (!localStorage.getItem("id")) {
            window.location.href = "/auth";
            return;
        }
    }, []);

    const [file, setFile] = useState(null);
    const [response, setResponse] = useState(null);

    const onDrop = (acceptedFiles) => {
        setFile(acceptedFiles[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            alert("Please select a file first!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(
                (env("NEXT_PUBLIC_BACKEND_BASE_URL") ??
                    "http://localhost:5002") + "/api/unpickleFile/",
                {
                    method: "POST",
                    headers: {
                        accept: "application/json",
                    },
                    body: formData,
                },
            );

            const data = await res.json();
            setResponse(data?.data);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "application/octet-stream": [".pkl"] },
    });

    return (
        <main className="items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-mono)] p-8">
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4">
                    Evolve OnClick Unpickler
                </h1>
                <p className="text-center">
                    View Pickled Population on your Browser.
                </p>
            </div>

            <h1 className="text-2xl font-bold mb-4 mt-24">
                Upload a .pkl File
            </h1>
            <div
                {...getRootProps()}
                className={`border-2 border-dashed p-6 rounded-lg ${isDragActive ? "border-blue-500" : "border-gray-400"} mb-4`}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className="text-blue-500">Drop the files here...</p>
                ) : (
                    <p className="text-gray-600">
                        Drag 'n' drop a .pkl file here, or click to select one
                    </p>
                )}
            </div>

            {file && (
                <div className="mb-4">
                    <p className="text-gray-800">
                        Selected File: <strong>{file.name}</strong>
                    </p>
                </div>
            )}

            <button
                onClick={handleSubmit}
                className="bg-black text-white py-2 px-4 rounded"
            >
                Upload
            </button>

            {response && (
                <div className="mt-14">
                    <h2 className="font-bold">Population:</h2>
                    <CodeMirror
                        value={
                            "{\n" +
                            response.map((x, i) => `\t[${x.toString()}]\n`) +
                            "\n}"
                        }
                        width="1200px"
                        extensions={[json()]}
                        readOnly
                        theme="dark"
                    />
                </div>
            )}
        </main>
    );
}
