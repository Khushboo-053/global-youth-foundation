import React from 'react';
import { UserAccount } from '../types';
import { ShieldCheck, QrCode, Award, CheckCircle2, Printer, Download, Sparkles } from 'lucide-react';
import { ORG_INFO } from '../data/mockData';

interface DigitalIdCardProps {
  user: UserAccount;
}

export const DigitalIdCard: React.FC<DigitalIdCardProps> = ({ user }) => {
  const handlePrint = () => {
    window.print();
  };

  const memberId = user.membershipId || 'GYF-MEM-2026-001';
  const chapter = user.chapter || 'Central Kashmir Hub (Srinagar & Bemina)';

  return (
    <div className="space-y-4">
      {/* Visual Identity Card Container */}
      <div 
        id="gyf-digital-id-card" 
        className="relative max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-700 bg-linear-to-br from-slate-900 via-slate-850 to-teal-950 text-white p-6 sm:p-7 select-none print:border-black print:text-black print:bg-white"
      >
        {/* Background watermark/patterns */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 rounded-full bg-sky-500/10 blur-2xl pointer-events-none" />
        
        {/* Holographic Security Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-teal-400 via-amber-300 to-sky-400" />

        {/* Card Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-700/80">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-teal-400 block">
                Official Credential
              </span>
              <h3 className="text-base font-extrabold tracking-tight text-white leading-tight">
                Global Youth Foundation
              </h3>
              <p className="text-[10px] text-slate-400">
                Youth Empowerment • Peace • Human Rights
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-500/20 border border-teal-400/30 text-teal-300">
              <Sparkles className="w-2.5 h-2.5" />
              <span>VERIFIED</span>
            </span>
          </div>
        </div>

        {/* Card Body Profile Section */}
        <div className="py-5 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar / Photo */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-teal-400/50 bg-slate-800 shadow-md">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.fullName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-black text-teal-300">
                  {user.fullName.charAt(0)}
                </div>
              )}
            </div>
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
              <p className="text-xs text-teal-300 font-semibold">
                {user.role || user.membershipStatus}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
              <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/50">
                <span className="text-slate-400 block text-[9px] uppercase font-bold">Member ID</span>
                <span className="font-mono font-bold text-white text-[11px] truncate block">{memberId}</span>
              </div>
              <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/50">
                <span className="text-slate-400 block text-[9px] uppercase font-bold">Blood Group</span>
                <span className="font-bold text-amber-300 text-[11px] block">{user.bloodGroup || 'O+'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Extra Card Metadata */}
        <div className="space-y-2 pt-3 border-t border-slate-800 text-[11px] text-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Chapter:</span>
            <span className="font-semibold text-slate-200 truncate max-w-[200px]">{chapter}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Issue Date:</span>
            <span className="font-mono text-slate-200">{user.joinedDate || 'Jan 2025'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Valid Thru:</span>
            <span className="font-mono text-teal-300 font-bold">DECEMBER 2028</span>
          </div>
        </div>

        {/* Footer Barcode / QR Simulation */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
            <QrCode className="w-7 h-7 text-teal-400" />
            <div>
              <div className="font-bold text-slate-200">SCAN TO VERIFY</div>
              <div>gyf.org/verify/{memberId}</div>
            </div>
          </div>

          <div className="text-right text-[9px] text-slate-400">
            <div>Office Secretariat</div>
            <div className="font-bold text-teal-400">Baramulla • Srinagar</div>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Card</span>
        </button>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText?.(`GYF Digital ID: ${memberId} - ${user.fullName} (${user.role})`);
            alert('Member Identity credentials copied to clipboard!');
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Copy Credentials</span>
        </button>
      </div>
    </div>
  );
};
