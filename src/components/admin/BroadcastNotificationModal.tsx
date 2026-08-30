import React, { useState } from 'react';
import { Modal } from '../Modal';
import { Bell, Send, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../../types';

interface BroadcastNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBroadcast: (notification: {
    title: string;
    message: string;
    type: 'info' | 'warning' | 'alert' | 'success';
    targetRole?: UserRole | 'all';
    actionLink?: string;
  }) => Promise<void>;
}

export const BroadcastNotificationModal: React.FC<BroadcastNotificationModalProps> = ({
  isOpen,
  onClose,
  onBroadcast
}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'info' | 'warning' | 'alert' | 'success'>('info');
  const [targetRole, setTargetRole] = useState<UserRole | 'all'>('all');
  const [actionLink, setActionLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setErrorMsg('Title and Message are required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await onBroadcast({
        title,
        message,
        type,
        targetRole,
        actionLink: actionLink.trim() || undefined
      });
      setTitle('');
      setMessage('');
      setActionLink('');
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to dispatch broadcast.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Dispatch Real-Time System Broadcast">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Broadcast Title / Subject *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Valley-Wide Volunteer Emergency Mobilization Notice"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Target Audience
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
            >
              <option value="all">All Users & Stakeholders</option>
              <option value="volunteer">Volunteers Only</option>
              <option value="admin">Administrators Only</option>
              <option value="user">Registered Citizens Only</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Alert Level / Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
            >
              <option value="info">Information (Blue)</option>
              <option value="success">Success / Achievement (Green)</option>
              <option value="warning">Action Required (Amber)</option>
              <option value="alert">Urgent / Emergency Alert (Red)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Broadcast Announcement Message *
          </label>
          <textarea
            rows={4}
            required
            placeholder="Provide clear, actionable details for users receiving this broadcast..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Optional Action Link / Route
          </label>
          <input
            type="text"
            placeholder="e.g. /events or /grievance or /programs"
            value={actionLink}
            onChange={(e) => setActionLink(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Transmitting...' : 'Transmit Broadcast'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
