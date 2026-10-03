import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Loader2, X } from 'lucide-react';

interface DragDropImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
}

export function DragDropImageUpload({ value, onChange, label = 'Image URL' }: DragDropImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await uploadFile(file);
        }
        // Reset file input so the same file can be selected again if needed
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const uploadFile = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            alert('Image must be smaller than 10MB');
            return;
        }

        setIsUploading(true);
        try {
            const body = new FormData();
            body.append('image', file);
            const res = await fetch('/api/upload', { method: 'POST', body });
            const data = await res.json();
            if (res.ok && data.url) {
                onChange(data.url);
            } else {
                alert(data.error || 'Failed to upload image. Please try again.');
            }
        } catch (err) {
            console.error('Error uploading image:', err);
            alert('Error uploading image. Please check console.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            await uploadFile(file);
        }
    };

    const clearImage = () => {
        onChange('');
    };

    return (
        <div className="w-full">
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                {label}
            </label>

            {value ? (
                <div className="relative group rounded-xl border-2 border-slate-200 overflow-hidden bg-slate-50">
                    <img
                        src={value}
                        alt="Preview"
                        className="w-full h-32 object-cover object-center sm:h-40"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg backdrop-blur-sm transition-colors"
                        >
                            Change Photo
                        </button>
                        <button
                            type="button"
                            onClick={clearImage}
                            className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg backdrop-blur-sm transition-colors"
                            title="Remove image"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    className={`
            relative w-full h-32 sm:h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all overflow-hidden
            ${isDragging
                            ? 'border-teal-500 bg-teal-50/50'
                            : 'border-slate-300 hover:border-teal-400 bg-slate-50 hover:bg-slate-50/80'
                        }
          `}
                >
                    {isUploading ? (
                        <div className="flex flex-col items-center gap-2 text-teal-700">
                            <Loader2 className="w-10 h-10 animate-spin" />
                            <span className="text-xs font-semibold">Uploading...</span>
                        </div>
                    ) : (
                        <>
                            <div className={`p-3 rounded-full transition-colors ${isDragging ? 'bg-teal-100 text-teal-700' : 'bg-white text-slate-400 shadow-sm'}`}>
                                {isDragging ? <UploadCloud className="w-6 h-6 animate-bounce" /> : <ImageIcon className="w-6 h-6" />}
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-bold text-slate-700 mb-0.5">
                                    Click to upload <span className="font-normal text-slate-500">or drag and drop</span>
                                </p>
                                <p className="text-[10px] text-slate-400 font-medium bg-slate-200/50 px-2 py-0.5 rounded-full inline-block mt-1">
                                    SVG, PNG, JPG or GIF (max. 10MB)
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                className="hidden"
            />
        </div>
    );
}
