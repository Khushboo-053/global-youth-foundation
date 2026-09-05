import React, { useState } from 'react';
import { 
  Building, 
  Copy, 
  Check, 
  ShieldAlert, 
  Landmark, 
  FileCheck, 
  HelpCircle,
  QrCode,
  Smartphone,
  Download,
  Maximize2,
  X,
  CreditCard,
  ShieldCheck
} from 'lucide-react';
import { ORG_INFO } from '../data/mockData';
import { useApp } from '../context/AppContext';

export const BankDetailsCard: React.FC<{ showExtraGuide?: boolean }> = ({ showExtraGuide = true }) => {
  const { websiteContent } = useApp();
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedIfsc, setCopiedIfsc] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const copyToClipboard = (text: string, type: 'acc' | 'ifsc' | 'upi') => {
    navigator.clipboard.writeText(text);
    if (type === 'acc') {
      setCopiedAcc(true);
      setTimeout(() => setCopiedAcc(false), 2500);
    } else if (type === 'ifsc') {
      setCopiedIfsc(true);
      setTimeout(() => setCopiedIfsc(false), 2500);
    } else {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    }
  };

  const accountName = websiteContent?.bankAccountName || ORG_INFO.bankDetails.accountName;
  const bankName = websiteContent?.bankName || ORG_INFO.bankDetails.bankName;
  const accountNumber = websiteContent?.bankAccountNumber || ORG_INFO.bankDetails.accountNumber;
  const ifscCode = websiteContent?.bankIfsc || ORG_INFO.bankDetails.ifscCode;
  const upiId = websiteContent?.bankUpi || 'gyf.ombudsman@jkb';
  const branch = ORG_INFO.bankDetails.branch;
  const accountType = ORG_INFO.bankDetails.accountType;

  // Use uploaded official QR code photo or dynamic UPI QR fallback
  const qrCodeUrl = websiteContent?.bankQrCodeUrl?.trim() || 
    `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=${encodeURIComponent(accountName)}&cu=INR`)}`;

  const handleDownloadQr = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `GYF_Official_Donation_QR.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="bank-details-card" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
      
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

      {/* Dual Column Layout: QR Code on Left/Top, Bank Account Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: QR Code Scan Box */}
        <div 
          id="official-qr-panel"
          className="lg:col-span-5 bg-gradient-to-b from-teal-50/60 via-slate-50/70 to-purple-50/40 rounded-2xl border border-teal-200/70 p-5 sm:p-6 flex flex-col items-center text-center space-y-4 shadow-2xs"
        >
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-800 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-xs">
              <QrCode className="w-3.5 h-3.5 text-teal-200" />
              <span>Scan & Pay via UPI</span>
            </span>
            <h4 className="text-base font-extrabold text-slate-900 pt-1">
              Official Donation QR Code
            </h4>
            <p className="text-xs text-slate-500 max-w-xs">
              Open Google Pay, PhonePe, Paytm, or any UPI app to scan and transfer
            </p>
          </div>

          {/* QR Code Container with Frame */}
          <div 
            id="donation-qr-display-container"
            onClick={() => setIsQrModalOpen(true)}
            className="relative group cursor-pointer p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-400 transition-all"
            title="Click to view full screen"
          >
            <div className="w-48 h-48 sm:w-52 sm:h-52 rounded-xl overflow-hidden bg-white flex items-center justify-center">
              <img 
                src={qrCodeUrl} 
                alt="Official Donation QR Code" 
                className="w-full h-full object-contain transition-transform group-hover:scale-105 duration-200"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center text-white text-xs font-bold gap-1.5 backdrop-blur-[2px]">
              <Maximize2 className="w-4 h-4" />
              <span>Tap to Enlarge</span>
            </div>
          </div>

          {/* UPI ID & Quick Actions */}
          <div className="w-full space-y-2.5">
            <div className="p-2.5 rounded-xl bg-white border border-purple-100 flex items-center justify-between gap-2 shadow-2xs">
              <div className="text-left truncate min-w-0">
                <span className="text-[10px] font-extrabold text-purple-700 uppercase tracking-wider block flex items-center gap-1">
                  <Smartphone className="w-3 h-3" /> Official UPI ID
                </span>
                <span className="font-mono font-extrabold text-xs text-slate-900 truncate block">
                  {upiId}
                </span>
              </div>
              <button
                type="button"
                id="copy-qr-upi-quick-btn"
                onClick={() => copyToClipboard(upiId, 'upi')}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                  copiedUpi 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-purple-700 hover:bg-purple-800 text-white'
                }`}
              >
                {copiedUpi ? (
                  <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Copied!</span>
                ) : (
                  <span className="flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</span>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="enlarge-qr-button"
                onClick={() => setIsQrModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Enlarge QR</span>
              </button>
              <button
                type="button"
                id="download-qr-button"
                onClick={handleDownloadQr}
                className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 text-xs font-bold transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-teal-700" />
                <span>Download QR</span>
              </button>
            </div>

            {/* Supported Apps Chips */}
            <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-semibold text-slate-600">
              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200">Google Pay</span>
              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200">PhonePe</span>
              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200">Paytm</span>
              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200">BHIM</span>
            </div>
          </div>
        </div>

        {/* Right Column: Bank Account Details Rows */}
        <div className="lg:col-span-7 grid grid-cols-1 gap-3 sm:gap-3.5 text-sm">
          
          {/* Bank */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 gap-1 sm:gap-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Bank Name
            </span>
            <span className="font-bold text-slate-900 text-base">
              {bankName}
            </span>
          </div>

          {/* Account Name */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 gap-1 sm:gap-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Account Name
            </span>
            <span className="font-bold text-slate-900 text-base">
              {accountName}
            </span>
          </div>

          {/* Account Number with Copy Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-teal-50/60 border border-teal-100 gap-3">
            <div>
              <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
                Account Number
              </span>
              <span className="font-mono font-extrabold text-slate-900 text-lg sm:text-xl tracking-wider">
                {accountNumber}
              </span>
            </div>
            <button
              type="button"
              id="copy-account-number-btn"
              onClick={() => copyToClipboard(accountNumber, 'acc')}
              className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs transition-all shadow-sm cursor-pointer ${
                copiedAcc 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-teal-700 hover:bg-teal-800 text-white'
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
                {ifscCode}
              </span>
            </div>
            <button
              type="button"
              id="copy-ifsc-btn"
              onClick={() => copyToClipboard(ifscCode, 'ifsc')}
              className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs transition-all shadow-sm cursor-pointer ${
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

          {/* Official UPI VPA with Copy Button */}
          {upiId && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-purple-50/60 border border-purple-100 gap-3">
              <div>
                <span className="text-xs font-bold text-purple-800 uppercase tracking-wider block flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-purple-700" />
                  <span>Official UPI VPA / ID</span>
                </span>
                <span className="font-mono font-extrabold text-slate-900 text-base sm:text-lg tracking-wider">
                  {upiId}
                </span>
              </div>
              <button
                type="button"
                id="copy-upi-btn"
                onClick={() => copyToClipboard(upiId, 'upi')}
                className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs transition-all shadow-sm cursor-pointer ${
                  copiedUpi 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-purple-700 hover:bg-purple-800 text-white'
                }`}
              >
                {copiedUpi ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy UPI ID</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Branch */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 gap-1 sm:gap-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Branch
            </span>
            <span className="font-semibold text-slate-800">
              {branch}
            </span>
          </div>

          {/* Account Type */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 gap-1 sm:gap-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Account Type
            </span>
            <span className="font-semibold text-slate-800">
              {accountType}
            </span>
          </div>

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

      {/* Lightbox Modal for Full Screen QR Code */}
      {isQrModalOpen && (
        <div 
          id="qr-lightbox-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsQrModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-center space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pt-2 space-y-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-bold border border-teal-200">
                <FileCheck className="w-3 h-3" /> Official Donation QR
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                {accountName}
              </h3>
              <p className="text-xs text-slate-500">
                Scan using any UPI Payment Application
              </p>
            </div>

            {/* Large QR Display */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center">
              <img 
                src={qrCodeUrl} 
                alt="Enlarged Donation QR Code" 
                className="w-64 h-64 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* UPI ID display */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
              <div className="text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">UPI VPA</span>
                <span className="font-mono font-bold text-xs text-slate-900">{upiId}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(upiId, 'upi')}
                className="px-3 py-1.5 rounded-lg bg-teal-800 text-white text-xs font-bold hover:bg-teal-900 cursor-pointer transition-colors"
              >
                {copiedUpi ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDownloadQr}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download QR Image</span>
              </button>
              <button
                type="button"
                onClick={() => setIsQrModalOpen(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
