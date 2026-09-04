import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MapPin, 
  UserCheck, 
  Tag, 
  FileText,
  User,
  Trash2
} from 'lucide-react';
import { GrievanceRecord, ComplaintStatus, UserAccount } from '../../types';
import { GrievanceOmbudsmanModal } from './GrievanceOmbudsmanModal';

interface AdminGrievancesTabProps {
  complaints: GrievanceRecord[];
  volunteers: UserAccount[];
  onUpdateStatus: (id: string, newStatus: ComplaintStatus, officerNote?: string) => Promise<void>;
  onAssignVolunteer: (id: string, volunteerId: string, volunteerName: string, department?: string) => Promise<void>;
  onDeleteComplaint: (id: string) => Promise<void>;
}

export const AdminGrievancesTab: React.FC<AdminGrievancesTabProps> = ({
  complaints,
  volunteers,
  onUpdateStatus,
  onAssignVolunteer,
  onDeleteComplaint
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ComplaintStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'Low' | 'Medium' | 'High' | 'Urgent'>('all');
  const [selectedGrievance, setSelectedGrievance] = useState<GrievanceRecord | null>(null);

  // Status Metrics
  const totalCount = complaints.length;
  const pendingCount = complaints.filter(c => c.currentStatus === 'Submitted' || c.currentStatus === 'Under Review').length;
  const inProgressCount = complaints.filter(c => c.currentStatus === 'Assigned' || c.currentStatus === 'In Progress').length;
  const resolvedCount = complaints.filter(c => c.currentStatus === 'Resolved' || c.currentStatus === 'Closed').length;
  const rejectedCount = complaints.filter(c => c.currentStatus === 'Rejected').length;

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = 
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.complainantEmail && c.complainantEmail.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || c.currentStatus === statusFilter;
    const matchesPriority = priorityFilter === 'all' || c.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-teal-800" />
            Citizen Grievance & Ombudsman Oversight Desk
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track community grievances, assign field volunteers, and resolve youth appeals.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Grievance Dockets
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {totalCount}
          </div>
          <span className="text-[11px] text-slate-500 font-semibold mt-0.5 block">
            Submitted by citizens
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Pending Legal Screening
          </span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {pendingCount}
          </div>
          <span className="text-[11px] text-amber-700 font-semibold mt-0.5 block">
            Awaiting assessment
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Active Investigations
          </span>
          <div className="text-2xl font-black text-sky-600 mt-1">
            {inProgressCount}
          </div>
          <span className="text-[11px] text-sky-700 font-semibold mt-0.5 block">
            Assigned to taskforce
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Successfully Resolved
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {resolvedCount}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">
            Case closed with order
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Cases Rejected
          </span>
          <div className="text-2xl font-black text-rose-600 mt-1">
            {rejectedCount}
          </div>
          <span className="text-[11px] text-rose-700 font-semibold mt-0.5 block">
            Ineligible or dismissed
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by tracking token (e.g. GYF-2026-...), subject, location, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
          />
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 shrink-0">
          <span className="text-xs font-bold text-slate-500 shrink-0">Status:</span>
          {(['all', 'Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed', 'Rejected'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                statusFilter === st
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all' ? 'All Dockets' : st}
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-slate-500">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700"
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Grievances Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Docket ID</th>
                <th className="py-3.5 px-4">Subject & Details</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Assigned Officer</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No grievance dockets match your search or filter.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <span className="font-mono text-xs font-bold text-teal-900 bg-teal-50 px-2 py-0.5 rounded-md">
                        {c.id}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">{c.submittedAt}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 line-clamp-1 max-w-xs">
                        {c.subject}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Tag className="w-3 h-3 text-slate-400" />
                        <span>{c.category}</span>
                        {c.isAnonymous && (
                          <span className="px-1.5 py-0.2 rounded-xs bg-slate-100 text-slate-600 text-[10px] font-bold">
                            Anonymous
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-semibold">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                        <span className="truncate max-w-[130px]">{c.location}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        c.priority === 'Urgent' ? 'bg-rose-100 text-rose-800' :
                        c.priority === 'High' ? 'bg-amber-100 text-amber-800' :
                        c.priority === 'Medium' ? 'bg-sky-100 text-sky-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {c.priority}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {c.assignedVolunteerName ? (
                        <div className="font-semibold text-teal-900">
                          {c.assignedVolunteerName}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        c.currentStatus === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                        c.currentStatus === 'In Progress' ? 'bg-sky-100 text-sky-800' :
                        c.currentStatus === 'Assigned' ? 'bg-indigo-100 text-indigo-800' :
                        c.currentStatus === 'Under Review' ? 'bg-amber-100 text-amber-800' :
                        c.currentStatus === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {c.currentStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedGrievance(c)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-teal-800 hover:bg-teal-50 transition-colors"
                          title="Open Grievance Ombudsman Docket"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ombudsman Dossier Modal */}
      <GrievanceOmbudsmanModal
        isOpen={!!selectedGrievance}
        onClose={() => setSelectedGrievance(null)}
        grievance={selectedGrievance}
        volunteers={volunteers}
        onUpdateStatus={onUpdateStatus}
        onAssignVolunteer={onAssignVolunteer}
        onDeleteComplaint={onDeleteComplaint}
      />
    </div>
  );
};
