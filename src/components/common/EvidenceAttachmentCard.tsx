import React, { useState } from 'react';
import { Paperclip, Eye, Download, FileText, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import { EvidenceAttachmentViewerModal } from './EvidenceAttachmentViewerModal';

interface EvidenceAttachmentCardProps {
  attachmentName: string;
  attachmentSize?: string;
  attachmentUrl?: string;
  attachmentType?: string;
  docketId?: string;
  category?: string;
  subject?: string;
  submittedAt?: string;
  className?: string;
}

export const EvidenceAttachmentCard: React.FC<EvidenceAttachmentCardProps> = ({
  attachmentName,
  attachmentSize = '1.4 MB',
  attachmentUrl,
  attachmentType,
  docketId,
  category,
  subject,
  submittedAt,
  className = ''
}) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  if (!attachmentName) return null;

  const isImage = 
    attachmentType?.startsWith('image/') ||
    /\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(attachmentName) ||
    attachmentUrl?.startsWith('data:image/');

  return (
    <>
      <div 
        onClick={() => setIsViewerOpen(true)}
        className={`group p-3 rounded-2xl bg-teal-50/70 hover:bg-teal-100/80 border border-teal-200/80 hover:border-teal-400 text-xs text-teal-900 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-2xs hover:shadow-xs ${className}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsViewerOpen(true);
          }
        }}
        title="Click to view attachment options, preview & download"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-teal-800 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            {isImage ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-teal-950 truncate max-w-[220px] sm:max-w-[300px]">
                {attachmentName}
              </span>
              <span className="text-[10px] font-mono text-teal-700 bg-white/80 px-1.5 py-0.5 rounded border border-teal-200">
                {attachmentSize}
              </span>
            </div>
            <div className="text-[10px] text-teal-700 font-medium flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Evidence Attached • Click to inspect options & preview</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-800 group-hover:bg-teal-900 text-white text-[11px] font-bold shadow-xs transition-colors">
            <Eye className="w-3.5 h-3.5" />
            <span>View Attachment</span>
          </span>
        </div>
      </div>

      {/* Attachment Viewer & Options Modal */}
      <EvidenceAttachmentViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        attachmentName={attachmentName}
        attachmentSize={attachmentSize}
        attachmentUrl={attachmentUrl}
        attachmentType={attachmentType}
        docketId={docketId}
        category={category}
        subject={subject}
        submittedAt={submittedAt}
      />
    </>
  );
};
