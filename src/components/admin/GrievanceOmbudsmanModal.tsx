import React, { useState } from 'react';
import {
  ShieldCheck,
  MapPin,
  Clock,
  Calendar,
  User,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  ArrowRight,
  FileText,
  Mail,
  Phone,
  Paperclip,
  Tag
} from 'lucide-react';
import { GrievanceRecord, ComplaintStatus, UserAccount } from '../../types';
import { Modal } from '../Modal';
import { EvidenceAttachmentCard } from '../common/EvidenceAttachmentCard';

interface GrievanceOmbudsmanModalProps {
  isOpen: boolean;
  onClose: () => void;
  grievance: GrievanceRecord | null;
  volunteers: UserAccount[];
  onUpdateStatus: (id: string, newStatus: ComplaintStatus, officerNote?: string) => Promise<void>;
  onUpdatePriority?: (id: string, newPriority: 'Low' | 'Medium' | 'High' | 'Urgent') => Promise<void>;
  onAssignVolunteer: (id: string, volunteerId: string, volunteerName: string, department?: string) => Promise<void>;
  onDeleteComplaint?: (id: string) => Promise<void>;
}

export const GrievanceOmbudsmanModal: React.FC<GrievanceOmbudsmanModalProps> = ({
  isOpen,
  onClose,
  grievance,
  volunteers,
  onUpdateStatus,
  onUpdatePriority,
  onAssignVolunteer,
  onDeleteComplaint
}) => {
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus>('Under Review');
  const [officerNote, setOfficerNote] = useState('');
  const [selectedVolunteerId, setSelectedVolunteerId] = useState('');
  const [department, setDepartment] = useState('Youth Ombudsman Field Wing');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!grievance) return null;

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await onUpdateStatus(grievance.id, selectedStatus, officerNote || undefined);
      setSuccessMsg(`Grievance status updated to "${selectedStatus}".`);
      setOfficerNote('');
      setTimeout(() => setSuccessMsg(''), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVolunteerId) return;

    const vol = volunteers.find(v => v.id === selectedVolunteerId);
    if (!vol) return;

    setIsUpdating(true);
    try {
      await onAssignVolunteer(grievance.id, vol.id, vol.fullName, department);
      setSuccessMsg(`Assigned to volunteer ${vol.fullName}.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Ombudsman Docket: ${grievance.id}`}>
      <div className="space-y-6">
        {/* Docket Header Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="font-mono text-xs font-bold text-teal-300 bg-teal-950/80 px-2.5 py-1 rounded-md border border-teal-800/60">
              Tracking Token: {grievance.id}
            </span>
            <div className="flex items-center gap-2">
              <select
                value={grievance.priority || 'Medium'}
                onChange={async (e) => {
                  const newP = e.target.value as 'Low' | 'Medium' | 'High' | 'Urgent';
                  if (onUpdatePriority) {
                    await onUpdatePriority(grievance.id, newP);
                  }
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider cursor-pointer border focus:outline-none focus:ring-2 ${grievance.priority === 'Urgent' ? 'bg-rose-600 text-white border-rose-400 focus:ring-rose-400' :
                    grievance.priority === 'High' ? 'bg-amber-600 text-white border-amber-400 focus:ring-amber-400' :
                      grievance.priority === 'Medium' ? 'bg-sky-600 text-white border-sky-400 focus:ring-sky-400' :
                        'bg-slate-700 text-slate-200 border-slate-600 focus:ring-slate-400'
                  }`}
                title="Change Grievance Priority"
              >
                <option value="Low" className="bg-slate-900 text-white">LOW PRIORITY</option>
                <option value="Medium" className="bg-slate-900 text-white">MEDIUM PRIORITY</option>
                <option value="High" className="bg-slate-900 text-white">HIGH PRIORITY</option>
                <option value="Urgent" className="bg-slate-900 text-white">URGENT PRIORITY</option>
              </select>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-800 text-teal-100 text-xs font-bold">
                {grievance.currentStatus}
              </span>
            </div>
          </div>

          <h3 className="text-base font-black text-white leading-snug">
            {grievance.subject}
          </h3>

          <div className="flex items-center gap-4 text-xs text-slate-300 pt-2 border-t border-slate-800 flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              {grievance.location}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-teal-400" />
              {grievance.category}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-teal-400" />
              Submitted: {grievance.submittedAt}
            </span>
          </div>
        </div>

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Complainant & Case Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Complainant Confidentiality
            </span>
            <p className="text-xs font-bold text-slate-900">
              {grievance.isAnonymous ? (
                <span className="text-amber-800 font-black">Anonymous Citizen (Protected Identity)</span>
              ) : (
                <span>Public Citizen Submission</span>
              )}
            </p>
            {grievance.complainantEmail && (
              <p className="text-xs text-slate-600 flex items-center gap-1 pt-1">
                <Mail className="w-3 h-3 text-slate-400" />
                {grievance.complainantEmail}
              </p>
            )}
            {grievance.complainantPhone && (
              <p className="text-xs text-slate-600 flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                {grievance.complainantPhone}
              </p>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Assigned Field Officer / Volunteer
            </span>
            <p className="text-xs font-bold text-slate-900">
              {grievance.assignedVolunteerName ? (
                <span className="text-teal-900 font-bold">{grievance.assignedVolunteerName}</span>
              ) : (
                <span className="text-slate-400">Unassigned (Pending Allocation)</span>
              )}
            </p>
            {grievance.assignedDepartment && (
              <p className="text-[11px] text-slate-500">{grievance.assignedDepartment}</p>
            )}
          </div>
        </div>

        {/* Narrative Description */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Grievance Description & Impact Facts
          </span>
          <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
            {grievance.description}
          </p>
          {grievance.attachmentName && (
            <div className="pt-2 border-t border-slate-100">
              <EvidenceAttachmentCard
                attachmentName={grievance.attachmentName}
                attachmentSize={grievance.attachmentSize || '1.4 MB'}
                attachmentUrl={grievance.attachmentUrl}
                attachmentType={grievance.attachmentType}
                docketId={grievance.id}
                category={grievance.category}
                subject={grievance.subject}
                submittedAt={grievance.submittedAt}
              />
            </div>
          )}
        </div>

        {/* Timeline Log */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-teal-800" />
            Ombudsman Audit Timeline & Official Remarks
          </h4>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {grievance.timeline.map((ev, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{ev.status}</span>
                  <span className="text-[11px] text-slate-400">{ev.date}</span>
                </div>
                <p className="text-slate-600">{ev.description}</p>
                <div className="text-[10px] text-teal-800 font-semibold">
                  Updated by: {ev.updatedBy}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action 1: Status Progression & Remark Entry */}
        <form onSubmit={handleStatusSubmit} className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-3">
          <h4 className="text-xs font-extrabold text-teal-950 uppercase tracking-wider">
            Update Docket Status & Record Action
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                New Docket Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as ComplaintStatus)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 bg-white font-semibold"
              >
                <option value="Submitted">Submitted (Initial Queue)</option>
                <option value="Under Review">Under Review (Legal/Ombudsman)</option>
                <option value="Assigned">Assigned to Field Volunteer</option>
                <option value="In Progress">In Progress (Active Investigation)</option>
                <option value="Resolved">Resolved (Sanction/Order Complete)</option>
                <option value="Closed">Closed</option>
                <option value="Rejected">Rejected (Ineligible / Dismissed)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Action Remark
              </label>
              <input
                type="text"
                placeholder="e.g. Field inspection completed; notices issued."
                value={officerNote}
                onChange={(e) => setOfficerNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isUpdating}
              className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
            >
              {isUpdating ? 'Recording...' : 'Update Status & Timeline'}
            </button>
          </div>
        </form>

        {/* Action 2: Assign Volunteer Desk */}
        <form onSubmit={handleAssignSubmit} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-teal-800" />
            Assign Volunteer Taskforce Officer
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Active Volunteer
              </label>
              <select
                value={selectedVolunteerId}
                onChange={(e) => setSelectedVolunteerId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 bg-white"
              >
                <option value="">-- Choose from active volunteers --</option>
                {volunteers.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.fullName} ({v.chapter || 'Central Valley'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Assigned Unit / Desk
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isUpdating || !selectedVolunteerId}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
            >
              {isUpdating ? 'Assigning...' : 'Assign Volunteer'}
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          {onDeleteComplaint && (
            <button
              type="button"
              disabled={isDeleting}
              onClick={async () => {
                if (window.confirm('Are you certain you want to permanently delete this grievance docket? This action cannot be undone.')) {
                  setIsDeleting(true);
                  try {
                    await onDeleteComplaint(grievance.id);
                    onClose();
                  } finally {
                    setIsDeleting(false);
                  }
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isDeleting ? 'Deleting Docket...' : 'Delete Docket'}</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 ml-auto"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </Modal>
  );
};
