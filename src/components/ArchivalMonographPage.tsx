import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Check, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  Eye, 
  ShieldCheck, 
  Printer, 
  ChevronLeft, 
  ChevronRight,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import { ArchivalEventData } from '../data/archivalEvents';

interface ArchivalMonographPageProps {
  event: ArchivalEventData;
  onPrevPage?: () => void;
  onNextPage?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export const ArchivalMonographPage: React.FC<ArchivalMonographPageProps> = ({
  event,
  onPrevPage,
  onNextPage,
  hasPrev = false,
  hasNext = false
}) => {
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'document' | 'photos' | 'details'>('document');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [inputUrl, setInputUrl] = useState('');

  // Load custom saved image from localStorage if any
  useEffect(() => {
    const saved = localStorage.getItem(`gyf_archival_img_${event.id}`);
    if (saved) {
      setCustomImage(saved);
    } else {
      setCustomImage(null);
    }
  }, [event.id]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (eventReader) => {
      const result = eventReader.target?.result as string;
      if (result) {
        setCustomImage(result);
        localStorage.setItem(`gyf_archival_img_${event.id}`, result);
      }
      setIsUploading(false);
      setShowUploadModal(false);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    setCustomImage(inputUrl.trim());
    localStorage.setItem(`gyf_archival_img_${event.id}`, inputUrl.trim());
    setInputUrl('');
    setShowUploadModal(false);
  };

  const handleResetImage = () => {
    localStorage.removeItem(`gyf_archival_img_${event.id}`);
    setCustomImage(null);
  };

  const currentDisplayImage = customImage || event.image;

  // Render the photo montage depending on layoutType
  const renderPhotoMontage = () => {
    if (customImage) {
      // User uploaded the full scanned page image or single photo
      return (
        <div className="relative border-4 border-slate-950 bg-slate-950 rounded-xs shadow-md overflow-hidden my-4 max-h-[500px]">
          <img
            src={customImage}
            alt={event.title}
            className="w-full h-auto max-h-[500px] object-contain mx-auto"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-2 right-2 px-2 py-1 bg-teal-900/90 text-teal-200 text-[10px] font-bold rounded">
            Archival Scan Applied
          </div>
        </div>
      );
    }

    const photos = event.archivalPhotos || [];
    const layout = event.layoutType;

    if (layout === 'single' || photos.length <= 1) {
      return (
        <div className="my-4">
          <div className="relative border-4 border-slate-950 bg-slate-900 rounded-xs shadow-md overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-72 sm:h-96 object-cover object-center"
              referrerPolicy="no-referrer"
            />
            {event.banners?.[0] && (
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 border-2 border-slate-950 px-3 py-1.5 text-center shadow-lg">
                <span className="text-xs sm:text-sm font-black tracking-wider text-slate-950 uppercase font-serif">
                  {event.banners[0]}
                </span>
              </div>
            )}
          </div>
          {photos[0]?.caption && (
            <p className="text-[11px] text-slate-600 italic text-center mt-2 font-serif">
              {photos[0].caption}
            </p>
          )}
        </div>
      );
    }

    if (layout === 'dual') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {photos.slice(0, 2).map((p, idx) => (
            <div key={p.id} className="space-y-1.5">
              <div className="relative border-4 border-slate-950 bg-slate-900 rounded-xs shadow-md overflow-hidden h-60 sm:h-72">
                <img
                  src={idx === 0 ? event.image : (event.galleryImages?.[0] || event.image)}
                  alt={p.caption}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {p.bannerText && (
                  <div className="absolute bottom-2 left-2 right-2 bg-white/95 border border-slate-950 px-2 py-1 text-center">
                    <span className="text-[11px] font-bold text-slate-950 uppercase font-serif line-clamp-1">
                      {p.bannerText}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-slate-600 italic leading-snug line-clamp-2 font-serif">
                {p.caption}
              </p>
            </div>
          ))}
        </div>
      );
    }

    if (layout === 'triple') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-4">
          {photos.slice(0, 3).map((p, idx) => (
            <div key={p.id} className="space-y-1">
              <div className="relative border-3 border-slate-950 bg-slate-900 rounded-xs shadow-md overflow-hidden h-48 sm:h-56">
                <img
                  src={idx === 0 ? event.image : (event.galleryImages?.[idx - 1] || event.image)}
                  alt={p.caption}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {p.bannerText && (
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-white/95 border border-slate-950 px-1.5 py-0.5 text-center">
                    <span className="text-[9px] font-bold text-slate-950 uppercase font-serif line-clamp-1">
                      {p.bannerText}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-[9px] text-slate-600 italic leading-tight line-clamp-2 font-serif">
                {p.caption}
              </p>
            </div>
          ))}
        </div>
      );
    }

    // Quad or Penta or Hexa or Sept or Deca: Multi-photo authentic collage
    return (
      <div className="my-4 space-y-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {photos.map((p, idx) => {
            const imgSrc = idx === 0 
              ? event.image 
              : (event.galleryImages?.[(idx - 1) % (event.galleryImages.length || 1)] || event.image);

            return (
              <div key={p.id} className="space-y-1">
                <div className="relative border-2 border-slate-950 bg-slate-900 rounded-xs shadow-sm overflow-hidden h-28 sm:h-36">
                  <img
                    src={imgSrc}
                    alt={p.caption}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {p.bannerText && (
                    <div className="absolute bottom-1 left-1 right-1 bg-white/95 border border-slate-950 px-1 py-0.5 text-center">
                      <span className="text-[8px] font-bold text-slate-950 uppercase font-serif line-clamp-1">
                        {p.bannerText}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-[9px] text-slate-500 italic leading-tight line-clamp-2 font-serif">
                  {p.caption}
                </p>
              </div>
            );
          })}
        </div>

        {event.banners?.[0] && (
          <div className="bg-slate-100 border border-slate-300 py-1.5 px-3 text-center rounded-sm">
            <span className="text-xs font-serif font-black text-slate-900 tracking-wide uppercase">
              {event.banners[0]}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950/95 overflow-y-auto p-4 sm:p-8 flex justify-center items-start' : 'w-full'}`}>
      <div className="w-full max-w-4xl mx-auto space-y-4">
        
        {/* Navigation & Controls Bar */}
        <div className="bg-slate-900 text-white px-4 py-2.5 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-md border border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-teal-500/20 text-teal-300 text-xs font-mono font-bold">
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              <span>Report Monograph • Page {event.documentPage}</span>
            </div>
            <span className="hidden sm:inline-block text-xs text-slate-400">|</span>
            <span className="hidden sm:inline-block text-xs font-semibold text-slate-300 truncate max-w-xs">
              {event.title}
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Prev / Next Page Buttons */}
            {onPrevPage && (
              <button
                type="button"
                onClick={onPrevPage}
                disabled={!hasPrev}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-medium flex items-center gap-1 transition-colors"
                title="Previous Document Page"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden md:inline">Prev Page</span>
              </button>
            )}

            {onNextPage && (
              <button
                type="button"
                onClick={onNextPage}
                disabled={!hasNext}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-medium flex items-center gap-1 transition-colors"
                title="Next Document Page"
              >
                <span className="hidden md:inline">Next Page</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {/* Replace / Upload Picture Button */}
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-xs"
              title="Replace or upload original scan picture"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Scan</span>
            </button>

            {customImage && (
              <button
                type="button"
                onClick={handleResetImage}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-300 text-xs transition-colors"
                title="Reset to default archive photo"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Print button */}
            <button
              type="button"
              onClick={() => window.print()}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Print this archival document"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Fullscreen toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Monograph View'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* The Authentic Archival Printed Page Sheet */}
        <div className="bg-white border-2 border-slate-300 shadow-2xl rounded-xs p-6 sm:p-10 md:p-12 relative print:border-none print:shadow-none print:p-0">
          
          {/* Authentic Document Header */}
          <div className="border-b-2 border-slate-900 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-serif font-black text-xs sm:text-sm text-slate-950 tracking-wider uppercase">
                GLOBAL YOUTH FOUNDATION
              </span>
              <span className="text-slate-400">•</span>
              <span className="font-serif italic text-xs text-slate-700">
                Official Report & Action Monograph
              </span>
            </div>
            <div className="font-mono text-xs font-black text-slate-950 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded-xs">
              PAGE {event.documentPage}
            </div>
          </div>

          {/* Photographic Montage / Authentic Pictures */}
          <div className="pt-2">
            {renderPhotoMontage()}
          </div>

          {/* Authentic Document Headline */}
          <div className="my-6 text-center space-y-2">
            <h1 className="font-serif font-black text-slate-950 uppercase text-xl sm:text-2xl md:text-3xl tracking-tight leading-tight">
              {event.title}
            </h1>
            {event.subheading && (
              <p className="font-serif italic text-xs sm:text-sm font-semibold text-slate-700 max-w-2xl mx-auto">
                {event.subheading}
              </p>
            )}
          </div>

          {/* Verbatim Narrative Text (Styled with authentic editorial typography) */}
          <div className="font-serif italic text-slate-800 text-sm sm:text-base leading-relaxed space-y-4 text-justify px-1 sm:px-4">
            {event.fullDetails.split('\n\n').map((paragraph, index) => (
              <p key={index} className="indent-6 sm:indent-8">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Document Page Footer */}
          <div className="mt-10 pt-4 border-t border-slate-300 flex flex-wrap items-center justify-between text-xs text-slate-500 font-serif">
            <div className="flex items-center gap-3">
              <span><strong>Category:</strong> {event.category}</span>
              <span>•</span>
              <span><strong>Date:</strong> {event.date}</span>
              <span>•</span>
              <span><strong>Location:</strong> {event.location}</span>
            </div>
            <div className="font-mono font-bold text-slate-700">
              GYF Archive No. {event.documentPage.toString().padStart(3, '0')}
            </div>
          </div>

        </div>

      </div>

      {/* Upload/Replace Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">Upload Archival Scan</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ×
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Upload the original scan for <strong>Page {event.documentPage}: {event.title}</strong> directly from your computer or provide an image link.
            </p>

            {/* Local file upload */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Choose Image File (.jpg, .png, .webp)
              </label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl hover:border-teal-500 hover:bg-teal-50/50 cursor-pointer transition-colors p-4 text-center">
                <Upload className="w-6 h-6 text-teal-600 mb-1" />
                <span className="text-xs font-bold text-slate-700">Click to browse file</span>
                <span className="text-[11px] text-slate-400">Supports scans from smartphone or flatbed</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* URL input */}
            <form onSubmit={handleUrlSubmit} className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700">
                Or Paste Image Web URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/scan.jpg"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-teal-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors"
                >
                  Apply
                </button>
              </div>
            </form>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
