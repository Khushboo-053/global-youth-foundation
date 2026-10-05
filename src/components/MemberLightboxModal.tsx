import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Award, 
  Sparkles,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { LeadershipMember } from '../types';

interface MemberLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: LeadershipMember[];
  initialIndex?: number;
}

export const MemberLightboxModal: React.FC<MemberLightboxModalProps> = ({
  isOpen,
  onClose,
  members,
  initialIndex = 0
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex >= 0 && initialIndex < members.length ? initialIndex : 0);
    }
  }, [isOpen, initialIndex, members.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : members.length - 1));
  }, [members.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < members.length - 1 ? prev + 1 : 0));
  }, [members.length]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrev, handleNext, onClose]);

  if (!isOpen || members.length === 0) return null;

  const currentMember = members[currentIndex] || members[0];

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 overflow-hidden animate-in fade-in duration-200 text-white select-none"
      onClick={onClose}
    >
      {/* Top Header Bar */}
      <div 
        className="flex items-center justify-between z-10 bg-slate-900/60 backdrop-blur-sm p-3.5 sm:px-6 sm:py-4 rounded-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
              Youth Leadership Council
            </span>
            <span className="text-xs text-slate-300 font-mono">
              Member {currentIndex + 1} of {members.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors hidden sm:flex items-center justify-center"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/15"
            aria-label="Close Member Photo Lightbox"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div 
        className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-8 my-4 overflow-hidden relative max-w-6xl mx-auto w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation Arrow: Previous */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-900/80 hover:bg-teal-600 text-white flex items-center justify-center border border-white/20 transition-all shadow-2xl hover:scale-110 active:scale-95 cursor-pointer"
          aria-label="Previous Member Photo"
        >
          <ChevronLeft className="w-7 h-7 stroke-[2.5]" />
        </button>

        {/* Member Photo Box */}
        <div className={`relative flex items-center justify-center transition-all duration-300 ${isFullscreen ? 'max-h-[85vh] w-full' : 'max-h-[60vh] lg:max-h-[70vh] max-w-md lg:max-w-xl w-full'}`}>
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-white/20 shadow-2xl group w-full aspect-4/5 sm:aspect-square lg:aspect-4/5">
            <img
              src={currentMember.image}
              alt={currentMember.name}
              className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />
            
            {/* Tag badge on image */}
            <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-300">
              <User className="w-3.5 h-3.5" />
              <span>{currentMember.role}</span>
            </div>
          </div>
        </div>

        {/* Member Details Card */}
        {!isFullscreen && (
          <div className="bg-slate-900/80 backdrop-blur-md border border-white/15 rounded-3xl p-6 sm:p-8 max-w-md w-full text-left space-y-4 shadow-2xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5 text-teal-400" />
                <span>Youth Leadership Council</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {currentMember.name}
              </h3>

              <div className="text-sm font-bold text-teal-400">
                {currentMember.role}
              </div>

              <div className="w-12 h-0.5 bg-teal-500/40 rounded-full my-2" />

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {currentMember.bio}
              </p>
            </div>

            {/* Pagination helper & navigation inside card */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                Use ← → arrow keys to navigate
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-xs font-bold text-white transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Arrow: Next */}
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-900/80 hover:bg-teal-600 text-white flex items-center justify-center border border-white/20 transition-all shadow-2xl hover:scale-110 active:scale-95 cursor-pointer"
          aria-label="Next Member Photo"
        >
          <ChevronRight className="w-7 h-7 stroke-[2.5]" />
        </button>
      </div>

      {/* Bottom Thumbnail Strip */}
      <div 
        className="z-10 bg-slate-900/70 backdrop-blur-sm p-3 rounded-2xl border border-white/10 max-w-4xl mx-auto w-full overflow-x-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center gap-3 min-w-max px-2">
          {members.map((member, idx) => (
            <button
              key={member.id || idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`relative group rounded-xl overflow-hidden border-2 transition-all cursor-pointer flex items-center gap-2.5 p-1.5 ${
                idx === currentIndex
                  ? 'border-teal-400 bg-teal-500/20 text-white scale-105 ring-2 ring-teal-400/30'
                  : 'border-white/15 bg-white/5 text-slate-400 hover:border-white/40 hover:text-slate-200 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-10 h-10 rounded-lg object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="text-left pr-2 hidden sm:block">
                <div className="text-xs font-bold line-clamp-1">{member.name}</div>
                <div className="text-[10px] text-teal-300 opacity-90 line-clamp-1">{member.role}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
