import React, { useState } from 'react';
import { 
  UserCheck, 
  ShieldCheck, 
  Layers, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  MapPin, 
  AlertCircle, 
  Check, 
  X,
  FileText,
  KeyRound,
  Award
} from 'lucide-react';
import { UserAccount, VolunteerPermissions, Program, EventItem, GrievanceRecord } from '../../types';
import { Modal } from '../Modal';

interface AdminVolunteerAssignmentsTabProps {
  volunteers: UserAccount[];
  volunteerPermissions: Record<string, VolunteerPermissions>;
  programs: Program[];
  events: EventItem[];
  complaints: GrievanceRecord[];
  onUpdatePermissions: (volunteerId: string, perms: Partial<VolunteerPermissions>) => Promise<void>;
  onAssignGrievance: (complaintId: string, volunteerId: string, volunteerName: string, department?: string) => Promise<void>;
  onLogHours: (volunteerId: string, hours: number) => Promise<void>;
}

export const AdminVolunteerAssignmentsTab: React.FC<AdminVolunteerAssignmentsTabProps> = ({
  volunteers,
  volunteerPermissions,
  programs,
  events,
  complaints,
  onUpdatePermissions,
  onAssignGrievance,
  onLogHours
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState<UserAccount | null>(null);
  const [showAssignCaseModal, setShowAssignCaseModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showLogHoursModal, setShowLogHoursModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Assignment Modal Form
  const [targetVolunteerId, setTargetVolunteerId] = useState('');
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [assignmentDept, setAssignmentDept] = useState('Ombudsman Youth Field Taskforce');

  // Permission Modal Form
  const [canGrievances, setCanGrievances] = useState(true);
  const [canEvents, setCanEvents] = useState(true);
  const [canPrograms, setCanPrograms] = useState(false);
  const [canMembers, setCanMembers] = useState(false);
  const [assignedChapter, setAssignedChapter] = useState('Srinagar Central');

  // Hours Modal Form
  const [hoursToAward, setHoursToAward] = useState(5);
  const [hoursReason, setHoursReason] = useState('Field Verification & Outreach');

  const activeVolunteers = volunteers.filter(v => v.isActive);
  const pendingCases = complaints.filter(c => c.currentStatus !== 'Resolved' && c.currentStatus !== 'Closed');

  const filteredVolunteers = volunteers.filter(v => 
    v.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.chapter && v.chapter.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenPermissions = (v: UserAccount) => {
    setSelectedVolunteer(v);
    const existing = volunteerPermissions[v.id];
    setCanGrievances(existing ? existing.canManageGrievances : true);
    setCanEvents(existing ? existing.canManageEvents : true);
    setCanPrograms(existing ? existing.canManagePrograms : false);
    setCanMembers(existing ? existing.canViewMembers : false);
    setAssignedChapter(existing ? existing.assignedChapter : (v.chapter || 'Srinagar Central'));
    setShowPermissionsModal(true);
  };

  const handleSavePermissions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVolunteer) return;

    await onUpdatePermissions(selectedVolunteer.id, {
      volunteerId: selectedVolunteer.id,
      canManageGrievances: canGrievances,
      canManageEvents: canEvents,
      canManagePrograms: canPrograms,
      canViewMembers: canMembers,
      assignedChapter
    });

    setShowPermissionsModal(false);
    setActionSuccess(`Permissions updated for ${selectedVolunteer.fullName}.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleOpenAssignCase = (v?: UserAccount) => {
    if (v) {
      setTargetVolunteerId(v.id);
    } else if (activeVolunteers.length > 0) {
      setTargetVolunteerId(activeVolunteers[0].id);
    }
    if (pendingCases.length > 0) {
      setSelectedCaseId(pendingCases[0].id);
    }
    setShowAssignCaseModal(true);
  };

  const handleSaveAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseId || !targetVolunteerId) return;

    const vol = volunteers.find(v => v.id === targetVolunteerId);
    if (!vol) return;

    await onAssignGrievance(selectedCaseId, vol.id, vol.fullName, assignmentDept);
    setShowAssignCaseModal(false);
    setActionSuccess(`Grievance #${selectedCaseId.slice(0, 8)} assigned to ${vol.fullName}.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleSaveHours = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVolunteer) return;

    await onLogHours(selectedVolunteer.id, hoursToAward);
    setShowLogHoursModal(false);
    setActionSuccess(`Logged ${hoursToAward} service hours for ${selectedVolunteer.fullName}.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
            <KeyRound className="w-6 h-6 text-teal-800" />
            <span>Volunteer Assignments & Field Permissions Matrix</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Delegate citizen grievances, assign event tasks, approve service hours, and configure role-based access rights for field volunteers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenAssignCase()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Assign New Grievance Case</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* KPI Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Active Volunteers</span>
          <div className="text-2xl font-black text-slate-900 mt-2">{activeVolunteers.length}</div>
          <span className="text-[11px] text-teal-700 font-medium">Ready for deployment</span>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 shadow-2xs">
          <span className="text-[11px] font-extrabold text-indigo-800 uppercase tracking-wider">Assigned Cases</span>
          <div className="text-2xl font-black text-indigo-950 mt-2">
            {complaints.filter(c => c.assignedToVolunteerId).length}
          </div>
          <span className="text-[11px] text-indigo-700 font-medium">Under field investigation</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 shadow-2xs">
          <span className="text-[11px] font-extrabold text-amber-800 uppercase tracking-wider">Unassigned Cases</span>
          <div className="text-2xl font-black text-amber-950 mt-2">
            {complaints.filter(c => !c.assignedToVolunteerId && c.currentStatus !== 'Resolved').length}
          </div>
          <span className="text-[11px] text-amber-700 font-medium">Needs assignment</span>
        </div>

        <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/80 shadow-2xs">
          <span className="text-[11px] font-extrabold text-teal-800 uppercase tracking-wider">Total Field Hours</span>
          <div className="text-2xl font-black text-teal-950 mt-2">
            {volunteers.reduce((sum, v) => sum + (v.volunteerHours || 0), 0)} hrs
          </div>
          <span className="text-[11px] text-teal-700 font-medium">Verified service</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search volunteers by name, email, or chapter to manage assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-800"
          />
        </div>
      </div>

      {/* Volunteers Roster & Permissions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold">
                <th className="py-3.5 px-4">Volunteer Profile</th>
                <th className="py-3.5 px-4">Assigned Cases & Tasks</th>
                <th className="py-3.5 px-4">Service Hours</th>
                <th className="py-3.5 px-4">Permission Matrix</th>
                <th className="py-3.5 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredVolunteers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-bold">
                    No volunteers found.
                  </td>
                </tr>
              ) : (
                filteredVolunteers.map((vol) => {
                  const assignedGrievances = complaints.filter(c => c.assignedToVolunteerId === vol.id);
                  const perms = volunteerPermissions[vol.id] || {
                    canManageGrievances: true,
                    canManageEvents: true,
                    canManagePrograms: false,
                    canViewMembers: false,
                    assignedChapter: vol.chapter || 'Central'
                  };

                  return (
                    <tr key={vol.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Volunteer Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 font-black flex items-center justify-center text-xs shrink-0">
                            {vol.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900">{vol.fullName}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{vol.chapter || 'Central HQ'}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Assigned Cases */}
                      <td className="py-3.5 px-4">
                        {assignedGrievances.length > 0 ? (
                          <div className="space-y-1">
                            <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-extrabold border border-indigo-200 text-[11px]">
                              {assignedGrievances.length} Active {assignedGrievances.length === 1 ? 'Case' : 'Cases'}
                            </span>
                            <div className="text-[10px] text-slate-500 truncate max-w-xs">
                              {assignedGrievances.map(c => `#${c.id.slice(0, 6)} - ${c.category}`).join(', ')}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">No active cases</span>
                        )}
                      </td>

                      {/* Hours */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900">{vol.volunteerHours || 0} hrs</span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedVolunteer(vol);
                              setShowLogHoursModal(true);
                            }}
                            className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold"
                            title="Award service hours"
                          >
                            + Log
                          </button>
                        </div>
                      </td>

                      {/* Permissions Badges */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${
                            perms.canManageGrievances ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-400 border-slate-200'
                          }`}>
                            Grievances: {perms.canManageGrievances ? '✓' : '✗'}
                          </span>

                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${
                            perms.canManageEvents ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-400 border-slate-200'
                          }`}>
                            Events: {perms.canManageEvents ? '✓' : '✗'}
                          </span>

                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${
                            perms.canManagePrograms ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-400 border-slate-200'
                          }`}>
                            Programs: {perms.canManagePrograms ? '✓' : '✗'}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenAssignCase(vol)}
                            className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-700 text-teal-800 hover:text-white border border-teal-200 transition-colors cursor-pointer"
                            title="Assign Case / Task"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenPermissions(vol)}
                            className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-700 text-indigo-700 hover:text-white border border-indigo-200 transition-colors cursor-pointer"
                            title="Configure Permissions"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
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

      {/* MODAL 1: Assign Grievance Case */}
      {showAssignCaseModal && (
        <Modal
          isOpen={showAssignCaseModal}
          onClose={() => setShowAssignCaseModal(false)}
          title="Delegate Citizen Grievance to Volunteer"
          size="md"
        >
          <form onSubmit={handleSaveAssignment} className="space-y-4 text-xs font-bold text-slate-700">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-slate-500">Select Field Volunteer *</label>
              <select
                value={targetVolunteerId}
                onChange={(e) => setTargetVolunteerId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-teal-800"
                required
              >
                {activeVolunteers.map(v => (
                  <option key={v.id} value={v.id}>{v.fullName} ({v.chapter || 'Central'})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-slate-500">Select Citizen Grievance *</label>
              <select
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-teal-800"
                required
              >
                {pendingCases.map(c => (
                  <option key={c.id} value={c.id}>
                    #{c.id.slice(0, 8)} - {c.subject} ({c.category} | {c.district})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-slate-500">Ombudsman Department / Taskforce</label>
              <input
                type="text"
                value={assignmentDept}
                onChange={(e) => setAssignmentDept(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-teal-800"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowAssignCaseModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-extrabold shadow-sm"
              >
                Confirm Case Delegation
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 2: Permissions Configuration */}
      {showPermissionsModal && selectedVolunteer && (
        <Modal
          isOpen={showPermissionsModal}
          onClose={() => setShowPermissionsModal(false)}
          title={`Configure Permissions: ${selectedVolunteer.fullName}`}
          size="md"
        >
          <form onSubmit={handleSavePermissions} className="space-y-4 text-xs font-bold text-slate-700">
            <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-black text-slate-900 block">Manage Citizen Grievances</span>
                  <span className="text-[11px] text-slate-500 font-normal">Can view, investigate, add progress notes, and resolve cases</span>
                </div>
                <input
                  type="checkbox"
                  checked={canGrievances}
                  onChange={(e) => setCanGrievances(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-800 focus:ring-teal-800"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-200">
                <div>
                  <span className="text-xs font-black text-slate-900 block">Manage Events & Check-Ins</span>
                  <span className="text-[11px] text-slate-500 font-normal">Can verify ticket registrations and manage attendee entry</span>
                </div>
                <input
                  type="checkbox"
                  checked={canEvents}
                  onChange={(e) => setCanEvents(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-800 focus:ring-teal-800"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-200">
                <div>
                  <span className="text-xs font-black text-slate-900 block">Program Field Officer Access</span>
                  <span className="text-[11px] text-slate-500 font-normal">Can create program field reports and upload beneficiary logs</span>
                </div>
                <input
                  type="checkbox"
                  checked={canPrograms}
                  onChange={(e) => setCanPrograms(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-800 focus:ring-teal-800"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-200">
                <div>
                  <span className="text-xs font-black text-slate-900 block">View Member Directory</span>
                  <span className="text-[11px] text-slate-500 font-normal">Can search and view member contact details within chapter</span>
                </div>
                <input
                  type="checkbox"
                  checked={canMembers}
                  onChange={(e) => setCanMembers(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-800 focus:ring-teal-800"
                />
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-slate-500">Assigned Chapter / Region</label>
              <input
                type="text"
                value={assignedChapter}
                onChange={(e) => setAssignedChapter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-teal-800"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowPermissionsModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-extrabold shadow-sm"
              >
                Save Permissions
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 3: Log Hours */}
      {showLogHoursModal && selectedVolunteer && (
        <Modal
          isOpen={showLogHoursModal}
          onClose={() => setShowLogHoursModal(false)}
          title={`Award Service Hours: ${selectedVolunteer.fullName}`}
          size="sm"
        >
          <form onSubmit={handleSaveHours} className="space-y-4 text-xs font-bold text-slate-700">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-slate-500">Hours to Add</label>
              <input
                type="number"
                min="1"
                max="100"
                value={hoursToAward}
                onChange={(e) => setHoursToAward(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-sm focus:ring-2 focus:ring-teal-800"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-slate-500">Activity Note</label>
              <input
                type="text"
                value={hoursReason}
                onChange={(e) => setHoursReason(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-teal-800"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowLogHoursModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-extrabold shadow-sm"
              >
                Award Hours
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
