import React from 'react';
import { 
  Heart, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Copy, 
  Mail, 
  Phone, 
  Calendar, 
  FileText,
  ShieldCheck,
  Check
} from 'lucide-react';
import { DonationRecord } from '../../types';
import { Modal } from '../Modal';

interface DonationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  donation: DonationRecord | null;
  onUpdateStatus: (id: string, status: 'Verified' | 'Pending Verification' | 'Failed') => Promise<void>;
}

export const DonationDetailModal: React.FC<DonationDetailModalProps> = ({
  isOpen,
  onClose,
  donation,
  onUpdateStatus
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!donation) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusChange = async (status: 'Verified' | 'Pending Verification' | 'Failed') => {
    await onUpdateStatus(donation.id, status);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Official Donation Receipt & Audit Dossier">
      <div className="space-y-6">
        {/* Top Receipt Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-900 to-slate-900 text-white shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-bold border border-white/10">
              Receipt Reference: {donation.id}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
              donation.paymentStatus === 'Verified'
                ? 'bg-emerald-500 text-white'
                : donation.paymentStatus === 'Pending Verification'
                ? 'bg-amber-500 text-white'
                : 'bg-rose-500 text-white'
            }`}>
              {donation.paymentStatus}
            </span>
          </div>

          <div>
            <span className="text-xs text-teal-200 uppercase tracking-wider font-semibold block">
              Contribution Value
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white mt-1">
              ₹ {donation.amount.toLocaleString('en-IN')} <span className="text-sm font-bold text-teal-300">INR</span>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-teal-100">
            <span>Date Received: <strong>{donation.donationDate}</strong></span>
            <span>Channel: Direct Bank / UPI</span>
          </div>
        </div>

        {/* Donor & Banking Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Donor Name / Organization
            </span>
            <p className="text-xs font-bold text-slate-900">{donation.donorName}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Email Address
            </span>
            <p className="text-xs font-bold text-slate-900">{donation.email}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Phone Number
            </span>
            <p className="text-xs font-bold text-slate-900">{donation.phone || 'Not provided'}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Banking UTR / Reference ID
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-teal-900 truncate">
                {donation.transactionId}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(donation.transactionId)}
                className="p-1 rounded-md hover:bg-slate-200 text-slate-600 transition-colors"
                title="Copy UTR ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Donor Cause / Purpose */}
        {donation.notes && (
          <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 space-y-1">
            <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">
              Earmarked Purpose & Donor Note
            </span>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">{donation.notes}</p>
          </div>
        )}

        {/* Status Action Controls */}
        <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
            Reconciliation & Audit Status
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleStatusChange('Verified')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                donation.paymentStatus === 'Verified'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Verified (Reconciled)</span>
            </button>

            <button
              type="button"
              onClick={() => handleStatusChange('Pending Verification')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                donation.paymentStatus === 'Pending Verification'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-amber-50 hover:text-amber-800'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Mark Pending Verification</span>
            </button>

            <button
              type="button"
              onClick={() => handleStatusChange('Failed')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                donation.paymentStatus === 'Failed'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-800'
              }`}
            >
              <XCircle className="w-4 h-4" />
              <span>Mark Failed / Rejected</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};
