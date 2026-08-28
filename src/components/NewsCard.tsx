import React from 'react';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { NewsItem } from '../types';

export const NewsCard: React.FC<{
  item: NewsItem;
  onReadMore?: (item: NewsItem) => void;
}> = ({ item, onReadMore }) => {
  return (
    <article className="group bg-white rounded-2xl border border-slate-200/80 hover:border-teal-300 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between">
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-md text-teal-800 text-xs font-bold shadow-xs flex items-center gap-1">
          <Tag className="w-3 h-3 text-teal-600" />
          <span>{item.category}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-slate-500 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              {item.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {item.readTime}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2 leading-snug">
            {item.title}
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
            {item.shortDescription}
          </p>
        </div>

        {/* Read More button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 truncate max-w-[150px]">
            By {item.author}
          </span>
          <button
            type="button"
            onClick={() => onReadMore && onReadMore(item)}
            className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors group-hover:translate-x-1 duration-200"
          >
            <span>Read More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
