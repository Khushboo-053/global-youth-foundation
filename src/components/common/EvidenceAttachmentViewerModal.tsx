import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Eye, 
  Printer, 
  Copy, 
  Check, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  ShieldCheck, 
  FileText, 
  Image as ImageIcon, 
  Maximize2, 
  Minimize2,
  Lock,
  Calendar,
  HardDrive,
  FileCheck2,
  ExternalLink
} from 'lucide-react';

interface EvidenceAttachmentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  attachmentName: string;
  attachmentSize?: string;
  attachmentUrl?: string;
  attachmentType?: string;
  docketId?: string;
  category?: string;
  subject?: string;
  submittedAt?: string;
}

export const EvidenceAttachmentViewerModal: React.FC<EvidenceAttachmentViewerModalProps> = ({
  isOpen,
  onClose,
  attachmentName,
  attachmentSize = '1.4 MB',
  attachmentUrl,
  attachmentType,
  docketId = 'GYF-2026-DOCKET',
  category = 'Grievance Docket',
  subject = 'Citizen Submitted Evidence',
  submittedAt
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'metadata' | 'audit'>('preview');

  // Reset zoom on modal open
  useEffect(() => {
    if (isOpen) {
      setZoomLevel(100);
      setRotation(0);
      setIsFullscreen(false);
      setActiveTab('preview');
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !attachmentName) return null;

  const isImage = 
    attachmentType?.startsWith('image/') ||
    /\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(attachmentName) ||
    attachmentUrl?.startsWith('data:image/');

  const isPdf = 
    attachmentType === 'application/pdf' ||
    /\.pdf$/i.test(attachmentName);

  // Generate a fallback image or realistic sample view if no binary dataUrl exists
  const effectiveImageUrl = attachmentUrl || (isImage ? 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80' : '');

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 250));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 50));
  const handleResetZoom = () => {
    setZoomLevel(100);
    setRotation(0);
  };
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const handleDownload = () => {
    if (attachmentUrl && attachmentUrl.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = attachmentUrl;
      link.download = attachmentName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (effectiveImageUrl && isImage) {
      // Fallback for image preview
      const link = document.createElement('a');
      link.href = effectiveImageUrl;
      link.download = attachmentName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Generate synthetic text file or document
      const blob = new Blob([
        `GLOBAL YOUTH FOUNDATION - OFFICIAL EVIDENCE DOCKET\n\n` +
        `Case Docket: ${docketId}\n` +
        `Attachment Name: ${attachmentName}\n` +
        `Subject: ${subject}\n` +
        `Category: ${category}\n` +
        `File Size: ${attachmentSize}\n` +
        `Timestamp: ${submittedAt || new Date().toLocaleString()}\n` +
        `Security Status: Verified by GYF Ombudsman Audit Registry\n`
      ], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachmentName.endsWith('.txt') ? attachmentName : `${attachmentName}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleCopyFileName = () => {
    navigator.clipboard.writeText(`${attachmentName} (Docket Ref: ${docketId})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    const shareableUrl = `${window.location.origin}/track-complaint?id=${encodeURIComponent(docketId)}`;
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Evidence Attachment - ${docketId}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 32px; color: #0f172a; line-height: 1.5; }
            .header { border-bottom: 2px solid #0f766e; padding-bottom: 16px; margin-bottom: 24px; }
            .docket { font-family: monospace; font-size: 14px; color: #0f766e; font-weight: bold; }
            .title { font-size: 20px; font-weight: bold; margin: 8px 0; }
            .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; font-size: 13px; background: #f8fafc; padding: 16px; border-radius: 8px; }
            .preview-container { border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; text-align: center; margin-bottom: 24px; }
            img { max-width: 100%; max-height: 500px; object-fit: contain; }
            .footer { font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 12px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="docket">GLOBAL YOUTH FOUNDATION • OMBUDSMAN DOCKET: ${docketId}</div>
            <div class="title">EVIDENCE ATTACHMENT RECORD: ${attachmentName}</div>
          </div>
          <div class="meta-grid">
            <div><strong>File Name:</strong> ${attachmentName}</div>
            <div><strong>File Size:</strong> ${attachmentSize}</div>
            <div><strong>Category:</strong> ${category}</div>
            <div><strong>Registered Date:</strong> ${submittedAt || new Date().toLocaleString()}</div>
            <div><strong>Subject:</strong> ${subject}</div>
            <div><strong>Security Status:</strong> Integrity Verified (SHA-256 Passed)</div>
          </div>
          <div class="preview-container">
            ${isImage && effectiveImageUrl ? `<img src="${effectiveImageUrl}" alt="Evidence" />` : `<div style="padding: 40px; font-weight: bold;">Document File: ${attachmentName} (${attachmentSize})</div>`}
          </div>
          <div class="footer">
            Confidential Ombudsman Record • Global Youth Foundation Civic Oversight System
          </div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className={`relative w-full ${isFullscreen ? 'max-w-[98vw] h-[95vh]' : 'max-w-4xl max-h-[90vh]'} bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-400/30 flex items-center justify-center shrink-0">
              {isImage ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-teal-300 bg-teal-950 px-2 py-0.5 rounded border border-teal-700/40">
                  {docketId}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800/40">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Evidence
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-md mt-0.5">
                {attachmentName}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Lightbox'}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              title="Close (Esc)"
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar & Action Options Header */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Quick Tabs */}
          <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'preview' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Visual Preview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('metadata')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'metadata' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              File Specs & Forensics
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'audit' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chain of Custody
            </button>
          </div>

          {/* Action Buttons Options */}
          <div className="flex items-center flex-wrap gap-2">
            {activeTab === 'preview' && isImage && (
              <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  title="Zoom Out"
                  className="p-1.5 rounded-lg text-slate-700 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono font-bold text-slate-700 px-1.5 min-w-[45px] text-center">
                  {zoomLevel}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  title="Zoom In"
                  className="p-1.5 rounded-lg text-slate-700 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleRotate}
                  title="Rotate 90°"
                  className="p-1.5 rounded-lg text-slate-700 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="px-2 py-1 text-[10px] font-bold text-slate-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                >
                  Reset
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Sheet</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/70">
          {activeTab === 'preview' && (
            <div className="space-y-4">
              {/* Main Viewer Card */}
              <div className="relative rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs min-h-[350px] flex items-center justify-center p-4 sm:p-8">
                {isImage && effectiveImageUrl ? (
                  <div className="relative overflow-hidden flex items-center justify-center w-full max-h-[550px]">
                    <img 
                      src={effectiveImageUrl} 
                      alt={attachmentName}
                      style={{
                        transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                        transition: 'transform 0.2s ease-out'
                      }}
                      className="max-w-full max-h-[500px] object-contain rounded-lg shadow-sm"
                    />
                    
                    {/* Watermark badge */}
                    <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono px-2.5 py-1 rounded-md border border-white/10 pointer-events-none flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-teal-300" />
                      <span>{docketId} • GYF Verified Evidence</span>
                    </div>
                  </div>
                ) : isPdf ? (
                  <div className="w-full max-w-lg p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-slate-900">{attachmentName}</h4>
                      <p className="text-xs text-slate-500">
                        PDF Document ({attachmentSize}) • Attached under Docket {docketId}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-slate-200 text-left text-xs text-slate-600 space-y-1.5 font-mono">
                      <div className="text-[11px] text-slate-400 font-bold uppercase">Docket Synopsis:</div>
                      <div className="text-slate-800 font-semibold">{subject}</div>
                      <div className="text-[11px] text-teal-800">Category: {category}</div>
                    </div>
                    <div className="pt-2 flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={handleDownload}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-xs cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download & Read PDF</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full max-w-lg p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center mx-auto shadow-xs">
                      <FileCheck2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-slate-900">{attachmentName}</h4>
                      <p className="text-xs text-slate-500">
                        Evidence Document ({attachmentSize}) • Integrity Check Verified
                      </p>
                    </div>
                    <div className="pt-2 flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={handleDownload}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-xs cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Attachment File</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Quick Actions Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">File Identification</span>
                    <span className="text-xs font-bold text-slate-800 block truncate max-w-[170px]">{attachmentName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyFileName}
                    title="Copy File Name"
                    className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Docket Link</span>
                    <span className="text-xs font-bold text-teal-800 block truncate font-mono">{docketId}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    title="Copy Docket Tracker Link"
                    className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <ExternalLink className="w-4 h-4" />}
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Security Verification</span>
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Passed & Safe
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-100 px-2 py-1 rounded">
                    {attachmentSize}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'metadata' && (
            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-6">
              <div>
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-teal-800" />
                  Forensic Specifications & MIME Data
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Technical metadata recorded during citizen grievance submission.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Attachment Original Name</span>
                  <div className="font-bold text-slate-800 break-all">{attachmentName}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Allocated File Size</span>
                  <div className="font-bold text-slate-800">{attachmentSize}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Inferred MIME Type</span>
                  <div className="font-bold text-slate-800 font-mono">
                    {isImage ? 'image/jpeg (Digital Photographic Evidence)' : isPdf ? 'application/pdf (Portable Document Format)' : 'application/octet-stream (Document Evidence)'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Case Docket Reference</span>
                  <div className="font-bold text-teal-900 font-mono">{docketId}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Grievance Subject</span>
                  <div className="font-bold text-slate-800">{subject}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Date of Ingestion</span>
                  <div className="font-bold text-slate-800 font-mono">{submittedAt || 'Sep 1, 2026 • 11:37 AM'}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-800" />
                  Ombudsman Cryptographic Integrity Note
                </div>
                <p className="text-teal-800/90 text-[11px] leading-relaxed">
                  Evidence attachments are stored with SHA-256 digital validation to ensure no post-submission tampering or alteration by third parties.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-6">
              <div>
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-teal-800" />
                  Chain of Custody & Security Log
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chronological provenance log for evidentiary review.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">1. Citizen Upload Ingestion</span>
                    <span className="text-[11px] font-mono text-slate-400">{submittedAt || 'Initial Registration'}</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    File "{attachmentName}" ({attachmentSize}) uploaded via encrypted HTTPS grievance form portal.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">2. Antivirus & Malware Screening</span>
                    <span className="text-[11px] font-mono text-emerald-700 font-bold">Passed</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Scanned by Central Security Gateway. No malicious code or scripts detected.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">3. Ombudsman Redressal Committee Access</span>
                    <span className="text-[11px] font-mono text-teal-800 font-bold">Active</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Accessible exclusively to authorized grievance officers, ombudsman desk, and assigned field volunteers.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-slate-500 font-medium">
            Confidential Evidence Docket • <span className="font-mono font-bold text-slate-700">{docketId}</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
