import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  Users,
  Send
} from 'lucide-react';
import { SystemNotification, UserRole } from '../../types';
import { BroadcastNotificationModal } from './BroadcastNotificationModal';

interface AdminNotificationsTabProps {
  notifications: SystemNotification[];
  onBroadcast: (notification: {
    title: string;
    message: string;
    type: 'info' | 'warning' | 'alert' | 'success';
    targetRole?: UserRole | 'all';
    actionLink?: string;
  }) => Promise<void>;
  onDeleteNotification: (id: string) => Promise<void>;
}

export const AdminNotificationsTab: React.FC<AdminNotificationsTabProps> = ({
  notifications,
  onBroadcast,
  onDeleteNotification
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'info' | 'warning' | 'alert' | 'success'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = 
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || n.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const handleBroadcastSubmit = async (data: any) => {
    await onBroadcast(data);
    setActionSuccess('Broadcast broadcasted successfully across platform channels.');
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleDelete = async (id: string) => {
    await onDeleteNotification(id);
    setActionSuccess('Notification removed.');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-teal-800" />
            System Broadcasts & Push Dispatch Centre
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Send real-time alerts, operational updates, and event invitations to members, volunteers, or all citizens.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
        >
          <Send className="w-4 h-4" />
          <span>Dispatch New Broadcast</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button 
            onClick={() => setActionSuccess(null)}
            className="text-emerald-600 hover:text-emerald-900 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search notification dispatches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 shrink-0">
          <span className="text-xs font-bold text-slate-500 shrink-0">Level:</span>
          {(['all', 'info', 'success', 'warning', 'alert'] as const).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setTypeFilter(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 capitalize ${
                typeFilter === lvl
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lvl === 'all' ? 'All Alerts' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 text-xs">
            No system broadcasts logged yet.
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  n.type === 'alert' ? 'bg-rose-100 text-rose-700' :
                  n.type === 'warning' ? 'bg-amber-100 text-amber-700' :
                  n.type === 'success' ? 'bg-emerald-100 text-emerald-700' :
                  'bg-teal-100 text-teal-800'
                }`}>
                  {n.type === 'alert' ? <AlertCircle className="w-5 h-5" /> :
                   n.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> :
                   n.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> :
                   <Info className="w-5 h-5" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-slate-900 text-sm">
                      {n.title}
                    </h4>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                      Audience: {n.targetRole ? n.targetRole.toUpperCase() : 'ALL'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {n.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                    {n.message}
                  </p>

                  {n.actionLink && (
                    <div className="text-[11px] font-semibold text-teal-800 pt-0.5">
                      Target Link: <code>{n.actionLink}</code>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => handleDelete(n.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                  title="Delete Notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Broadcast Modal */}
      <BroadcastNotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBroadcast={handleBroadcastSubmit}
      />
    </div>
  );
};
