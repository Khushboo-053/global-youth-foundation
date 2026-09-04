import React from 'react';
import { Link } from 'react-router-dom';
import { GrievanceRecord } from '../types';
import { 
  X, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  User, 
  FileText, 
  Printer, 
  AlertTriangle, 
  Clock, 
  ArrowRight,
  Lock,
  Search
} from 'lucide-react';
import { ComplaintTimeline } from './ComplaintTimeline';
import { EvidenceAttachmentCard } from './common/EvidenceAttachmentCard';

interface GrievanceDetailModalProps {
  complaint: GrievanceRecord;
  onClose: () => void;
}

export const GrievanceDetailModal: React.FC<GrievanceDetailModalProps> = ({ complaint, onClose }) => {
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

            {complaint.attachmentName && (
              <div className="pt-2">
                <EvidenceAttachmentCard
                  attachmentName={complaint.attachmentName}
                  attachmentSize={complaint.attachmentSize || '1.4 MB'}
                  attachmentUrl={complaint.attachmentUrl}
                  attachmentType={complaint.attachmentType}
                  docketId={complaint.id}
                  category={complaint.category}
                  subject={complaint.subject}
                  submittedAt={complaint.submittedAt}
                />
              </div>
            )}
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

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-slate-500">
            Official Docket Record • GYF Redressal Cell
          </span>
          <div className="flex items-center gap-2">
            <Link
              to={`/track-complaint?id=${complaint.id}`}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track Live Docket</span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
