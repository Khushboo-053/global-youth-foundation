import React from 'react';
import { ContactMessage } from '../../types';
import { Modal } from '../Modal';
import { Mail, Phone, Calendar, User, CheckCircle2, Clock, Trash2, ExternalLink } from 'lucide-react';

interface ContactDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: ContactMessage | null;
  onToggleRead: (id: string, isRead: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const ContactDetailModal: React.FC<ContactDetailModalProps> = ({
  isOpen,
  onClose,
  message,
  onToggleRead,
  onDelete
}) => {
  if (!message) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Contact Message Details"
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Status bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
              message.isRead 
                ? 'bg-slate-100 text-slate-700 border border-slate-200' 
                : 'bg-teal-50 text-teal-700 border border-teal-200'
            }`}>
              {message.isRead ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Read</span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
                  <span>New / Unread</span>
                </>
              )}
            </span>

            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{message.dateSubmitted || message.createdAt || 'Recent'}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleRead(message.id, !message.isRead)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                message.isRead 
                  ? 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700' 
                  : 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs'
              }`}
            >
              {message.isRead ? 'Mark as Unread' : 'Mark as Read'}
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this message?')) {
                  onDelete(message.id);
                  onClose();
                }
              }}
              className="p-1.5 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 text-rose-600 hover:text-rose-700 text-xs font-semibold transition-colors"
              title="Delete Message"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sender Info Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> Sender Name
            </span>
            <p className="text-sm font-extrabold text-slate-900">{message.name}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> Email Address
            </span>
            <a 
              href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}`}
              className="text-sm font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 break-all"
            >
              <span>{message.email}</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>

          {message.phone && (
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 sm:col-span-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> Contact Phone
              </span>
              <a 
                href={`tel:${message.phone}`}
                className="text-sm font-bold text-slate-800 hover:text-teal-700 block"
              >
                {message.phone}
              </a>
            </div>
          )}
        </div>

        {/* Subject & Message Content */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Subject
          </label>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900">
            {message.subject}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Full Inquiring Message
          </label>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap min-h-[120px]">
            {message.message}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <a
            href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>Reply via Official Email</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
