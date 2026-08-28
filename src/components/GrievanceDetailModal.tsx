import React, { useState } from 'react';
import { GrievanceRecord, ComplaintStatus } from '../types';
import { 
  X, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  User, 
  FileText, 
  Printer, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  MessageSquarePlus,
  Lock
} from 'lucide-react';
import { ComplaintTimeline } from './ComplaintTimeline';
import { useApp } from '../context/AppContext';

interface GrievanceDetailModalProps {
  complaint: GrievanceRecord;
  onClose: () => void;
}

const STATUS_OPTIONS: ComplaintStatus[] = [
  'Submitted',
  'Under Review',
  'Assigned',
  'In Progress',
  'Resolved',
  'Closed'
];

export const GrievanceDetailModal: React.FC<GrievanceDetailModalProps> = ({ complaint, onClose }) => {
  const { updateComplaintStatus, user } = useApp();
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus>(complaint.currentStatus);
  const [officerNote, setOfficerNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    updateComplaintStatus(complaint.id, selectedStatus, officerNote || undefined);
    setIsUpdating(false);
    setShowSuccessToast(true);
    setOfficerNote('');
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 sm:p-7 bg-slate-900 text-white flex items-start justify-between gap-4 border-b border-slate-800 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-teal-300 bg-teal-500/20 px-2.5 py-0.5 rounded border border-teal-400/30">
                {complaint.id}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                complaint.currentStatus === 'Resolved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' :
                complaint.currentStatus === 'In Progress' ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' :
                'bg-sky-500/20 text-sky-300 border border-sky-400/30'
              }`}>
                {complaint.currentStatus}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700">
                Priority: {complaint.priority}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
              {complaint.subject}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              title="Print Docket"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6 flex-1">
          
          {/* Toast alert on update */}
          {showSuccessToast && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Grievance status updated successfully and recorded in timeline log.</span>
            </div>
          )}

          {/* Core Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Category</span>
              <span className="font-bold text-slate-800 mt-0.5 block">{complaint.category}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Location & Jurisdiction</span>
              <span className="font-bold text-slate-800 mt-0.5 block">{complaint.location}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Submission Date</span>
              <span className="font-bold text-slate-800 mt-0.5 block">{complaint.submittedAt}</span>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Statement of Grievance
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed">
              {complaint.description}
            </div>
          </div>

          {/* Complainant Privacy Info */}
          <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                {complaint.isAnonymous ? <Lock className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div>
                <span className="font-bold text-teal-950 block">
                  {complaint.isAnonymous ? 'Anonymous Confidential Filing' : 'Complainant Liaison on Record'}
                </span>
                <span className="text-teal-800/80 text-[11px]">
                  {complaint.isAnonymous 
                    ? 'Identity protected under GYF Public Grievance Charter' 
                    : `${complaint.complainantEmail || 'Registered user'} • ${complaint.complainantPhone || 'Contact on file'}`}
                </span>
              </div>
            </div>

            <span className="text-[11px] font-bold text-teal-800 bg-white px-2.5 py-1 rounded-md border border-teal-200">
              {complaint.assignedDepartment || 'Ombudsman Desk'}
            </span>
          </div>

          {/* Interactive Timeline Progress */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Resolution Progression Timeline
            </h4>
            <div className="p-5 rounded-2xl bg-white border border-slate-200">
              <ComplaintTimeline currentStatus={complaint.currentStatus} events={complaint.timeline} />
            </div>
          </div>

          {/* Status Update / Officer Action Simulator */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4 border border-slate-800">
            <div className="flex items-center gap-2">
              <MessageSquarePlus className="w-4 h-4 text-teal-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300">
                Grievance Officer Action & Status Progression
              </h4>
            </div>

            <form onSubmit={handleStatusUpdate} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Advance Status Stage:
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as ComplaintStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold focus:outline-hidden focus:border-teal-400"
                  >
                    {STATUS_OPTIONS.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Logged By Officer / Role:
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user ? `${user.fullName} (${user.role || user.membershipStatus})` : 'Ombudsman Officer'}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-400 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Official Action / Status Remark Note:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Liaison established with municipal executive officer. Site visit scheduled."
                  value={officerNote}
                  onChange={(e) => setOfficerNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-hidden focus:border-teal-400"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Update Docket Status</span>
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            Official Docket Record • GYF Redressal Cell
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
          >
            Close Docket
          </button>
        </div>

      </div>
    </div>
  );
};
