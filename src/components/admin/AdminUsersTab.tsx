import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  UserCheck, 
  AlertCircle,
  MoreVertical,
  ChevronDown,
  RefreshCw,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { UserAccount, UserRole } from '../../types';
import { UserDetailModal } from './UserDetailModal';
import { UserEditModal } from './UserEditModal';

interface AdminUsersTabProps {
  users: UserAccount[];
  currentUserId?: string;
  onUpdateRole: (userId: string, role: UserRole, roleTitle?: string) => Promise<{ success: boolean; error?: string }>;
  onToggleStatus: (userId: string) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<{ success: boolean; error?: string }>;
  onUpdateUser: (userId: string, data: Partial<UserAccount>) => Promise<void>;
}

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({
  users,
  currentUserId,
  onUpdateRole,
  onToggleStatus,
  onDeleteUser,
  onUpdateUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<UserAccount | null>(null);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<UserAccount | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserAccount | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const adminCount = users.filter(u => u.role === 'admin').length;

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.includes(searchTerm)) ||
      (user.city && user.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.chapter && user.chapter.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setActionError(null);
    setActionSuccess(null);
    const res = await onUpdateRole(userId, newRole);
    if (!res.success) {
      setActionError(res.error || 'Failed to update user role.');
    } else {
      setActionSuccess(`User role successfully changed to ${newRole.toUpperCase()}.`);
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    setActionError(null);
    setActionSuccess(null);
    const res = await onDeleteUser(userToDelete.id);
    if (!res.success) {
      setActionError(res.error || 'Failed to delete user.');
    } else {
      setActionSuccess(`User account "${userToDelete.fullName}" deleted successfully.`);
      setTimeout(() => setActionSuccess(null), 4000);
    }
    setUserToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-teal-800" />
            Users Management Roster
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage system administrators, youth volunteers, and registered citizen profiles.
          </p>
        </div>

        {/* Quick KPI Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
            Total Users: <strong className="text-slate-900">{users.length}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-xs font-bold text-purple-800">
            Admins: <strong className="text-purple-900">{adminCount}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-xs font-bold text-teal-800">
            Volunteers: <strong className="text-teal-900">{users.filter(u => u.role === 'volunteer').length}</strong>
          </span>
        </div>
      </div>

      {/* Action Notification Messages */}
      {actionError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button 
            onClick={() => setActionError(null)}
            className="text-rose-600 hover:text-rose-900 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

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
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, city, or chapter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
          />
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            Role:
          </span>
          {(['all', 'admin', 'volunteer', 'user'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 capitalize ${
                roleFilter === r
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r === 'all' ? 'All Roles' : r === 'user' ? 'Citizens' : r}
            </button>
          ))}
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">User Profile</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Location / Chapter</th>
                <th className="py-3.5 px-4">Role & Designation</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Registered</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No users found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isSelf = currentUserId === u.id;
                  const isSoleAdmin = u.role === 'admin' && adminCount <= 1;

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            u.role === 'admin' 
                              ? 'bg-purple-800 text-white' 
                              : u.role === 'volunteer' 
                              ? 'bg-teal-800 text-white' 
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            {u.fullName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 truncate flex items-center gap-1.5">
                              <span>{u.fullName}</span>
                              {isSelf && (
                                <span className="px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-800 text-[10px] font-black">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400">ID: {u.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="text-slate-800 font-semibold truncate flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{u.email}</span>
                          </div>
                          {u.phone && (
                            <div className="text-slate-500 text-[11px] flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{u.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Location / Chapter */}
                      <td className="py-3.5 px-4 text-slate-700">
                        {u.city ? (
                          <span className="font-semibold">{u.city}</span>
                        ) : u.chapter ? (
                          <span className="font-semibold text-teal-800">{u.chapter}</span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Role Dropdown */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <select
                            value={u.role}
                            disabled={isSoleAdmin}
                            onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                            className={`px-2.5 py-1 rounded-lg border text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-teal-700 ${
                              u.role === 'admin'
                                ? 'bg-purple-50 text-purple-800 border-purple-200'
                                : u.role === 'volunteer'
                                ? 'bg-teal-50 text-teal-800 border-teal-200'
                                : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            <option value="user">Citizen</option>
                            <option value="volunteer">Volunteer</option>
                            <option value="admin">Admin</option>
                          </select>
                          {u.roleTitle && (
                            <p className="text-[10px] text-slate-400 truncate max-w-[120px]">
                              {u.roleTitle}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Status Toggle Button */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => onToggleStatus(u.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                            u.isActive
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                          }`}
                          title="Click to toggle account activation"
                        >
                          {u.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          <span>{u.isActive ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>

                      {/* Registered Date */}
                      <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                        {u.joinedDate || '2025'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Detail */}
                          <button
                            type="button"
                            onClick={() => setSelectedUserForDetail(u)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-teal-800 hover:bg-teal-50 transition-colors"
                            title="View Full Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit User */}
                          <button
                            type="button"
                            onClick={() => setSelectedUserForEdit(u)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-sky-800 hover:bg-sky-50 transition-colors"
                            title="Edit User Info"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete User */}
                          <button
                            type="button"
                            disabled={isSelf || isSoleAdmin}
                            onClick={() => setUserToDelete(u)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title={isSelf ? 'Cannot delete self' : isSoleAdmin ? 'Cannot delete sole admin' : 'Delete user'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Dossier Modal */}
      <UserDetailModal
        isOpen={!!selectedUserForDetail}
        onClose={() => setSelectedUserForDetail(null)}
        user={selectedUserForDetail}
        onEdit={(usr) => {
          setSelectedUserForDetail(null);
          setSelectedUserForEdit(usr);
        }}
      />

      {/* User Edit Modal */}
      <UserEditModal
        isOpen={!!selectedUserForEdit}
        onClose={() => setSelectedUserForEdit(null)}
        user={selectedUserForEdit}
        onSave={onUpdateUser}
        isLastAdmin={selectedUserForEdit?.role === 'admin' && adminCount <= 1}
      />

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Confirm User Deletion
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to delete user <strong>{userToDelete.fullName}</strong> ({userToDelete.email})? This action will permanently revoke their access.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
