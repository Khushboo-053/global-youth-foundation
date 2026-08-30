import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle,
  Briefcase,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { UserAccount, VolunteerPermissions } from '../../types';
import { Modal } from '../Modal';

interface VolunteerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  volunteer: UserAccount | null;
  permissions?: VolunteerPermissions;
  onAssign?: (volunteer: UserAccount) => void;
  onLogHours?: (volunteer: UserAccount) => void;
}

export const VolunteerDetailModal: React.FC<VolunteerDetailModalProps> = ({
  isOpen,
  onClose,
  volunteer,
  permissions,
  onAssign,
  onLogHours
}) => {
  if (!volunteer) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Volunteer Profile & Operational Dossier">
      <div className="space-y-6">
        {/* Volunteer Header */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-teal-900 text-white shadow-md">
          <div className="w-16 h-16 rounded-2xl bg-white text-teal-950 font-black text-2xl flex items-center justify-center shadow-xs shrink-0">
            {volunteer.fullName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white truncate">
                {volunteer.fullName}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-700/80 text-teal-100 text-xs font-bold border border-teal-600">
                {volunteer.membershipStatus || 'Volunteer'}
              </span>
            </div>
            <p className="text-xs text-teal-200 font-semibold">{volunteer.roleTitle || 'Youth Action Fellow'}</p>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-teal-100">
              <span className="flex items-center gap-1 font-bold">
                <Clock className="w-3.5 h-3.5 text-teal-300" />
                {volunteer.volunteerHours || 0} Service Hours Logged
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-300" />
                {volunteer.chapter || 'Central Valley Hub'}
              </span>
            </div>
          </div>
        </div>

        {/* Contact & Demographics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Email Address
            </span>
            <p className="text-xs font-bold text-slate-900">{volunteer.email}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Phone Number
            </span>
            <p className="text-xs font-bold text-slate-900">{volunteer.phone || 'Not provided'}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Blood Group
            </span>
            <p className="text-xs font-bold text-slate-900">{volunteer.bloodGroup || 'Not specified'}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Emergency Contact
            </span>
            <p className="text-xs font-bold text-slate-900">{volunteer.emergencyContact || 'Not specified'}</p>
          </div>
        </div>

        {/* Permissions & Delegation Matrix */}
        {permissions && (
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
            <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-800" />
              Operational Delegations & Permissions
            </h4>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="flex items-center gap-2">
                {permissions.canManageGrievances ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span className={permissions.canManageGrievances ? 'font-bold text-slate-800' : 'text-slate-500'}>
                  Grievance Ombudsman Desk
                </span>
              </div>

              <div className="flex items-center gap-2">
                {permissions.canManageEvents ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span className={permissions.canManageEvents ? 'font-bold text-slate-800' : 'text-slate-500'}>
                  Event Operations Lead
                </span>
              </div>

              <div className="flex items-center gap-2">
                {permissions.canManagePrograms ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span className={permissions.canManagePrograms ? 'font-bold text-slate-800' : 'text-slate-500'}>
                  Program Facilitator
                </span>
              </div>

              <div className="flex items-center gap-2">
                {permissions.canViewMembers ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span className={permissions.canViewMembers ? 'font-bold text-slate-800' : 'text-slate-500'}>
                  Member Directory Access
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Skills & Background */}
        {volunteer.skills && volunteer.skills.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Core Skills & Capabilities
            </h4>
            <div className="flex flex-wrap gap-2">
              {volunteer.skills.map((s, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {volunteer.bio && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Volunteer Statement & Motivation
            </span>
            <p className="text-xs text-slate-700 leading-relaxed">{volunteer.bio}</p>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {onLogHours && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogHours(volunteer);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 text-teal-700" />
                <span>Log Service Hours</span>
              </button>
            )}

            {onAssign && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onAssign(volunteer);
                }}
                className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Assign Task / Chapter</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
