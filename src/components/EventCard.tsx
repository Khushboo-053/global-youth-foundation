import React from 'react';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { EventItem } from '../types';

export const EventCard: React.FC<{
  event: EventItem;
  onViewDetails?: (event: EventItem) => void;
}> = ({ event, onViewDetails }) => {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-teal-300 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between">
      {/* Image with date badge */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
        
        {/* Category Pill */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold shadow-xs">
          {event.category}
        </span>

        {/* Status Pill */}
        <span
          className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-bold shadow-xs ${
            event.status === 'Upcoming'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-800 text-slate-200'
          }`}
        >
          {event.status}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5 text-teal-700 font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              {event.date}
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 line-clamp-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {event.location}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
            {event.title}
          </h3>

          <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
            {event.description}
          </p>
        </div>

        {/* Footer info & View Details button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          {event.attendeesCount && (
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <Users className="w-3.5 h-3.5 text-teal-600" />
              <span>{event.attendeesCount}+ Participants</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => onViewDetails && onViewDetails(event)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors ml-auto group-hover:translate-x-1 duration-200"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
