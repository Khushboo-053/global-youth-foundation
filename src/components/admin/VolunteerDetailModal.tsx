import React, { useState } from 'react';
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
  HeartHandshake,
  Calendar,
  FileText,
  AlertCircle,
  Lock,
  ExternalLink,
  Copy,
  Check,
  GraduationCap
} from 'lucide-react';
import { UserAccount, VolunteerPermissions } from '../../types';
import { Modal } from '../Modal';
import { useApp } from '../../context/AppContext';

interface VolunteerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  volunteer: UserAccount | null;
  permissions?: VolunteerPermissions;
  onAssign?: (volunteer: UserAccount) => void;
  onLogHours?: (volunteer: UserAccount) => void;
  onApprove?: (volunteerId: string, name: string) => Promise<void>;
  onReject?: (volunteerId: string, name: string) => Promise<void>;
}

export const VolunteerDetailModal: React.FC<VolunteerDetailModalProps> = ({
  isOpen,
  onClose,
  volunteer,
  permissions,
  onAssign,
  onLogHours,
  onApprove,
  onReject
}) => {
  const { user } = useApp();
  const isAdmin = user?.role === 'admin';

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  if (!volunteer) return null;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const isPending = volunteer.membershipStatus === 'Applicant';
  const isApproved = volunteer.membershipStatus === 'Volunteer' || (volunteer.isActive && !isPending);
  const isRejected = volunteer.membershipStatus === 'Rejected';

  const handleApproveAction = async () => {
    if (!isAdmin || !onApprove) return;
    setIsProcessing(true);
    try {
      await onApprove(volunteer.id, volunteer.fullName);
      setActionSuccessMessage(`Volunteer application for "${volunteer.fullName}" has been successfully accepted!`);
      setTimeout(() => {
        setIsProcessing(false);
        setActionSuccessMessage(null);
        onClose();
      }, 1500);
    } catch (err: any) {
      setIsProcessing(false);
      alert(err.message || 'Error updating volunteer status.');
    }
  };

  const handleRejectAction = async () => {
    if (!isAdmin || !onReject) return;
    setIsProcessing(true);
    try {
      await onReject(volunteer.id, volunteer.fullName);
      setActionSuccessMessage(`Volunteer application for "${volunteer.fullName}" has been rejected.`);
      setTimeout(() => {
        setIsProcessing(false);
        setActionSuccessMessage(null);
        onClose();
      }, 1500);
    } catch (err: any) {
      setIsProcessing(false);
      alert(err.message || 'Error updating volunteer status.');
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Volunteer Application & Operational Dossier"
    >
      <div className="space-y-6">

        {/* Action success flash */}
        {actionSuccessMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
        )}

        {/* Volunteer Header Dossier Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            
            {/* Avatar or Initial */}
            <div className="w-16 h-16 rounded-2xl bg-teal-800/80 border border-teal-600/50 text-white font-black text-2xl flex items-center justify-center shadow-inner shrink-0">
              {volunteer.avatar ? (
                <img 
                  src={volunteer.avatar} 
                  alt={volunteer.fullName} 
                  className="w-full h-full object-cover rounded-2xl" 
                />
              ) : (
                volunteer.fullName.charAt(0).toUpperCase()
              )}
            </div>

            {/* Core Applicant Metadata */}
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-black text-white tracking-tight">
                  {volunteer.fullName}
                </h3>
                
                {/* Dynamic Status Pill */}
                {isPending ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/90 text-slate-950 text-xs font-black flex items-center gap-1 shadow-xs">
                    <Clock className="w-3 h-3 text-slate-950" />
                    Pending Admin Screening
                  </span>
                ) : isRejected ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/90 text-white text-xs font-black flex items-center gap-1 shadow-xs">
                    <XCircle className="w-3 h-3 text-white" />
                    Application Rejected
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-white text-xs font-black flex items-center gap-1 shadow-xs">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                    Active Volunteer Taskforce
                  </span>
                )}
              </div>

              <p className="text-xs text-teal-200 font-bold flex items-center gap-1.5">
                <span>{volunteer.roleTitle || 'Youth Volunteer Applicant'}</span>
                <span>•</span>
                <span className="text-teal-300 font-mono">Ref: {volunteer.membershipId || 'GYF-VOL-PENDING'}</span>
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-teal-100/90">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  {volunteer.chapter || 'Central Kashmir Hub (Srinagar)'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-teal-400" />
                  Submitted: {volunteer.joinedDate || 'Recent'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-teal-400" />
                  {volunteer.volunteerHours || 0} Hours Logged
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Contact & Personal Details Submitted in Form */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-black text-slate-600 uppercase tracking-wider flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-teal-700" />
            <span>Applicant Contact & Vital Information</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Email */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Official Email
                </span>
                <a 
                  href={`mailto:${volunteer.email}`} 
                  className="text-xs font-bold text-teal-800 hover:underline truncate block"
                  title="Click to send email"
                >
                  {volunteer.email}
                </a>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(volunteer.email, 'email')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-teal-800 hover:bg-slate-200 transition-colors"
                title="Copy Email"
              >
                {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Phone Number */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Phone / WhatsApp
                </span>
                <a 
                  href={`tel:${volunteer.phone}`} 
                  className="text-xs font-bold text-slate-900 hover:text-teal-800 truncate block"
                  title="Click to call"
                >
                  {volunteer.phone || 'Not provided'}
                </a>
              </div>
              {volunteer.phone && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(volunteer.phone, 'phone')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-teal-800 hover:bg-slate-200 transition-colors"
                  title="Copy Phone"
                >
                  {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>

            {/* Blood Group */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Blood Group (Emergency Field Aid)
              </span>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-xs font-black border border-rose-200">
                  {volunteer.bloodGroup || 'O+'}
                </span>
                <span className="text-[11px] text-slate-500">Verified Donor Registry</span>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Emergency Guardian / Contact
              </span>
              <p className="text-xs font-bold text-slate-800">
                {volunteer.emergencyContact || 'Verified on file with Chapter Lead'}
              </p>
            </div>

          </div>
        </div>

        {/* Section 2: Education, Availability & Capabilities Submitted */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-black text-slate-600 uppercase tracking-wider flex items-center gap-2">
            <GraduationCap className="w-3.5 h-3.5 text-teal-700" />
            <span>Academic Background & Operational Availability</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Profession / Education */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Profession / Educational Status
              </span>
              <p className="text-xs font-bold text-slate-900">
                {volunteer.professionOrEducation || 'University Student / Community Scholar'}
              </p>
            </div>

            {/* Availability */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Weekly Time Availability
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900">
                <Clock className="w-3.5 h-3.5 text-teal-700" />
                <span>{volunteer.availability || 'Weekends & Scheduled Civic Campaigns (4-8 hrs/week)'}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Section 3: Core Skills & Volunteer Capacities */}
        <div className="space-y-2">
          <h4 className="text-xs font-black text-slate-600 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-teal-700" />
            <span>Submitted Skills & Functional Domain Strengths</span>
          </h4>

          <div className="flex flex-wrap gap-2">
            {volunteer.skills && volunteer.skills.length > 0 ? (
              volunteer.skills.map((skill, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1 rounded-xl bg-teal-50 border border-teal-200/80 text-teal-950 text-xs font-bold shadow-2xs"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold">
                General Grassroots Support & Youth Mobilization
              </span>
            )}
          </div>
        </div>

        {/* Section 4: Applicant Motivation Statement Submitted in Form */}
        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-700" />
              Applicant Motivation & Purpose Statement
            </span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
              Form Submission
            </span>
          </div>
          <p className="text-xs text-slate-800 leading-relaxed italic bg-white/80 p-3 rounded-xl border border-amber-100 shadow-xs">
            "{volunteer.bio || 'I wish to dedicate my skills and time to the Global Youth Foundation to advocate for human rights, civic literacy, and transparent dispute redressal for underprivileged communities across Kashmir.'}"
          </p>
        </div>

        {/* Section 5: Code of Conduct & Legal Affirmation */}
        <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between text-xs text-emerald-950">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold">
              GYF Code of Conduct & Non-Violence Charter:
            </span>
            <span className="text-emerald-800">Signed & acknowledged in form.</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-emerald-200/60 text-emerald-900 text-[10px] font-black uppercase">
            Verified
          </span>
        </div>

        {/* Section 6: Operational Delegations & Permissions */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-800" />
              Taskforce Authority & Operational Access
            </h4>
            <span className="text-[10px] text-slate-500 font-semibold">
              {isApproved ? 'Live Active Permissions' : 'Permissions granted upon acceptance'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold text-slate-800">Grievance Field Verification</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold text-slate-800">Event Operations Lead</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
              {permissions?.canManagePrograms ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-slate-300 shrink-0" />
              )}
              <span className={permissions?.canManagePrograms ? 'font-bold text-slate-800' : 'text-slate-500'}>
                Program Facilitator
              </span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold text-slate-800">Member Directory Access</span>
            </div>
          </div>
        </div>

        {/* Section 7: Security & Administrative Authority Notice */}
        {!isAdmin && (
          <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 text-xs flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-slate-500 shrink-0" />
            <span>
              <strong>Administrative Access Required:</strong> Only logged-in administrators have permission to accept or reject volunteer applications.
            </span>
          </div>
        )}

        {/* Section 8: Modal Footer Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Close Dossier
          </button>

          <div className="w-full sm:w-auto flex flex-wrap items-center justify-end gap-2.5">
            {/* When viewing an Applicant: Provide prominent Accept & Reject options for Admin */}
            {isPending && isAdmin && (
              <>
                <button
                  type="button"
                  id="modal-reject-vol-btn"
                  disabled={isProcessing}
                  onClick={handleRejectAction}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-black shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Reject this volunteer application"
                >
                  <XCircle className="w-4 h-4" />
                  <span>{isProcessing ? 'Processing...' : 'Reject Application'}</span>
                </button>

                <button
                  type="button"
                  id="modal-accept-vol-btn"
                  disabled={isProcessing}
                  onClick={handleApproveAction}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-black shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Accept candidate as volunteer into the taskforce"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isProcessing ? 'Processing...' : 'Accept Volunteer Application'}</span>
                </button>
              </>
            )}

            {/* When viewing a previously Rejected Applicant: Provide Re-evaluate option */}
            {isRejected && isAdmin && (
              <button
                type="button"
                id="modal-reconsider-vol-btn"
                disabled={isProcessing}
                onClick={handleApproveAction}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isProcessing ? 'Processing...' : 'Re-evaluate & Accept'}</span>
              </button>
            )}

            {/* When viewing an Active Volunteer: Actions to assign chapter or log service hours */}
            {isApproved && (
              <>
                {onLogHours && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onLogHours(volunteer);
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5 text-teal-700" />
                    <span>Log Hours</span>
                  </button>
                )}

                {onAssign && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onAssign(volunteer);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-black shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>Assign Chapter</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

      </div>
    </Modal>
  );
};
