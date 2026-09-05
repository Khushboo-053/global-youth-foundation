import React, { useState } from 'react';
import { 
  UserCheck, 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Award, 
  MapPin, 
  HeartHandshake, 
  ShieldCheck,
  Plus,
  Mail,
  Phone,
  Check,
  X,
  AlertCircle,
  ClipboardList,
  Camera
} from 'lucide-react';
import { UserAccount, VolunteerPermissions, Program, EventItem, GrievanceRecord } from '../../types';
import { VolunteerDetailModal } from './VolunteerDetailModal';
import { VolunteerAssignModal } from './VolunteerAssignModal';
import { useApp } from '../../context/AppContext';

interface AdminVolunteersTabProps {
  volunteers: UserAccount[];
  volunteerPermissions: Record<string, VolunteerPermissions>;
  programs: Program[];
  events: EventItem[];
  complaints: GrievanceRecord[];
  onUpdateStatus: (volunteerId: string, status: 'Active' | 'Inactive' | 'Approved' | 'Rejected') => Promise<void>;
  onUpdatePermissions: (volunteerId: string, perms: Partial<VolunteerPermissions>) => Promise<void>;
  onLogHours: (volunteerId: string, hours: number) => Promise<void>;
  onAssignGrievance: (complaintId: string, volunteerId: string, volunteerName: string, department?: string) => Promise<void>;
  onEditVolunteer: (volunteer: UserAccount) => void;
  onNavigateTab?: (tab: any) => void;
}

