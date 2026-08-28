import React, { useState } from 'react';
import { 
  Building, 
  Copy, 
  Check, 
  ShieldAlert, 
  Landmark, 
  FileCheck, 
  HelpCircle,
  QrCode
} from 'lucide-react';
import { ORG_INFO } from '../data/mockData';

export const BankDetailsCard: React.FC<{ showExtraGuide?: boolean }> = ({ showExtraGuide = true }) => {
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedIfsc, setCopiedIfsc] = useState(false);

  const copyToClipboard = (text: string, type: 'acc' | 'ifsc') => {
    navigator.clipboard.writeText(text);
    if (type === 'acc') {
      setCopiedAcc(true);
      setTimeout(() => setCopiedAcc(false), 2500);
    } else {
      setCopiedIfsc(true);
      setTimeout(() => setCopiedIfsc(false), 2500);
    }
  };

  const { bankDetails } = ORG_INFO;

  return (
    <div id="bank-details-card" className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Official NGO Bank Account
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Direct Wire / NEFT / RTGS / IMPS / UPI Transfer
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200/70">
          <FileCheck className="w-3.5 h-3.5" /> Verified Official Account
        </span>
      </div>

      {/* Rows for each detail */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 text-sm">
        
        {/* Bank */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 gap-1 sm:gap-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Bank Name
          </span>
          <span className="font-bold text-slate-900 text-base">
            {bankDetails.bankName}
          </span>
        </div>

        {/* Account Name */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 gap-1 sm:gap-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Account Name
          </span>
          <span className="font-bold text-slate-900 text-base">
            {bankDetails.accountName}
          </span>
        </div>

        {/* Account Number with Copy Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-teal-50/60 border border-teal-100 gap-3">
          <div>
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
              Account Number
            </span>
            <span className="font-mono font-extrabold text-slate-900 text-lg sm:text-xl tracking-wider">
              {bankDetails.accountNumber}
            </span>
          </div>
          <button
            type="button"
            id="copy-account-number-btn"
            onClick={() => copyToClipboard(bankDetails.accountNumber, 'acc')}
            className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs transition-all shadow-sm ${
              copiedAcc 
                ? 'bg-emerald-600 text-white' 
                : 'bg-teal-600 hover:bg-teal-700 text-white'
            }`}
          >
            {copiedAcc ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Account Number</span>
              </>
            )}
          </button>
        </div>

        {/* IFSC Code with Copy Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-sky-50/60 border border-sky-100 gap-3">
          <div>
            <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block">
              IFSC Code
            </span>
            <span className="font-mono font-extrabold text-slate-900 text-lg sm:text-xl tracking-wider">
              {bankDetails.ifscCode}
            </span>
          </div>
          <button
            type="button"
            id="copy-ifsc-btn"
            onClick={() => copyToClipboard(bankDetails.ifscCode, 'ifsc')}
            className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs transition-all shadow-sm ${
              copiedIfsc 
                ? 'bg-emerald-600 text-white' 
                : 'bg-sky-700 hover:bg-sky-800 text-white'
            }`}
          >
            {copiedIfsc ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy IFSC</span>
              </>
            )}
          </button>
        </div>

        {/* Branch */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 gap-1 sm:gap-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Branch
          </span>
          <span className="font-semibold text-slate-800">
            {bankDetails.branch}
          </span>
        </div>

        {/* Account Type */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 gap-1 sm:gap-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Account Type
          </span>
          <span className="font-semibold text-slate-800">
            {bankDetails.accountType}
          </span>
        </div>
      </div>

      {/* Prominent Verification Warning */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-3 text-amber-900">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <span className="font-bold block text-sm text-amber-950 mb-0.5">Important Security Notice:</span>
          Please verify the bank details before making a transfer. Global Youth Foundation does not authorize any third-party intermediaries, cash collection, or private accounts for donations.
        </div>
      </div>

      {showExtraGuide && (
        <div className="pt-2 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <span>Need donation receipt or acknowledgement?</span>
          <a
            href={`mailto:${ORG_INFO.email}?subject=Donation Receipt Request - Global Youth Foundation`}
            className="font-semibold text-teal-700 hover:text-teal-800 underline"
          >
            Email your transfer screenshot to {ORG_INFO.email}
          </a>
        </div>
      )}
    </div>
  );
};
