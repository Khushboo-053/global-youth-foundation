import React, { useState } from 'react';
import { UserAccount } from '../types';
import { QrCode, CheckCircle2, Printer, Download, Sparkles, Camera, ShieldCheck } from 'lucide-react';
import { GyfLogo } from './GyfLogo';
import { ChangeProfilePhotoModal } from './ChangeProfilePhotoModal';

interface DigitalIdCardProps {
  user: UserAccount;
  onChangePhoto?: () => void;
}

export const DigitalIdCard: React.FC<DigitalIdCardProps> = ({ user, onChangePhoto }) => {
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const isVolunteer = user.role === 'volunteer' || user.membershipStatus === 'Volunteer';
  
  const memberId = user.membershipId || (
    isVolunteer 
      ? (user.id?.startsWith('vol-') ? user.id.toUpperCase() : `GYF-VOL-${user.id?.slice(-6).toUpperCase() || '2026'}`)
      : 'GYF-MEM-2026-001'
  );

  const chapter = user.chapter || (isVolunteer ? 'North Kashmir Hub (Baramulla)' : 'Central Kashmir Hub (Srinagar & Bemina)');

  const handleTriggerPhoto = () => {
    if (onChangePhoto) {
      onChangePhoto();
    } else {
      setShowPhotoModal(true);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Visual Identity Card Container */}
        <div 
          id="gyf-digital-id-card" 
          className="relative max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border border-[#2C3292]/40 bg-gradient-to-br from-[#12143b] via-[#1f2360] to-[#2C3292] text-white p-6 sm:p-7 select-none print:border-black print:text-black print:bg-white"
        >
          {/* Background watermark/patterns */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 rounded-full bg-blue-500/20 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 rounded-full bg-[#2C3292]/40 blur-2xl pointer-events-none" />
          
          {/* Holographic Security Stripe */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300" />

          {/* Card Header */}
          <div className="flex items-start justify-between gap-3 pb-4 border-b border-white/15">
            <div className="flex items-center gap-3">
              <GyfLogo size="sm" variant="white" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-200 block">
                  {isVolunteer ? 'Official Volunteer Credential' : 'Official Member Credential'}
                </span>
                <h3 className="text-base font-extrabold tracking-tight text-white leading-tight">
                  Global Youth Foundation
                </h3>
                <p className="text-[10px] text-blue-200/80">
                  {isVolunteer ? 'Youth Action Taskforce • Peace & Civic Fieldwork' : 'Youth Empowerment • Peace • Human Rights'}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/15 border border-white/20 text-blue-200">
                <Sparkles className="w-2.5 h-2.5 text-teal-300" />
                <span>{isVolunteer ? 'VERIFIED VOLUNTEER' : 'VERIFIED MEMBER'}</span>
              </span>
            </div>
          </div>

          {/* Card Body Profile Section */}
          <div className="py-5 flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Avatar / Photo with quick edit overlay */}
            <div className="relative shrink-0 group">
              <div 
                onClick={handleTriggerPhoto}
                className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-blue-300/40 bg-[#12143b] shadow-md cursor-pointer relative"
                title="Click to change profile photo"
              >
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.fullName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-black text-blue-200">
                    {user.fullName.charAt(0)}
                  </div>
                )}
                
                {/* Hover overlay to change photo */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity text-[10px] font-bold gap-0.5">
                  <Camera className="w-4 h-4" />
                  <span>Change</span>
                </div>
              </div>

              {/* Status Badge Icon */}
              <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            {/* Member Details */}
            <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
              <div>
                <h4 className="text-lg font-bold text-white truncate">
                  {user.fullName}
                </h4>
                <p className="text-xs text-blue-200 font-semibold flex items-center justify-center sm:justify-start gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>
                    {isVolunteer 
                      ? (user.roleTitle || 'Certified Youth Volunteer') 
                      : (user.roleTitle || user.role || user.membershipStatus || 'Member')}
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                <div className="bg-[#12143b]/80 p-2 rounded-xl border border-white/10">
                  <span className="text-blue-200/80 block text-[9px] uppercase font-bold">
                    {isVolunteer ? 'Volunteer ID' : 'Member ID'}
                  </span>
                  <span className="font-mono font-bold text-white text-[11px] truncate block">{memberId}</span>
                </div>
                <div className="bg-[#12143b]/80 p-2 rounded-xl border border-white/10">
                  <span className="text-blue-200/80 block text-[9px] uppercase font-bold">Blood Group</span>
                  <span className="font-bold text-amber-300 text-[11px] block">{user.bloodGroup || 'O+'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Extra Card Metadata (NOTE: 'Valid Thru' removed per request) */}
          <div className="space-y-2 pt-3 border-t border-white/15 text-[11px] text-blue-100">
            <div className="flex items-center justify-between">
              <span className="text-blue-200/70">Assigned Chapter:</span>
              <span className="font-semibold text-white truncate max-w-[200px]">{chapter}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-200/70">Registration Date:</span>
              <span className="font-mono text-white">{user.joinedDate || 'Jan 2025'}</span>
            </div>
            {isVolunteer && (
              <div className="flex items-center justify-between">
                <span className="text-blue-200/70">Certified Service:</span>
                <span className="font-mono text-emerald-300 font-bold">
                  {user.volunteerHours || 42} Hours Logged
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-blue-200/70">Credential Status:</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active & Verified</span>
              </span>
            </div>
          </div>

          {/* Footer Barcode / QR Simulation */}
          <div className="mt-5 pt-4 border-t border-white/15 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] text-blue-200 font-mono">
              <QrCode className="w-7 h-7 text-blue-300" />
              <div>
                <div className="font-bold text-white">SCAN TO VERIFY</div>
                <div className="text-blue-200/70">gyf.org/verify/{memberId}</div>
              </div>
            </div>

            <div className="text-right text-[9px] text-blue-200">
              <div>Central Secretariat</div>
              <div className="font-bold text-white">Baramulla • Srinagar</div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={handleTriggerPhoto}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Change Photo</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2C3292] hover:bg-[#1f2360] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print ID Card</span>
          </button>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText?.(
                `GYF ${isVolunteer ? 'Volunteer' : 'Member'} ID: ${memberId} - ${user.fullName} (${user.role || user.membershipStatus})`
              );
              alert(`${isVolunteer ? 'Volunteer' : 'Member'} Identity credentials copied to clipboard!`);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Copy Credentials</span>
          </button>
        </div>
      </div>

      {/* Profile Photo Modal */}
      <ChangeProfilePhotoModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        currentAvatar={user.avatar}
        userName={user.fullName}
      />
    </>
  );
};
