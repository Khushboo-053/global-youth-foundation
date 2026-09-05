import React from 'react';
import { 
  Layers, 
  Calendar, 
  Mail, 
  Plus, 
  ArrowRight, 
  Eye, 
  CheckCircle2, 
  Clock, 
  User, 
  ExternalLink,
  ShieldCheck,
  Users,
  HeartHandshake,
  ClipboardList,
  Camera
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Program, EventItem, ContactMessage, GrievanceRecord, DonationRecord } from '../../types';

interface AdminOverviewTabProps {
  programs: Program[];
  events: EventItem[];
  contactMessages: ContactMessage[];
  complaints: GrievanceRecord[];
  donations: DonationRecord[];
  onNavigateTab: (tab: any) => void;
  onOpenAddProgram: () => void;
  onOpenAddEvent: () => void;
  onOpenMessageModal: (msg: ContactMessage) => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  programs,
  events,
  contactMessages,
  complaints,
  donations,
  onNavigateTab,
  onOpenAddProgram,
  onOpenAddEvent,
  onOpenMessageModal
}) => {
  const totalPrograms = programs.length;
  const activePrograms = programs.filter(p => !p.status || p.status === 'Active' || p.status === 'Published').length;

  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => !e.status || e.status === 'Upcoming').length;

  const totalContactMessages = contactMessages.length;
  const unreadMessages = contactMessages.filter(m => !m.isRead).length;

  const pendingGrievances = complaints.filter(c => c.currentStatus !== 'Resolved' && c.currentStatus !== 'Closed').length;

  const { volunteerActivityReports } = useApp();
  const totalReports = volunteerActivityReports?.length || 0;
  const pendingReports = (volunteerActivityReports || []).filter(r => r.status === 'Submitted').length;
  const reportsWithPhotos = (volunteerActivityReports || []).filter(r => (r.photos && r.photos.length > 0) || r.attachmentUrl).length;

  return (
    <div className="space-y-8">
      
      {/* Primary Required Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Programs */}
        <div 
          onClick={() => onNavigateTab('programs')}
          className="cursor-pointer group p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-teal-300 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Programs Catalog
            </span>
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6 stroke-[2.2]" />
            </div>
          </div>

          <div className="my-4">
            <div className="text-4xl font-black text-slate-900 tracking-tight">
              {totalPrograms}
            </div>
            <div className="text-xs font-semibold text-teal-700 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-500 inline-block" />
              <span>{activePrograms} Active initiatives live</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-teal-700">
            <span>Manage Programs</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Total Events */}
        <div 
          onClick={() => onNavigateTab('events')}
          className="cursor-pointer group p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-sky-300 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Events & Assemblies
            </span>
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6 stroke-[2.2]" />
            </div>
          </div>

          <div className="my-4">
            <div className="text-4xl font-black text-slate-900 tracking-tight">
              {totalEvents}
            </div>
            <div className="text-xs font-semibold text-sky-700 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />
              <span>{upcomingEvents} Upcoming scheduled sessions</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-sky-700">
            <span>Manage Events</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Total Contact Messages */}
        <div 
          onClick={() => onNavigateTab('contact')}
          className="cursor-pointer group p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Contact Desk
            </span>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform relative">
              <Mail className="w-6 h-6 stroke-[2.2]" />
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white">
                  {unreadMessages}
                </span>
              )}
            </div>
          </div>

          <div className="my-4">
            <div className="text-4xl font-black text-slate-900 tracking-tight">
              {totalContactMessages}
            </div>
            <div className="text-xs font-semibold text-indigo-700 mt-1 flex items-center gap-1.5">
              {unreadMessages > 0 ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse inline-block" />
                  <span className="text-rose-600 font-bold">{unreadMessages} Unread inquiries</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 inline-block" />
                  <span>All messages up to date</span>
                </>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-indigo-700">
            <span>View All Messages</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Volunteer Field Reports & Evidence */}
        <div 
          onClick={() => onNavigateTab('volunteer-reports')}
          className="cursor-pointer group p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-amber-300 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Field Activity Reports
            </span>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform relative">
              <ClipboardList className="w-6 h-6 stroke-[2.2]" />
              {pendingReports > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white animate-pulse">
                  {pendingReports}
                </span>
              )}
            </div>
          </div>

          <div className="my-4">
            <div className="text-4xl font-black text-slate-900 tracking-tight">
              {totalReports}
            </div>
            <div className="text-xs font-semibold text-amber-800 mt-1 flex items-center gap-1.5">
              {pendingReports > 0 ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse inline-block" />
                  <span className="text-amber-700 font-bold">{pendingReports} Pending admin review</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 inline-block" />
                  <span>{reportsWithPhotos} with photo proof</span>
                </>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-amber-700">
            <span>Inspect Field Proofs</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

      {/* Quick Action Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl">
          <h3 className="text-xl font-extrabold text-white">
            Administrative Fast-Actions
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Publish new youth programs, schedule regional workshops, or inspect new inbound citizen communications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenAddProgram}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Program</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddEvent}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('contact')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-colors"
          >
            <Mail className="w-4 h-4 text-teal-300" />
            <span>Inbox ({unreadMessages})</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('volunteer-reports')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 hover:text-white text-xs font-bold border border-amber-400/30 transition-colors relative"
          >
            <Camera className="w-4 h-4 text-amber-300" />
            <span>Field Reports ({totalReports})</span>
            {pendingReports > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                {pendingReports} new
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Two Column Layout: Recent Messages & Quick Overview of Programs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Recent Contact Messages */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 space-y-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Recent Inbound Contact Messages
              </h3>
              <p className="text-xs text-slate-500">
                Direct messages submitted via the public contact form
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('contact')}
              className="text-xs font-bold text-teal-700 hover:text-teal-900"
            >
              View All ({contactMessages.length}) →
            </button>
          </div>

          {contactMessages.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
              No contact messages received yet.
            </div>
          ) : (
            <div className="space-y-3">
              {contactMessages.slice(0, 4).map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => onOpenMessageModal(msg)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                    !msg.isRead 
                      ? 'bg-teal-50/40 border-teal-200 hover:border-teal-300' 
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-900 truncate">
                        {msg.name}
                      </span>
                      {!msg.isRead && (
                        <span className="px-2 py-0.5 rounded-full bg-teal-600 text-white text-[10px] font-black uppercase">
                          New
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400">
                        {msg.dateSubmitted || 'Recent'}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-800 truncate">
                      {msg.subject}
                    </p>

                    <p className="text-xs text-slate-500 line-clamp-1">
                      {msg.message}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="shrink-0 p-2 rounded-xl bg-slate-100 hover:bg-teal-100 text-slate-600 hover:text-teal-800 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Active Programs & Upcoming Events Preview */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Programs Snippet */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-600" />
                Featured Programs ({totalPrograms})
              </h4>
              <button
                type="button"
                onClick={() => onNavigateTab('programs')}
                className="text-xs font-bold text-teal-700 hover:text-teal-900"
              >
                Manage →
              </button>
            </div>

            <div className="space-y-2.5">
              {programs.slice(0, 3).map((prog) => (
                <div key={prog.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{prog.title}</p>
                    <span className="text-[11px] text-slate-500">{prog.category}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    prog.status === 'Inactive' || prog.status === 'Draft'
                      ? 'bg-slate-200 text-slate-700'
                      : 'bg-teal-100 text-teal-800'
                  }`}>
                    {prog.status || 'Active'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Events Snippet */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-600" />
                Upcoming Events ({totalEvents})
              </h4>
              <button
                type="button"
                onClick={() => onNavigateTab('events')}
                className="text-xs font-bold text-sky-700 hover:text-sky-900"
              >
                Manage →
              </button>
            </div>

            <div className="space-y-2.5">
              {events.slice(0, 3).map((ev) => (
                <div key={ev.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{ev.title}</p>
                    <span className="text-[11px] text-slate-500">{ev.date} • {ev.location}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold shrink-0">
                    {ev.status || 'Upcoming'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Field Reports Snippet */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-teal-800" />
                Volunteer Field Reports ({totalReports})
              </h4>
              <button
                type="button"
                onClick={() => onNavigateTab('volunteer-reports')}
                className="text-xs font-bold text-teal-700 hover:text-teal-900"
              >
                Inspect All →
              </button>
            </div>

            {totalReports === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                No field reports submitted yet.
              </p>
            ) : (
              <div className="space-y-2.5">
                {volunteerActivityReports.slice(0, 3).map((rep) => (
                  <div 
                    key={rep.id} 
                    onClick={() => onNavigateTab('volunteer-reports')}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 cursor-pointer hover:border-teal-300 hover:bg-teal-50/20 transition-all"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-slate-900 truncate">{rep.title}</p>
                        {((rep.photos && rep.photos.length > 0) || rep.attachmentUrl) && (
                          <span className="inline-flex items-center text-teal-700" title="Contains attached photo evidence">
                            <Camera className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500">By {rep.volunteerName} • {rep.date}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      rep.status === 'Submitted'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {rep.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
