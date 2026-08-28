import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Layers
} from 'lucide-react';
import { GALLERY_ITEMS } from '../data/mockData';
import { GalleryItem } from '../types';

export const GalleryGrid: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const categories = [
    'All',
    'Events',
    'Campaigns',
    'Workshops',
    'Community Work',
    'Youth Activities'
  ];

  const filteredItems = selectedCategory === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === selectedCategory);

  const openLightbox = (index: number) => {
    setActiveLightboxIndex(index);
  };

  const closeLightbox = () => {
    setActiveLightboxIndex(null);
  };

  const prevItem = () => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((activeLightboxIndex - 1 + filteredItems.length) % filteredItems.length);
  };

  const nextItem = () => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((activeLightboxIndex + 1) % filteredItems.length);
  };

  const currentItem = activeLightboxIndex !== null ? filteredItems[activeLightboxIndex] : null;

  return (
    <div className="space-y-8">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              selectedCategory === cat
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            onClick={() => openLightbox(index)}
            className="group relative rounded-2xl overflow-hidden bg-slate-900 cursor-pointer aspect-4/3 shadow-xs hover:shadow-lg transition-all duration-300 border border-slate-200/60"
          >
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 opacity-90 group-hover:opacity-100"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
            
            {/* Top Tag */}
            <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-white/80 backdrop-blur-xs text-[10px] font-bold text-slate-900">
              {item.category}
            </div>

            {/* Hover Icon */}
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-4 h-4" />
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-3 left-3 right-3 text-white space-y-0.5">
              <h4 className="text-xs font-bold truncate leading-snug">
                {item.title}
              </h4>
              <p className="text-[10px] text-slate-300 flex items-center gap-1">
                <Calendar className="w-2.5 h-2.5" /> {item.date}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {currentItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          <div 
            className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="p-4 bg-slate-950 flex items-center justify-between text-white border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
                  {currentItem.category} • {currentItem.date}
                </span>
                <h3 className="text-sm sm:text-base font-bold">
                  {currentItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeLightbox}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close Lightbox"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Image View */}
            <div className="relative max-h-[60vh] sm:max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={currentItem.url}
                alt={currentItem.title}
                className="max-h-[60vh] sm:max-h-[70vh] w-auto object-contain"
                referrerPolicy="no-referrer"
              />

              {/* Prev / Next controls */}
              <button
                type="button"
                onClick={prevItem}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={nextItem}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Caption */}
            <div className="p-4 bg-slate-950 text-slate-300 text-xs sm:text-sm border-t border-slate-800 flex justify-between items-center">
              <span>{currentItem.caption}</span>
              <span className="text-xs text-slate-500 font-mono">
                {activeLightboxIndex !== null ? activeLightboxIndex + 1 : 0} / {filteredItems.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
