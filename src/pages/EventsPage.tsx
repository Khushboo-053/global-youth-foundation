import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Tag, 
  CheckCircle2, 
  Sparkles, 
  Filter 
} from 'lucide-react';
import { EVENTS } from '../data/mockData';
import { EventItem } from '../types';
import { EventCard } from '../components/EventCard';
import { Modal } from '../components/Modal';

export const EventsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const categories = ['All', 'Workshop', 'Campaign', 'Peacebuilding', 'Environment', 'Outreach', 'Leadership'];

  const filteredEvents = activeCategory === 'All'
    ? EVENTS
    : EVENTS.filter(e => e.category === activeCategory);

  const upcomingEvents = filteredEvents.filter(e => e.status === 'Upcoming');
  const completedEvents = filteredEvents.filter(e => e.status === 'Completed');

  return (
    <div id="events-page" className="min-h-screen bg-slate-50 text-slate-800">
      
      {/* Header */}
      <section className="bg-slate-900 text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 opacity-95" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
            Youth Assemblies & Fieldwork
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Events, Campaigns & Workstreams
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Discover upcoming civic gatherings, past community campaigns, and open youth leadership workshops.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Category Filter */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Upcoming Section */}
          {upcomingEvents.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-2xl font-bold text-slate-900">Upcoming Events</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((ev) => (
                  <EventCard 
                    key={ev.id} 
                    event={ev} 
                    onViewDetails={(e) => setSelectedEvent(e)} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* Past / Completed Section */}
          {completedEvents.length > 0 && (
            <div className="space-y-6 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-slate-400" />
                <h2 className="text-2xl font-bold text-slate-900">Completed Campaigns & Fieldwork</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {completedEvents.map((ev) => (
                  <EventCard 
                    key={ev.id} 
                    event={ev} 
                    onViewDetails={(e) => setSelectedEvent(e)} 
                  />
                ))}
              </div>
            </div>
          )}

          {filteredEvents.length === 0 && (
            <div className="p-12 text-center text-slate-500 bg-slate-50 rounded-2xl">
              No events found in this category.
            </div>
          )}

        </div>
      </section>

      {/* Modal */}
      <Modal
        isOpen={selectedEvent !== null}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.title || 'Event Docket'}
        maxWidth="lg"
      >
        {selectedEvent && (
          <div className="space-y-4">
            <img
              src={selectedEvent.image}
              alt={selectedEvent.title}
              className="w-full h-56 object-cover rounded-xl"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded bg-teal-50 text-teal-800 font-bold">
                {selectedEvent.category}
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-medium">
                {selectedEvent.date}
              </span>
              {selectedEvent.time && (
                <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-medium">
                  {selectedEvent.time}
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500 font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>{selectedEvent.location}</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {selectedEvent.fullDetails || selectedEvent.description}
            </p>
            <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              <Link
                to="/membership"
                className="px-4 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-lg"
              >
                Volunteer for This Event
              </Link>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
