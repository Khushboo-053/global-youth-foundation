import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Loader2, X, Link as LinkIcon } from 'lucide-react';

interface DragDropImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
}

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80';

export function DragDropImageUpload({ value, onChange, label = 'Image Cover Photo' }: DragDropImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [urlText, setUrlText] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await uploadFile(file);
        }
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
                setShowUrlInput(false);
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

    const handleUrlSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (urlText.trim()) {
            onChange(urlText.trim());
            setUrlText('');
            setShowUrlInput(false);
        }
    };

    const clearImage = () => {
        onChange('');
    };

    return (
        <div className="w-full space-y-2">
            <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    {label}
                </label>
                <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-[11px] font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer transition-colors"
                >
                    <LinkIcon className="w-3 h-3" />
                    <span>{showUrlInput ? 'Upload File' : 'Paste Image URL'}</span>
                </button>
            </div>

            {value ? (
                <div className="relative group rounded-xl border-2 border-slate-200 overflow-hidden bg-slate-100 shadow-xs">
                    <img
                        src={value}
                        alt="Cover Preview"
                        className="w-full h-36 sm:h-44 object-cover object-center"
                        onError={(e) => {
                            e.currentTarget.src = DEFAULT_FALLBACK;
                        }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5 backdrop-blur-xs">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-lg backdrop-blur-sm transition-colors cursor-pointer"
                        >
                            Upload New Photo
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowUrlInput(true)}
                            className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-lg backdrop-blur-sm transition-colors cursor-pointer"
                        >
                            Paste URL
                        </button>
                        <button
                            type="button"
                            onClick={clearImage}
                            className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg backdrop-blur-sm transition-colors cursor-pointer"
                            title="Remove cover photo"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ) : showUrlInput ? (
                <form onSubmit={handleUrlSubmit} className="p-3 bg-slate-50 border-2 border-teal-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-2">
                        <input
                            type="url"
                            placeholder="https://images.unsplash.com/photo-..."
                            value={urlText}
                            onChange={(e) => setUrlText(e.target.value)}
                            className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-600"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="px-3 py-2 text-xs font-bold bg-teal-800 text-white rounded-lg hover:bg-teal-900 transition-colors cursor-pointer"
                        >
                            Apply
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-500">Paste direct image web link (JPG, PNG, WebP) or click 'Upload File' above.</p>
                </form>
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
                        relative w-full h-36 sm:h-44 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all overflow-hidden
                        ${isDragging
                            ? 'border-teal-500 bg-teal-50/50'
                            : 'border-slate-300 hover:border-teal-400 bg-slate-50 hover:bg-slate-50/80'
                        }
                    `}
                >
                    {isUploading ? (
                        <div className="flex flex-col items-center gap-2 text-teal-700">
                            <Loader2 className="w-9 h-9 animate-spin" />
                            <span className="text-xs font-semibold">Uploading Cover Photo...</span>
                        </div>
                    ) : (
                        <>
                            <div className={`p-3 rounded-full transition-colors ${isDragging ? 'bg-teal-100 text-teal-700' : 'bg-white text-slate-400 shadow-xs'}`}>
                                {isDragging ? <UploadCloud className="w-6 h-6 animate-bounce text-teal-700" /> : <ImageIcon className="w-6 h-6 text-slate-500" />}
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-bold text-slate-800 mb-0.5">
                                    Click to upload cover photo <span className="font-normal text-slate-500">or drag and drop</span>
                                </p>
                                <p className="text-[10px] text-slate-500 font-medium bg-slate-200/60 px-2 py-0.5 rounded-full inline-block mt-1">
                                    PNG, JPG, WebP or GIF (max. 10MB)
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}

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
