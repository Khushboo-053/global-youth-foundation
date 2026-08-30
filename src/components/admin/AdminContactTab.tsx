import React, { useState } from 'react';
import { 
  Mail, 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  Clock, 
  User, 
  Phone, 
  Calendar,
  ExternalLink,
  RefreshCw,
  MailCheck,
  Inbox
} from 'lucide-react';
import { ContactMessage } from '../../types';

interface AdminContactTabProps {
  contactMessages: ContactMessage[];
  onOpenMessageModal: (msg: ContactMessage) => void;
  onToggleRead: (id: string, isRead: boolean) => Promise<void>;
  onDeleteMessage: (id: string) => Promise<void>;
  onRefresh: () => void;
}

export const AdminContactTab: React.FC<AdminContactTabProps> = ({
  contactMessages,
  onOpenMessageModal,
  onToggleRead,
  onDeleteMessage,
  onRefresh
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const unreadCount = contactMessages.filter(m => !m.isRead).length;

  const filteredMessages = contactMessages.filter(msg => {
    const matchesSearch = 
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'unread' && !msg.isRead) || 
      (statusFilter === 'read' && msg.isRead);

    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the message from "${name}"?`)) {
      setDeletingId(id);
      try {
        await onDeleteMessage(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Quick stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <span>Contact Messages</span>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-xs font-bold">
                {unreadCount} new
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500">
            Citizen and partner inquiries submitted through the public contact desk
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Inbox</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or message..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({contactMessages.length})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('unread')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'unread'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Unread ({unreadCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('read')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'read'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Read ({contactMessages.length - unreadCount})</span>
          </button>
        </div>

      </div>

      {/* Messages List / Table */}
      {filteredMessages.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-3">
          <Inbox className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700">No contact messages found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {statusFilter === 'unread' 
              ? 'You have caught up on all incoming inquiries!'
              : 'Inquiries submitted via the Contact form will appear here in real-time.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filteredMessages.map((msg) => {
              return (
                <div
                  key={msg.id}
                  className={`p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 ${
                    !msg.isRead ? 'bg-teal-50/30' : 'bg-white'
                  }`}
                >
                  {/* Left info */}
                  <div 
                    onClick={() => onOpenMessageModal(msg)}
                    className="cursor-pointer space-y-1.5 flex-1 min-w-0"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        !msg.isRead 
                          ? 'bg-teal-600 text-white shadow-xs' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {!msg.isRead ? 'Unread' : 'Read'}
                      </span>

                      <span className="text-sm font-extrabold text-slate-900">
                        {msg.name}
                      </span>

                      <span className="text-xs text-slate-500">
                        &lt;{msg.email}&gt;
                      </span>

                      <span className="text-[11px] text-slate-400 font-medium ml-auto md:ml-0">
                        {msg.dateSubmitted || 'Recent'}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-800 line-clamp-1">
                      {msg.subject}
                    </p>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {msg.message}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => onToggleRead(msg.id, !msg.isRead)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        msg.isRead
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          : 'bg-teal-100 hover:bg-teal-200 text-teal-800'
                      }`}
                    >
                      {msg.isRead ? 'Mark Unread' : 'Mark Read'}
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenMessageModal(msg)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 text-xs font-bold transition-colors"
                      title="View Message"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <a
                      href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 text-xs font-bold transition-colors"
                      title="Reply via Email"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <button
                      type="button"
                      disabled={deletingId === msg.id}
                      onClick={() => handleDelete(msg.id, msg.name)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-bold transition-colors disabled:opacity-50"
                      title="Delete Message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
