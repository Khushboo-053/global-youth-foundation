import React from 'react';
import { Quote, MapPin, Award } from 'lucide-react';
import { Testimonial } from '../types';

export const TestimonialCard: React.FC<{ item: Testimonial }> = ({ item }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden group">
      {/* Subtle Quote Icon background */}
      <div className="absolute top-4 right-4 text-slate-100 group-hover:text-teal-50 transition-colors pointer-events-none">
        <Quote className="w-16 h-16 rotate-180 opacity-60" />
      </div>

      <div className="space-y-4 relative z-10">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 text-[11px] font-bold border border-teal-200/60">
          <Award className="w-3 h-3 text-teal-600" />
          {item.program}
        </span>

        <p className="text-sm text-slate-700 leading-relaxed italic">
          “{item.story}”
        </p>
      </div>

      {/* Author info */}
      <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100 relative z-10">
        <img
          src={item.image}
          alt={item.name}
          className="w-11 h-11 rounded-full object-cover border-2 border-teal-500/20"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div>
          <h4 className="text-sm font-bold text-slate-900 leading-tight">
            {item.name}
          </h4>
          {item.role && (
            <p className="text-xs text-teal-700 font-medium">
              {item.role}
            </p>
          )}
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span>{item.location}</span>
            <span>•</span>
            <span>{item.year}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
