import React, { useState } from 'react';
import { 
  Calendar, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  MapPin, 
  Clock, 
  Users,
  CheckCircle2,
  AlertCircle,
  FolderPlus,
  Layers,
  Tag,
  BookOpen
} from 'lucide-react';
import { EventItem } from '../../types';
import { EventModal } from './EventModal';
import { Link } from 'react-router-dom';
import { GYF_CATEGORIES } from '../../data/categoryPillars';

interface AdminEventsTabProps {
  events: EventItem[];
  onCreateEvent: (e: Omit<EventItem, 'id'>) => Promise<EventItem>;
  onUpdateEvent: (id: string, updates: Partial<EventItem>) => Promise<void>;
  onDeleteEvent: (id: string) => Promise<void>;
}

export const AdminEventsTab: React.FC<AdminEventsTabProps> = ({
  events,
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Upcoming' | 'Completed' | 'Ongoing'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'byCategory' | 'flat'>('byCategory');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [presetCategory, setPresetCategory] = useState<string | undefined>(undefined);
  const [eventToDelete, setEventToDelete] = useState<EventItem | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const filteredEvents = events.filter(ev => {
    const matchesSearch = 
      ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ev.category && ev.category.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || ev.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || ev.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  }).sort((a, b) => {
    const createdA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const createdB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    if (createdA !== createdB && !isNaN(createdA) && !isNaN(createdB)) {
      return createdB - createdA;
    }
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (isNaN(dateA) && isNaN(dateB)) return 0;
    if (isNaN(dateA)) return 1;
    if (isNaN(dateB)) return -1;
    return dateB - dateA;
  });

  const handleOpenAdd = (category?: string) => {
    setEditingEvent(null);
    setPresetCategory(category);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ev: EventItem) => {
    setEditingEvent(ev);
    setPresetCategory(ev.category);
    setIsModalOpen(true);
  };

  const handleSave = async (data: any) => {
    if (editingEvent) {
      await onUpdateEvent(editingEvent.id, data);
      setActionSuccess('Event details updated successfully.');
    } else {
      await onCreateEvent(data);
      setActionSuccess(`New event published under "${data.category || 'Category'}" successfully.`);
    }
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;
    await onDeleteEvent(eventToDelete.id);
    setActionSuccess(`Event "${eventToDelete.title}" deleted.`);
    setTimeout(() => setActionSuccess(null), 4000);
    setEventToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-teal-800" />
            Events, Summits & Conventions Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize youth conferences, legal aid workshops, roundtables, and public rallies.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Toggle */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('byCategory')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'byCategory'
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>By Category</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('flat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'flat'
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>All Events</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleOpenAdd()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Event</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button 
            onClick={() => setActionSuccess(null)}
            className="text-emerald-600 hover:text-emerald-900 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search events by title, venue, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 shrink-0">
          <span className="text-xs font-bold text-slate-500 shrink-0">Status:</span>
          {(['all', 'Upcoming', 'Ongoing', 'Completed'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                statusFilter === st
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all' ? 'All Events' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Category Quick Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 p-3 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
        <span className="text-xs font-bold text-slate-500 shrink-0 pl-1">Category / Pillar:</span>
        <button
          type="button"
          onClick={() => setCategoryFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            categoryFilter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All ({events.length})
        </button>
        {GYF_CATEGORIES.map((cat) => {
          const count = events.filter(e => e.category === cat.name).length;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                categoryFilter === cat.name
                  ? 'bg-teal-700 text-white shadow-xs font-bold'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{cat.shortTitle}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-black/10">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* VIEW MODE 1: Organised BY CATEGORY PILLARS */}
      {viewMode === 'byCategory' && (
        <div className="space-y-8">
          {GYF_CATEGORIES
            .filter(cat => categoryFilter === 'all' || categoryFilter === cat.name)
            .map((category) => {
              const categoryEvents = filteredEvents.filter(e => e.category === category.name);
              return (
                <div 
                  key={category.id} 
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-5 p-6"
                >
                  {/* Category Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${category.badgeBg} ${category.badgeText}`}>
                          {category.shortTitle}
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                          {categoryEvents.length} Events Listed
                        </span>
                      </div>
                      <h3 className="text-lg font-extrabold text-slate-900">
                        {category.name}
                      </h3>
                      <p className="text-xs text-slate-500 max-w-2xl">
                        {category.tagline} • Beneficiaries: {category.beneficiaries}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenAdd(category.name)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition-all shrink-0"
                    >
                      <FolderPlus className="w-4 h-4 text-teal-700" />
                      <span>Upload Event to this Category</span>
                    </button>
                  </div>

                  {/* Category Events Grid */}
                  {categoryEvents.length === 0 ? (
                    <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                      No events matching filters under this category.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {categoryEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="relative h-40 bg-slate-100 overflow-hidden">
                              <img
                                src={ev.image}
                                alt={ev.title}
                                className="w-full h-full object-cover"
                              />
                              {ev.documentPage && (
                                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold">
                                  Doc Page {ev.documentPage}
                                </span>
                              )}
                              <span className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold text-white ${
                                ev.status === 'Upcoming' ? 'bg-teal-600/90' :
                                ev.status === 'Ongoing' ? 'bg-amber-600/90' :
                                'bg-slate-700/90'
                              }`}>
                                {ev.status || 'Completed'}
                              </span>
                            </div>

                            <div className="p-4 space-y-2.5">
                              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-semibold">
                                <span className="flex items-center gap-1 text-teal-800 font-bold">
                                  <Calendar className="w-3 h-3" />
                                  {ev.date}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1 line-clamp-1">
                                  <MapPin className="w-3 h-3 text-slate-400" />
                                  {ev.location}
                                </span>
                              </div>

                              <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                                {ev.title}
                              </h4>

                              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                {ev.description}
                              </p>
                            </div>
                          </div>

                          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-slate-500">
                              {ev.attendeesCount || ev.attendees ? `${ev.attendeesCount || ev.attendees}` : 'Archival record'}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <Link
                                to={`/events?view=monograph&page=${ev.documentPage || 2}&event=${ev.id}`}
                                target="_blank"
                                className="p-1.5 rounded-lg text-slate-600 hover:text-teal-800 hover:bg-white border border-transparent hover:border-slate-200 transition-all"
                                title="View Archival Monograph Page"
                              >
                                <BookOpen className="w-3.5 h-3.5" />
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(ev)}
                                className="p-1.5 rounded-lg text-slate-600 hover:text-teal-800 hover:bg-white border border-transparent hover:border-slate-200 transition-all"
                                title="Edit Event"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEventToDelete(ev)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all"
                                title="Delete Event"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}

      {/* VIEW MODE 2: Flat Grid of All Events */}
      {viewMode === 'flat' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 text-xs">
              No events found matching your search.
            </div>
          ) : (
            filteredEvents.map((ev) => (
              <div
                key={ev.id}
                className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img
                      src={ev.image}
                      alt={ev.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold">
                      {ev.category}
                    </span>
                    <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-xs text-white ${
                      ev.status === 'Upcoming' ? 'bg-teal-600/90' :
                      ev.status === 'Ongoing' ? 'bg-amber-600/90' :
                      'bg-slate-700/90'
                    }`}>
                      {ev.status || 'Upcoming'}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
                      <span className="flex items-center gap-1 text-teal-800 font-bold">
                        <Calendar className="w-3.5 h-3.5" />
                        {ev.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {ev.time}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {ev.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {ev.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                        <span className="truncate">{ev.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/events?view=monograph&page=${ev.documentPage || 2}&event=${ev.id}`}
                      target="_blank"
                      className="text-xs font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Monograph</span>
                    </Link>
                    <span className="text-slate-300">•</span>
                    <Link
                      to="/events"
                      target="_blank"
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                    >
                      <span>Public</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(ev)}
                      className="p-2 rounded-xl text-slate-600 hover:text-sky-800 hover:bg-sky-50 transition-colors"
                      title="Edit Event"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setEventToDelete(ev)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={editingEvent}
        defaultCategory={presetCategory}
        onSave={handleSave}
      />

      {/* Delete Confirmation Modal */}
      {eventToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Delete Event
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to delete <strong>"{eventToDelete.title}"</strong>? This will remove the event listing.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEventToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
