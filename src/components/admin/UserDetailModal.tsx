import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  Award, 
  Heart,
  CheckCircle2,
  XCircle,
  Tag,
  FileText
} from 'lucide-react';
import { UserAccount } from '../../types';
import { Modal } from '../Modal';

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount | null;
  onEdit?: (user: UserAccount) => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  isOpen,
  onClose,
  user,
  onEdit
}) => {
  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Account Dossier">
      <div className="space-y-6">
        {/* Header Profile Card */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="w-16 h-16 rounded-2xl bg-teal-800 text-white font-black text-xl flex items-center justify-center shadow-xs">
            {user.fullName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900 truncate">
                {user.fullName}
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                user.role === 'admin' 
                  ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                  : user.role === 'volunteer'
                  ? 'bg-teal-100 text-teal-800 border border-teal-200'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}>
                {user.role.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold">{user.roleTitle || (user.role === 'user' ? 'Normal User (Website User)' : user.role)}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                user.isActive ? 'text-emerald-700' : 'text-rose-700'
              }`}>
                {user.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                {user.isActive ? 'Active Account' : 'Suspended / Inactive'}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] text-slate-500">ID: {user.id}</span>
            </div>
          </div>
        </div>

        {/* Contact & Location Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-teal-600" />
              Email Address
            </span>
            <p className="text-xs font-bold text-slate-900 break-all">{user.email}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-teal-600" />
              Phone Number
            </span>
            <p className="text-xs font-bold text-slate-900">{user.phone || 'Not provided'}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              Location / Chapter
            </span>
            <p className="text-xs font-bold text-slate-900">
              {user.city ? `${user.city}, ${user.country || 'India'}` : user.chapter || 'Central Valley'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              Registration Date
            </span>
            <p className="text-xs font-bold text-slate-900">{user.joinedDate || '2025'}</p>
          </div>
        </div>

        {/* Volunteer / Additional Metadata */}
        {(user.bloodGroup || user.emergencyContact || user.volunteerHours !== undefined) && (
          <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-3">
            <h4 className="text-xs font-extrabold text-teal-900 uppercase tracking-wider">
              Profile Metadata & Service Record
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500 text-[11px]">Blood Group:</span>
                <p className="font-bold text-slate-800">{user.bloodGroup || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Volunteer Hours:</span>
                <p className="font-bold text-teal-800">{user.volunteerHours || 0} Hours Logged</p>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Membership Status:</span>
                <p className="font-bold text-slate-800">{user.membershipStatus || 'Citizen'}</p>
              </div>
            </div>
            {user.emergencyContact && (
              <div className="text-xs pt-2 border-t border-teal-100/80">
                <span className="text-slate-500 text-[11px]">Emergency Contact:</span>
                <p className="font-bold text-slate-800">{user.emergencyContact}</p>
              </div>
            )}
          </div>
        )}

        {/* Skills */}
        {user.skills && user.skills.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Skills & Expertise
            </h4>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bio */}
        {user.bio && (
          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Biography & Notes
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">{user.bio}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
          >
            Close
          </button>
          {onEdit && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(user);
              }}
              className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-xs transition-colors"
            >
              Edit User Profile
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
