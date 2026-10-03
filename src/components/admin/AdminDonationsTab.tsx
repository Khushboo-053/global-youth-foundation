import React, { useState } from 'react';
import {
  Heart,
  DollarSign,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Check,
  Mail,
  Phone,
  FileText,
  Trash2
} from 'lucide-react';
import { DonationRecord } from '../../types';
import { DonationDetailModal } from './DonationDetailModal';

interface AdminDonationsTabProps {
  donations: DonationRecord[];
  onUpdateStatus: (id: string, status: 'Verified' | 'Pending Verification' | 'Failed') => Promise<void>;
  onDeleteDonation: (id: string) => Promise<void>;
}

export const AdminDonationsTab: React.FC<AdminDonationsTabProps> = ({
  donations,
  onUpdateStatus,
  onDeleteDonation
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Verified' | 'Pending Verification' | 'Failed'>('all');
  const [selectedDonation, setSelectedDonation] = useState<DonationRecord | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Financial Metrics
  const totalCount = donations.length;
  const totalAmount = donations.reduce((sum, d) => sum + (d.paymentStatus !== 'Failed' ? d.amount : 0), 0);
  const verifiedAmount = donations
    .filter(d => d.paymentStatus === 'Verified')
    .reduce((sum, d) => sum + d.amount, 0);
  const pendingCount = donations.filter(d => d.paymentStatus === 'Pending Verification').length;
  const pendingAmount = donations
    .filter(d => d.paymentStatus === 'Pending Verification')
    .reduce((sum, d) => sum + d.amount, 0);

  const filteredDonations = donations.filter(d => {
    const matchesSearch =
      d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.phone && d.phone.includes(searchTerm));

    const matchesStatus = statusFilter === 'all' || d.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleQuickVerify = async (id: string, donorName: string) => {
    await onUpdateStatus(id, 'Verified');
    setActionSuccess(`Donation from "${donorName}" marked Verified & Reconciled.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you certain you want to permanently delete this donation record? This action cannot be undone.')) {
      await onDeleteDonation(id);
      setActionSuccess('Donation record permanently deleted.');
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Financial Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Heart className="w-6 h-6 text-rose-600 fill-rose-100" />
            Donations & Philanthropic Treasury Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Reconcile direct banking transfers, verify UTR IDs, and audit contributions.
          </p>
        </div>
      </div>

      {/* Financial KPI Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Contributions
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            ₹ {totalAmount.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 font-semibold mt-0.5 block">
            {totalCount} Total receipts
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Reconciled & Verified
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            ₹ {verifiedAmount.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">
            Audited in bank
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Pending Verification
          </span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {pendingCount}
          </div>
          <span className="text-[11px] text-amber-700 font-semibold mt-0.5 block">
            ₹ {pendingAmount.toLocaleString('en-IN')} unverified
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Average Contribution
          </span>
          <div className="text-2xl font-black text-teal-800 mt-1">
            ₹ {totalCount > 0 ? Math.round(totalAmount / totalCount).toLocaleString('en-IN') : 0}
          </div>
          <span className="text-[11px] text-teal-700 font-semibold mt-0.5 block">
            Per receipt average
          </span>
        </div>
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

      {/* Search & Status Filters */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by donor name, email, or UTR / reference transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 shrink-0">
          <span className="text-xs font-bold text-slate-500 shrink-0">Status:</span>
          {(['all', 'Verified', 'Pending Verification', 'Failed'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${statusFilter === st
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              {st === 'all' ? 'All Donations' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Donor / Entity</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Amount (INR)</th>
                <th className="py-3.5 px-4">Banking Reference (UTR)</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Audit Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredDonations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No donation records found.
                  </td>
                </tr>
              ) : (
                filteredDonations.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="font-bold text-slate-900 truncate">
                        {d.donorName}
                      </div>
                      <span className="text-[11px] text-slate-400">ID: {d.id}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="text-slate-800 font-semibold truncate flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{d.email}</span>
                        </div>
                        {d.phone && (
                          <div className="text-slate-500 text-[11px] flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{d.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-black text-slate-900 text-sm">
                        ₹ {d.amount.toLocaleString('en-IN')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs font-semibold text-teal-900 bg-teal-50 px-2 py-0.5 rounded-md">
                        {d.transactionId}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {d.donationDate}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${d.paymentStatus === 'Verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : d.paymentStatus === 'Pending Verification'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                        {d.paymentStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {d.paymentStatus !== 'Verified' && (
                          <button
                            type="button"
                            onClick={() => handleQuickVerify(d.id, d.donorName)}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                            title="Quick Verify"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setSelectedDonation(d)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-teal-800 hover:bg-teal-50 transition-colors"
                          title="View Receipt & Audit Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(d.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Donation Detail Modal */}
      <DonationDetailModal
        isOpen={!!selectedDonation}
        onClose={() => setSelectedDonation(null)}
        donation={selectedDonation}
        onUpdateStatus={onUpdateStatus}
      />
    </div>
  );
};
