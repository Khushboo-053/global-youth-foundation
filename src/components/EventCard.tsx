import React from 'react';
import { Calendar, MapPin, Users, ArrowRight, FileText, Images } from 'lucide-react';
import { EventItem } from '../types';

export const EventCard: React.FC<{
  event: EventItem;
  onViewDetails?: (event: EventItem) => void;
}> = ({ event, onViewDetails }) => {
  const [cardImage, setCardImage] = React.useState<string>(event.image);

  React.useEffect(() => {
    const saved = localStorage.getItem(`gyf_archival_img_${event.id}`);
    if (saved) {
      setCardImage(saved);
    } else {
      setCardImage(event.image);
    }
  }, [event.id, event.image]);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-teal-400 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between">
      {/* Framed Image matching the official document presentation */}
      <div className="p-3 pb-0">
        <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-900 border-2 border-slate-900 rounded-xl shadow-xs">
          <img
            src={cardImage}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
          
          {/* Category Pill */}
          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-white/95 backdrop-blur-md text-slate-900 text-[11px] font-bold shadow-xs">
            {event.category}
          </span>

          {/* Document Page Badge */}
          {event.documentPage && (
            <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-950/85 backdrop-blur-md text-teal-300 text-[11px] font-mono font-semibold flex items-center gap-1 shadow-xs">
              <FileText className="w-3 h-3 text-teal-400" />
              <span>Page {event.documentPage}</span>
            </span>
          )}

          {/* Photos Count if multiple gallery images */}
          {event.galleryImages && event.galleryImages.length > 0 && (
            <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-medium flex items-center gap-1">
              <Images className="w-3 h-3 text-teal-300" />
              <span>+{event.galleryImages.length} Photos</span>
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 pt-4 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1 text-teal-700 font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              {event.date}
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 text-slate-600 line-clamp-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {event.location}
            </span>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
              {event.title}
            </h3>
            {event.subheading && (
              <p className="text-xs font-medium text-teal-700 mt-0.5 italic">
                {event.subheading}
              </p>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
            {event.description}
          </p>
        </div>

        {/* Footer info & View Details button */}
        <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
          {event.attendeesCount ? (
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <Users className="w-3.5 h-3.5 text-teal-600" />
              <span>{event.attendeesCount}+ Participants</span>
            </span>
          ) : (
            <span className="text-xs text-slate-400 italic">Official Report Event</span>
          )}

          <button
            type="button"
            onClick={() => onViewDetails && onViewDetails(event)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors ml-auto group-hover:translate-x-1 duration-200"
          >
            <span>Read Report & Photos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
