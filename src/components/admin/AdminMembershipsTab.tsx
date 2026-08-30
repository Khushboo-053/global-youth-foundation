import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  Edit3, 
  Trash2, 
  Plus, 
  Award, 
  CreditCard, 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Check, 
  X,
  FileText,
  UserCheck
} from 'lucide-react';
import { UserAccount } from '../../types';
import { DigitalIdCard } from '../DigitalIdCard';
import { Modal } from '../Modal';

interface AdminMembershipsTabProps {
  users: UserAccount[];
  onUpdateUser: (userId: string, data: Partial<UserAccount>) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<{ success: boolean; error?: string }>;
}

export const AdminMembershipsTab: React.FC<AdminMembershipsTabProps> = ({
  users,
  onUpdateUser,
  onDeleteUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Member' | 'Applicant' | 'Volunteer' | 'Guest'>('all');
  const [chapterFilter, setChapterFilter] = useState('all');
  
  // Modals
  const [selectedUserForCard, setSelectedUserForCard] = useState<UserAccount | null>(null);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<UserAccount | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserAccount | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // New Member Form State
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newChapter, setNewChapter] = useState('Srinagar Central');
  const [newBloodGroup, setNewBloodGroup] = useState('O+');
  const [newStatus, setNewStatus] = useState<'Member' | 'Applicant' | 'Volunteer'>('Member');
  const [newRoleTitle, setNewRoleTitle] = useState('Youth Advocate');

  // Edit form state
  const [editFullName, setEditFullName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editChapter, setEditChapter] = useState('');
  const [editBloodGroup, setEditBloodGroup] = useState('');
  const [editStatus, setEditStatus] = useState<'Member' | 'Applicant' | 'Volunteer' | 'Guest' | 'Admin'>('Member');
  const [editMembershipId, setEditMembershipId] = useState('');
  const [editRoleTitle, setEditRoleTitle] = useState('');

  const membersList = users.filter(u => u.role !== 'admin');
  const approvedMembers = membersList.filter(u => u.membershipStatus === 'Member');
  const pendingApplicants = membersList.filter(u => u.membershipStatus === 'Applicant');
  const volunteerMembers = membersList.filter(u => u.membershipStatus === 'Volunteer');

  const chapters = Array.from(new Set(users.map(u => u.chapter).filter(Boolean))) as string[];

  const filteredMembers = membersList.filter(user => {
    const matchesSearch = 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.includes(searchTerm)) ||
      (user.membershipId && user.membershipId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.chapter && user.chapter.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || user.membershipStatus === statusFilter;
    const matchesChapter = chapterFilter === 'all' || user.chapter === chapterFilter;

    return matchesSearch && matchesStatus && matchesChapter;
  });

  const handleOpenEdit = (user: UserAccount) => {
    setSelectedUserForEdit(user);
    setEditFullName(user.fullName);
    setEditEmail(user.email);
    setEditPhone(user.phone || '');
    setEditChapter(user.chapter || 'Srinagar Central');
    setEditBloodGroup(user.bloodGroup || 'O+');
    setEditStatus(user.membershipStatus);
    setEditMembershipId(user.membershipId || `GYF-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    setEditRoleTitle(user.roleTitle || 'Youth Advocate');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForEdit) return;

    await onUpdateUser(selectedUserForEdit.id, {
      fullName: editFullName,
      email: editEmail,
      phone: editPhone,
      chapter: editChapter,
      bloodGroup: editBloodGroup,
      membershipStatus: editStatus,
      membershipId: editMembershipId,
      roleTitle: editRoleTitle,
      isActive: editStatus === 'Member' || editStatus === 'Volunteer' || editStatus === 'Admin'
    });

    setActionSuccess(`Membership details for "${editFullName}" updated successfully.`);
    setSelectedUserForEdit(null);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleApproveMembership = async (user: UserAccount) => {
    const memId = user.membershipId || `GYF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    await onUpdateUser(user.id, {
      membershipStatus: 'Member',
      membershipId: memId,
      isActive: true,
      roleTitle: 'Registered Member & Youth Advocate'
    });
    setActionSuccess(`Membership for ${user.fullName} approved with ID #${memId}!`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleRejectMembership = async (user: UserAccount) => {
    await onUpdateUser(user.id, {
      membershipStatus: 'Guest',
      isActive: false
    });
    setActionSuccess(`Membership application for ${user.fullName} rejected.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `usr_${Date.now()}`;
    const generatedMemId = `GYF-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAccount: UserAccount = {
      id: newId,
      fullName: newFullName,
      email: newEmail,
      phone: newPhone,
      chapter: newChapter,
      bloodGroup: newBloodGroup,
      membershipStatus: newStatus,
      membershipId: newStatus === 'Member' ? generatedMemId : undefined,
      roleTitle: newRoleTitle,
      role: newStatus === 'Volunteer' ? 'volunteer' : 'user',
      joinedDate: new Date().toISOString().split('T')[0],
      isActive: true,
      skills: ['Community Mobilization', 'Youth Leadership']
    };

    await onUpdateUser(newId, newAccount);
    setShowAddModal(false);
    setNewFullName('');
    setNewEmail('');
    setNewPhone('');
    setActionSuccess(`New member account created with ID #${generatedMemId}!`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    await onDeleteUser(userToDelete.id);
    setActionSuccess(`Membership record for ${userToDelete.fullName} deleted.`);
    setUserToDelete(null);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner & KPI Summary Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-teal-800" />
            <span>Membership & Citizen Roster Management</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Approve applicants, manage digital membership credentials, issue verification IDs, and configure member tiers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Member / Applicant</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Total Enrolled</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{membersList.length}</div>
          <span className="text-[11px] text-slate-500 font-medium">All registered citizens</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider">Active Members</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-950 mt-2">{approvedMembers.length}</div>
          <span className="text-[11px] text-emerald-700 font-medium">Digital ID Issued</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-amber-800 uppercase tracking-wider">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-950 mt-2">{pendingApplicants.length}</div>
          <span className="text-[11px] text-amber-700 font-medium">Awaiting approval</span>
        </div>

        <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-teal-800 uppercase tracking-wider">Volunteers</span>
            <UserCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-teal-950 mt-2">{volunteerMembers.length}</div>
          <span className="text-[11px] text-teal-700 font-medium">Field Taskforce</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, membership ID (#GYF-...), phone, district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-800"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-800"
          >
            <option value="all">All Statuses ({membersList.length})</option>
            <option value="Member">Approved Members ({approvedMembers.length})</option>
            <option value="Applicant">Pending Applicants ({pendingApplicants.length})</option>
            <option value="Volunteer">Volunteers ({volunteerMembers.length})</option>
            <option value="Guest">Guest / Inactive</option>
          </select>

          <select
            value={chapterFilter}
            onChange={(e) => setChapterFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-800"
          >
            <option value="all">All Chapters</option>
            {chapters.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold">
                <th className="py-3.5 px-4">Member Name & Contact</th>
                <th className="py-3.5 px-4">Membership ID</th>
                <th className="py-3.5 px-4">Chapter / District</th>
                <th className="py-3.5 px-4">Blood Group</th>
                <th className="py-3.5 px-4">Status & Tier</th>
                <th className="py-3.5 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="font-bold text-sm text-slate-600">No member records match your query.</p>
                    <p className="text-xs mt-0.5">Try clearing filters or search terms.</p>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => {
                  const isApproved = member.membershipStatus === 'Member';
                  const isPending = member.membershipStatus === 'Applicant';
                  const isVol = member.membershipStatus === 'Volunteer';

                  return (
                    <tr key={member.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 font-black flex items-center justify-center text-xs shrink-0">
                            {member.fullName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                              <span>{member.fullName}</span>
                              {isApproved && (
                                <span title="Verified Member">
                                  <ShieldCheck className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate flex items-center gap-2 mt-0.5">
                              <span>{member.email}</span>
                              {member.phone && <span>• {member.phone}</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Membership ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {member.membershipId ? (
                          <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-900 border border-slate-200">
                            #{member.membershipId}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Not Assigned</span>
                        )}
                      </td>

                      {/* Chapter */}
                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{member.chapter || 'Central HQ'}</span>
                        </div>
                      </td>

                      {/* Blood Group */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-bold border border-rose-200 text-[11px]">
                          {member.bloodGroup || 'O+'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {isApproved && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-extrabold text-[11px]">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Active Member</span>
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-extrabold text-[11px]">
                            <Clock className="w-3 h-3" />
                            <span>Pending Applicant</span>
                          </span>
                        )}
                        {isVol && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 font-extrabold text-[11px]">
                            <UserCheck className="w-3 h-3" />
                            <span>Volunteer</span>
                          </span>
                        )}
                        {member.membershipStatus === 'Guest' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-extrabold text-[11px]">
                            <XCircle className="w-3 h-3" />
                            <span>Guest / Inactive</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Approve / Reject for Applicants */}
                          {isPending && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApproveMembership(member)}
                                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 transition-colors cursor-pointer"
                                title="Approve Membership Application"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRejectMembership(member)}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 transition-colors cursor-pointer"
                                title="Reject Membership Application"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}

                          {/* Digital ID Card Preview */}
                          <button
                            type="button"
                            onClick={() => setSelectedUserForCard(member)}
                            className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-700 text-teal-800 hover:text-white border border-teal-200 transition-colors cursor-pointer"
                            title="View / Issue Digital ID Card"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Member Details */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(member)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-800 text-slate-600 hover:text-white transition-colors cursor-pointer"
                            title="Edit Member Information"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Member */}
                          <button
                            type="button"
                            onClick={() => setUserToDelete(member)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white transition-colors cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* MODAL 1: Digital ID Card Preview & Export */}
      {selectedUserForCard && (
        <Modal 
          isOpen={!!selectedUserForCard} 
          onClose={() => setSelectedUserForCard(null)}
          title={`Digital Membership Card: ${selectedUserForCard.fullName}`}
          size="md"
        >
          <div className="space-y-5">
            <div className="flex justify-center p-2">
              <DigitalIdCard 
                user={selectedUserForCard} 
                membershipNumber={selectedUserForCard.membershipId || 'GYF-2026-PENDING'} 
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
              <div className="text-slate-500 font-medium">
                QR Verification Hash: <strong className="font-mono text-slate-800">SHA256-{selectedUserForCard.id}</strong>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUserForCard(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 2: Edit Member Information */}
      {selectedUserForEdit && (
        <Modal
          isOpen={!!selectedUserForEdit}
          onClose={() => setSelectedUserForEdit(null)}
          title={`Edit Member: ${selectedUserForEdit.fullName}`}
          size="lg"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-bold text-slate-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-slate-500">Full Name</label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-800"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-slate-500">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-800"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-slate-500">Phone Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-slate-500">Chapter / District</label>
                <input
                  type="text"
                  value={editChapter}
                  onChange={(e) => setEditChapter(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-slate-500">Membership ID</label>
                <input
                  type="text"
                  value={editMembershipId}
                  onChange={(e) => setEditMembershipId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-slate-500">Blood Group</label>
                <select
                  value={editBloodGroup}
                  onChange={(e) => setEditBloodGroup(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-800"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-slate-500">Membership Tier / Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-800"
                >
                  <option value="Member">Approved Active Member</option>
                  <option value="Applicant">Pending Applicant</option>
                  <option value="Volunteer">Youth Volunteer</option>
                  <option value="Guest">Guest / Inactive</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-slate-500">Designation / Role Title</label>
                <input
                  type="text"
                  value={editRoleTitle}
                  onChange={(e) => setEditRoleTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedUserForEdit(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-extrabold shadow-sm transition-all"
              >
                Save Member Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 3: Add New Member Form */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Enroll New Member / Volunteer"
          size="lg"
        >
          <form onSubmit={handleCreateMember} className="space-y-4 text-xs font-bold text-slate-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-slate-500">Full Name *</label>
                <input
                  type="text"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="e.g. Zaid Khan"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-800"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-slate-500">Email Address *</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="zaid@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-800"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-slate-500">Phone Number</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+91 94190 XXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-slate-500">Chapter / District</label>
                <input
                  type="text"
                  value={newChapter}
                  onChange={(e) => setNewChapter(e.target.value)}
                  placeholder="Srinagar / Baramulla / Anantnag"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-slate-500">Blood Group</label>
                <select
                  value={newBloodGroup}
                  onChange={(e) => setNewBloodGroup(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-800"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-slate-500">Membership Tier</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-800"
                >
                  <option value="Member">Approved Member (Immediate Digital ID)</option>
                  <option value="Applicant">Pending Applicant</option>
                  <option value="Volunteer">Youth Volunteer</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-extrabold shadow-sm transition-all"
              >
                Enroll Member
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 4: Delete Confirmation */}
      {userToDelete && (
        <Modal
          isOpen={!!userToDelete}
          onClose={() => setUserToDelete(null)}
          title="Confirm Member Record Removal"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              Are you sure you want to remove the membership record for <strong className="text-slate-900">{userToDelete.fullName}</strong> ({userToDelete.email})?
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
              >
                Yes, Delete Record
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