export const AdminVolunteersTab: React.FC<AdminVolunteersTabProps> = ({
  volunteers,
  volunteerPermissions,
  programs,
  events,
  complaints,
  onUpdateStatus,
  onUpdatePermissions,
  onLogHours,
  onAssignGrievance,
  onEditVolunteer,
  onNavigateTab
}) => {
  const { user, volunteerActivityReports } = useApp();
  const isAdmin = user?.role === 'admin';
  const pendingReportsCount = (volunteerActivityReports || []).filter(r => r.status === 'Submitted').length;

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'active' | 'rejected' | 'inactive'>('all');
  const [chapterFilter, setChapterFilter] = useState('all');

  const [selectedVolunteerForDetail, setSelectedVolunteerForDetail] = useState<UserAccount | null>(null);
  const [selectedVolunteerForAssign, setSelectedVolunteerForAssign] = useState<UserAccount | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Volunteer KPI metrics
  const totalVolunteers = volunteers.length;
  const activeVolunteers = volunteers.filter(v => v.isActive && v.membershipStatus === 'Volunteer').length;
  const pendingVolunteers = volunteers.filter(v => v.membershipStatus === 'Applicant').length;
  const totalServiceHours = volunteers.reduce((sum, v) => sum + (v.volunteerHours || 0), 0);

  const chapters = Array.from(new Set(volunteers.map(v => v.chapter).filter(Boolean))) as string[];

  const filteredVolunteers = volunteers.filter(vol => {
    const matchesSearch = 
      vol.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vol.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vol.phone && vol.phone.includes(searchTerm)) ||
      (vol.chapter && vol.chapter.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vol.skills && vol.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'active' && vol.isActive && vol.membershipStatus === 'Volunteer') ||
      (statusFilter === 'pending' && vol.membershipStatus === 'Applicant') ||
      (statusFilter === 'rejected' && vol.membershipStatus === 'Rejected') ||
      (statusFilter === 'inactive' && (!vol.isActive || vol.membershipStatus === 'Guest'));

    const matchesChapter = chapterFilter === 'all' || vol.chapter === chapterFilter;

    return matchesSearch && matchesStatus && matchesChapter;
  });

  const handleApprove = async (volunteerId: string, name: string) => {
    if (!isAdmin) {
      setActionSuccess('Permission Denied: Only administrators have permission to accept volunteer applications.');
      setTimeout(() => setActionSuccess(null), 4000);
      return;
    }
    await onUpdateStatus(volunteerId, 'Approved');
    setActionSuccess(`Volunteer application for "${name}" has been approved and admitted to the Active Taskforce!`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleReject = async (volunteerId: string, name: string) => {
    if (!isAdmin) {
      setActionSuccess('Permission Denied: Only administrators have permission to reject volunteer applications.');
      setTimeout(() => setActionSuccess(null), 4000);
      return;
    }
    await onUpdateStatus(volunteerId, 'Rejected');
    setActionSuccess(`Volunteer application for "${name}" has been rejected.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Stat Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-teal-800" />
            Volunteer Operations & Taskforce Roster
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage grassroots youth volunteers, delegate grievance dockets, and record field service hours.
          </p>
        </div>

        {onNavigateTab && (
          <button
            type="button"
            onClick={() => onNavigateTab('volunteer-reports')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-900 text-xs font-bold border border-teal-200 shadow-xs transition-colors shrink-0"
          >
            <Camera className="w-4 h-4 text-teal-800" />
            <span>Field Activity Reports ({volunteerActivityReports?.length || 0})</span>
            {pendingReportsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black animate-pulse">
                {pendingReportsCount} New
              </span>
            )}
          </button>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Volunteers
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {totalVolunteers}
          </div>
          <span className="text-[11px] text-teal-700 font-semibold mt-0.5 block">
            Registered volunteers
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Active Taskforce
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {activeVolunteers}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">
            Deployed in chapters
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Pending Applications
          </span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {pendingVolunteers}
          </div>
          <span className="text-[11px] text-amber-700 font-semibold mt-0.5 block">
            Awaiting screening
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Service Hours
          </span>
          <div className="text-2xl font-black text-teal-800 mt-1">
            {totalServiceHours}h
          </div>
          <span className="text-[11px] text-teal-700 font-semibold mt-0.5 block">
            Community impact hours
          </span>
        </div>
      </div>

      {/* Pending Volunteer Applications Review Notice */}
      {pendingVolunteers > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-950">
                {pendingVolunteers} Volunteer Application{pendingVolunteers > 1 ? 's' : ''} Awaiting Review
              </h4>
              <p className="text-xs text-amber-800/80">
                New candidate applications have been submitted. Review each applicant and select <strong>Accept</strong> or <strong>Reject</strong> below.
              </p>
            </div>
          </div>
          <button
            type="button"
            id="filter-pending-volunteers-btn"
            onClick={() => setStatusFilter('pending')}
            className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            Review Pending ({pendingVolunteers})
          </button>
        </div>
      )}

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button 
            onClick={() => setActionSuccess(null)}
            className="text-emerald-600 hover:text-emerald-900 text-xs font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search volunteers by name, email, skills, or chapter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-slate-500 shrink-0">Status:</span>
          {[
            { key: 'all', label: 'All Volunteers' },
            { key: 'pending', label: `Pending (${pendingVolunteers})` },
            { key: 'active', label: `Active (${activeVolunteers})` },
            { key: 'rejected', label: 'Rejected' },
            { key: 'inactive', label: 'Inactive' }
          ].map((st) => (
            <button
              key={st.key}
              type="button"
              onClick={() => setStatusFilter(st.key as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                statusFilter === st.key
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {chapters.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-500">Chapter:</span>
            <select
              value={chapterFilter}
              onChange={(e) => setChapterFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700 max-w-[180px] truncate"
            >
              <option value="all">All Chapters</option>
              {chapters.map((ch) => (
                <option key={ch} value={ch}>{ch}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Volunteer Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Volunteer</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Assigned Chapter</th>
                <th className="py-3.5 px-4">Skills & Specialization</th>
                <th className="py-3.5 px-4 text-center">Hours Logged</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredVolunteers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No volunteers found matching current criteria.
                  </td>
                </tr>
              ) : (
                filteredVolunteers.map((vol) => {
                  const perms = volunteerPermissions[vol.id];
                  const isPending = vol.membershipStatus === 'Applicant';

                  return (
                    <tr key={vol.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-teal-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {vol.fullName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 truncate block">
                              {vol.fullName}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {vol.roleTitle || 'Volunteer'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="text-slate-800 font-semibold truncate flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{vol.email}</span>
                          </div>
                          {vol.phone && (
                            <div className="text-slate-500 text-[11px] flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{vol.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                          <span className="truncate max-w-[150px]">{vol.chapter || 'Central Kashmir'}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {vol.skills && vol.skills.length > 0 ? (
                            vol.skills.slice(0, 2).map((s, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                                {s}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-[11px]">General Support</span>
                          )}
                          {vol.skills && vol.skills.length > 2 && (
                            <span className="text-[10px] text-slate-500 font-bold">
                              +{vol.skills.length - 2}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 font-black text-xs">
                          <Clock className="w-3 h-3" />
                          {vol.volunteerHours || 0}h
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {isPending ? (
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                            Pending Screening
                          </span>
                        ) : vol.membershipStatus === 'Rejected' ? (
                          <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold">
                            Rejected
                          </span>
                        ) : vol.isActive ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                            Active Taskforce
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
                            Inactive
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPending && (
                            <div className="flex items-center gap-1.5 mr-1">
                              <button
                                type="button"
                                id={`accept-vol-row-${vol.id}`}
                                onClick={() => handleApprove(vol.id, vol.fullName)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                                title="Accept Volunteer Application"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Accept</span>
                              </button>
                              <button
                                type="button"
                                id={`reject-vol-row-${vol.id}`}
                                onClick={() => handleReject(vol.id, vol.fullName)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                                title="Reject Application"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </div>
                          )}

                          {vol.membershipStatus === 'Rejected' && (
                            <div className="flex items-center gap-1 mr-1">
                              <button
                                type="button"
                                id={`reconsider-vol-row-${vol.id}`}
                                onClick={() => handleApprove(vol.id, vol.fullName)}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 font-semibold text-xs border border-slate-200 transition-colors cursor-pointer"
                                title="Re-evaluate & Accept Application"
                              >
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>Re-evaluate</span>
                              </button>
                            </div>
                          )}

                          <button
                            type="button"
                            id={`view-vol-dossier-${vol.id}`}
                            onClick={() => setSelectedVolunteerForDetail(vol)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-teal-900 bg-teal-50 hover:bg-teal-100 text-xs font-bold transition-colors cursor-pointer"
                            title="View Full Application Details as Submitted in Form"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="hidden xl:inline">{isPending ? 'Review Full Application' : 'View Dossier'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedVolunteerForAssign(vol)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-800 hover:bg-indigo-50 transition-colors"
                            title="Assign Tasks or Log Hours"
                          >
                            <HeartHandshake className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onEditVolunteer(vol)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-sky-800 hover:bg-sky-50 transition-colors"
                            title="Edit Volunteer Info"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Volunteer Detail Dossier Modal */}
      <VolunteerDetailModal
        isOpen={!!selectedVolunteerForDetail}
        onClose={() => setSelectedVolunteerForDetail(null)}
        volunteer={selectedVolunteerForDetail}
        permissions={selectedVolunteerForDetail ? volunteerPermissions[selectedVolunteerForDetail.id] : undefined}
        onApprove={handleApprove}
        onReject={handleReject}
        onAssign={(vol) => {
          setSelectedVolunteerForDetail(null);
          setSelectedVolunteerForAssign(vol);
        }}
        onLogHours={(vol) => {
          setSelectedVolunteerForDetail(null);
          setSelectedVolunteerForAssign(vol);
        }}
      />

      {/* Volunteer Assign Tasks & Hours Modal */}
      <VolunteerAssignModal
        isOpen={!!selectedVolunteerForAssign}
        onClose={() => setSelectedVolunteerForAssign(null)}
        volunteer={selectedVolunteerForAssign}
        programs={programs}
        events={events}
        complaints={complaints}
        onAssignGrievance={onAssignGrievance}
        onUpdateVolunteerPermissions={onUpdatePermissions}
        onLogHours={onLogHours}
      />
    </div>
  );
};
