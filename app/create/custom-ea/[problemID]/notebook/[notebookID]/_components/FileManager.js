"use client";
import React, { useRef } from "react";
import { X, Upload, RefreshCw, FileText } from "lucide-react";

export default function FileManager({ isOpen, onClose, files, loading, error, onUpload, onRefresh }) {
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out border-l border-gray-200">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FileText size={20} className="text-teal-600" />
                    Files
                </h2>
                <div className="flex items-center gap-1">
                     <button onClick={onRefresh} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition" title="Refresh">
                        <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition" title="Close">
                        <X size={20} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}
                
                {!loading && files.length === 0 && (
                     <div className="text-center text-gray-400 py-8 flex flex-col items-center gap-2">
                        <FileText size={32} className="opacity-20" />
                        <p className="text-sm">No files uploaded yet</p>
                     </div>
                )}

                {files.map((file, idx) => {
                    const fileName = typeof file === 'string' ? file : file.filename || 'Unknown file';
                    return (
                        <div key={idx} className="p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:border-teal-100 hover:shadow-md transition flex items-center gap-3 group">
                             <div className="bg-teal-50 text-teal-600 p-2 rounded-lg">
                                <FileText size={16} />
                             </div>
                             <div className="min-w-0 flex-1">
                                 <p className="text-sm font-medium text-gray-700 truncate" title={fileName}>{fileName}</p>
                             </div>
                        </div>
                    );
                })}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-3">
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-[0.98]"
                >
                    {loading ? <RefreshCw size={18} className="animate-spin" /> : <Upload size={18} />}
                    Upload File
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={(e) => {
                        if(e.target.files?.[0]) {
                            onUpload(e.target.files[0]);
                            e.target.value = null;
                        }
                    }} 
                />
            </div>
        </div>
    );
}
