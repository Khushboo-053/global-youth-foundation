import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Users, 
  CheckCircle2, 
  BookOpen,
  FileText,
  Images,
  Award,
  Grid,
  Layers,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Tag,
  BookmarkCheck
} from 'lucide-react';
import { EVENTS } from '../data/mockData';
import { ARCHIVAL_EVENTS, ArchivalEventData } from '../data/archivalEvents';
import { EventItem } from '../types';
import { EventCard } from '../components/EventCard';
import { ArchivalMonographPage } from '../components/ArchivalMonographPage';
import { Modal } from '../components/Modal';
import { useApp } from '../context/AppContext';
import { GYF_CATEGORIES } from '../data/categoryPillars';

export const EventsPage: React.FC = () => {
  const { events } = useApp();
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [gridGrouping, setGridGrouping] = useState<'byCategory' | 'flat'>('byCategory');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'grid' | 'monograph'>('grid');
  const [monographPageIndex, setMonographPageIndex] = useState<number>(0);
  const [modalMode, setModalMode] = useState<'details' | 'documentPage'>('documentPage');

  const allEventsList = [...((events && events.length > 0) ? events : EVENTS)].sort((a, b) => {
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

  useEffect(() => {
    const eventParam = searchParams.get('event');
    const categoryParam = searchParams.get('category');
    const viewParam = searchParams.get('view');
    const pageParam = searchParams.get('page');

    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
    if (viewParam === 'monograph') {
      setViewMode('monograph');
      if (pageParam) {
        const pageNum = parseInt(pageParam, 10);
        const targetIndex = ARCHIVAL_EVENTS.findIndex(e => e.documentPage === pageNum);
        if (targetIndex !== -1) {
          setMonographPageIndex(targetIndex);
        }
      }
    }
    if (eventParam) {
      const found = allEventsList.find(e => e.id === eventParam);
      if (found) {
        setSelectedEvent(found);
      }
    }
  }, [searchParams, allEventsList]);

  const filteredEvents = activeCategory === 'All'
    ? allEventsList
    : allEventsList.filter(e => e.category === activeCategory);

  const completedEvents = filteredEvents;

  const handleOpenEvent = (event: EventItem) => {
    setSelectedEvent(event);
    setActiveImageIndex(0);
  };

  const currentGalleryImages = selectedEvent ? [
    selectedEvent.image,
    ...(selectedEvent.galleryImages || [])
  ] : [];

  // Match selected event to archival event data if available
  const selectedArchivalData: ArchivalEventData = selectedEvent 
    ? (ARCHIVAL_EVENTS.find(e => e.id === selectedEvent.id || e.documentPage === selectedEvent.documentPage) || {
        ...selectedEvent,
        documentPage: selectedEvent.documentPage || 2,
        layoutType: 'single',
        banners: [],
        archivalPhotos: [{ id: 'p1', caption: selectedEvent.title }]
      } as ArchivalEventData)
    : ARCHIVAL_EVENTS[0];

  return (
    <div id="events-page" className="min-h-screen bg-slate-50 text-slate-800">
      
      {/* Header */}
      <section className="bg-slate-900 text-white py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 opacity-95" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Official Global Youth Foundation Archives • 17 Archival Reports</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Archival Reports & Historic Fieldwork
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            All 17 official documented reports from the Global Youth Foundation publication, including verbatim narratives, archival photographic records, and historical field dispatches.
          </p>

          {/* Mode Switcher */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <div className="inline-flex p-1 bg-slate-800/80 backdrop-blur-md rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span>Archive Grid Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('monograph')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'monograph'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Official Monograph Reader (Pages 2–18)</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* View 1: Monograph Reader Mode */}
      {viewMode === 'monograph' && (
        <section className="py-12 bg-slate-100 border-b border-slate-300">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            
            {/* Monograph Top Page Selector */}
            <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Jump to Document Page:
                </span>
                <select
                  value={monographPageIndex}
                  onChange={(e) => setMonographPageIndex(Number(e.target.value))}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-slate-50 text-slate-800 focus:outline-none focus:border-teal-500"
                >
                  {ARCHIVAL_EVENTS.map((ev, idx) => (
                    <option key={ev.id} value={idx}>
                      Page {ev.documentPage}: {ev.title.slice(0, 38)}...
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMonographPageIndex(prev => Math.max(0, prev - 1))}
                  disabled={monographPageIndex === 0}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                <span className="text-xs font-mono font-bold text-slate-600 px-2">
                  {monographPageIndex + 1} of {ARCHIVAL_EVENTS.length}
                </span>
                <button
                  type="button"
                  onClick={() => setMonographPageIndex(prev => Math.min(ARCHIVAL_EVENTS.length - 1, prev + 1))}
                  disabled={monographPageIndex === ARCHIVAL_EVENTS.length - 1}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Archival Monograph Page Component */}
            <ArchivalMonographPage
              event={ARCHIVAL_EVENTS[monographPageIndex]}
              hasPrev={monographPageIndex > 0}
              hasNext={monographPageIndex < ARCHIVAL_EVENTS.length - 1}
              onPrevPage={() => setMonographPageIndex(prev => Math.max(0, prev - 1))}
              onNextPage={() => setMonographPageIndex(prev => Math.min(ARCHIVAL_EVENTS.length - 1, prev + 1))}
            />
          </div>
        </section>
      )}

      {/* View 2: Archive Grid Cards */}
      {viewMode === 'grid' && (
        <section className="py-12 lg:py-16 bg-slate-50/50 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            
            {/* Category Filter & Layout Options */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-teal-700" />
                    <span>Filter by Thematic Category / Pillar</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select a pillar to explore specialized grassroot initiatives and interventions.
                  </p>
                </div>

                {/* Grouping switch when All is active */}
                {activeCategory === 'All' && (
                  <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0">
                    <button
                      type="button"
                      onClick={() => setGridGrouping('byCategory')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        gridGrouping === 'byCategory'
                          ? 'bg-teal-800 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Group by Category</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setGridGrouping('flat')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        gridGrouping === 'flat'
                          ? 'bg-teal-800 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Grid className="w-3.5 h-3.5" />
                      <span>Unified Grid</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveCategory('All')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeCategory === 'All'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>All Categories</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeCategory === 'All' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {allEventsList.length}
                  </span>
                </button>

                {GYF_CATEGORIES.map((cat) => {
                  const count = allEventsList.filter(e => e.category === cat.name).length;
                  const isActive = activeCategory === cat.name;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.name)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                        isActive
                          ? 'bg-teal-700 text-white shadow-xs'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <span>{cat.shortTitle}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : `${cat.badgeBg} ${cat.badgeText}`
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Selected Category Banner */}
            {activeCategory !== 'All' && (() => {
              const currentCat = GYF_CATEGORIES.find(c => c.name === activeCategory);
              if (!currentCat) return null;
              return (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${currentCat.badgeBg} ${currentCat.badgeText}`}>
                      Official Pillar
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {filteredEvents.length} Archival Initiatives Documented
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      {currentCat.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-teal-800 font-semibold mt-1">
                      {currentCat.tagline} • Target: {currentCat.beneficiaries}
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
                    {currentCat.description}
                  </p>
                </div>
              );
            })()}

            {/* CASE 1: Grouped by Category View when 'All' is selected */}
            {activeCategory === 'All' && gridGrouping === 'byCategory' && (
              <div className="space-y-12">
                {GYF_CATEGORIES.map((cat) => {
                  const categoryEvents = allEventsList.filter(e => e.category === cat.name);
                  if (categoryEvents.length === 0) return null;
                  return (
                    <div key={cat.id} className="space-y-6">
                      {/* Section Header */}
                      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-3 border-b-2 border-slate-200">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${cat.badgeBg} ${cat.badgeText}`}>
                              {cat.shortTitle}
                            </span>
                            <span className="text-xs font-semibold text-slate-400">
                              {categoryEvents.length} Documented Events
                            </span>
                          </div>
                          <h3 className="text-lg sm:text-xl font-black text-slate-900">
                            {cat.name}
                          </h3>
                          <p className="text-xs text-slate-500">
                            {cat.tagline}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setActiveCategory(cat.name)}
                          className="text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors shrink-0"
                        >
                          Focus on this category →
                        </button>
                      </div>

                      {/* Event Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categoryEvents.map((ev) => (
                          <EventCard 
                            key={ev.id} 
                            event={ev} 
                            onViewDetails={handleOpenEvent} 
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* CASE 2: Flat Grid or Filtered Category Grid */}
            {(activeCategory !== 'All' || gridGrouping === 'flat') && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((ev) => (
                  <EventCard 
                    key={ev.id} 
                    event={ev} 
                    onViewDetails={handleOpenEvent} 
                  />
                ))}
              </div>
            )}

            {filteredEvents.length === 0 && (
              <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-dashed border-slate-200">
                No events found in this category.
              </div>
            )}

          </div>
        </section>
      )}

      {/* Modal with Authentic Multi-Picture Gallery & Verbatim Text */}
      <Modal
        isOpen={selectedEvent !== null}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent ? `Document Page ${selectedEvent.documentPage}: ${selectedEvent.title}` : 'Archival Event Report'}
        maxWidth="2xl"
      >
        {selectedEvent && (
          <div className="space-y-4">
            
            {/* View Mode Switch in Modal */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setModalMode('documentPage')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    modalMode === 'documentPage'
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Official Monograph Sheet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalMode('details')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    modalMode === 'details'
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Images className="w-3.5 h-3.5" />
                  <span>Photo & Details View</span>
                </button>
              </div>

              {selectedEvent.documentPage && (
                <span className="text-xs font-mono font-bold text-slate-500">
                  Page {selectedEvent.documentPage} of 18
                </span>
              )}
            </div>

            {modalMode === 'documentPage' ? (
              <ArchivalMonographPage event={selectedArchivalData} />
            ) : (
              <div className="space-y-4">
                {/* Primary Framed Photo */}
                <div className="relative overflow-hidden bg-slate-950 border-4 border-slate-900 rounded-xl shadow-md">
                  <img
                    src={currentGalleryImages[activeImageIndex] || selectedEvent.image}
                    alt={selectedEvent.title}
                    className="w-full h-64 sm:h-80 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                  {selectedEvent.documentPage && (
                    <div className="absolute bottom-3 left-3 px-3 py-1 rounded bg-slate-900/90 backdrop-blur-md text-teal-300 text-xs font-mono font-medium flex items-center gap-1.5 border border-slate-700/60">
                      <FileText className="w-3.5 h-3.5 text-teal-400" />
                      <span>Archival Monograph: Page {selectedEvent.documentPage}</span>
                    </div>
                  )}
                </div>

                {/* Photo Gallery Thumbnails */}
                {currentGalleryImages.length > 1 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      <Images className="w-3.5 h-3.5 text-teal-600" />
                      <span>Event Photo Documentation ({currentGalleryImages.length} images)</span>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {currentGalleryImages.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                            activeImageIndex === idx
                              ? 'border-teal-600 ring-2 ring-teal-500/20 shadow-xs'
                              : 'border-slate-200 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subheading */}
                {selectedEvent.subheading && (
                  <div className="p-3 bg-teal-50/60 border border-teal-100 rounded-lg text-teal-900 text-xs font-semibold flex items-center gap-2">
                    <Award className="w-4 h-4 text-teal-700 shrink-0" />
                    <span>{selectedEvent.subheading}</span>
                  </div>
                )}

                {/* Metadata Pills */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded bg-teal-50 text-teal-800 font-bold border border-teal-200/50">
                    {selectedEvent.category}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {selectedEvent.date}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-medium flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {selectedEvent.location}
                  </span>
                  {selectedEvent.attendeesCount && (
                    <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-medium flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      {selectedEvent.attendeesCount}+ Participants
                    </span>
                  )}
                </div>

                {/* Official Verbatim Report Content */}
                <div className="pt-2 text-sm text-slate-700 leading-relaxed space-y-3 whitespace-pre-line border-t border-slate-100 font-serif">
                  {selectedEvent.fullDetails || selectedEvent.description}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500 italic">
                Global Youth Foundation • Official Monograph Archive
              </span>
              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Close
                </button>
                <Link
                  to="/membership"
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
                >
                  Support or Join Initiative
                </Link>
              </div>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

