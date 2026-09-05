import React, { useState, useEffect } from 'react';
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
  Award,
  ListTodo,
  ClipboardList,
  MessageSquare,
  Briefcase,
  Camera,
  ZoomIn,
  Eye,
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react';
import { 
  UserAccount, 
  VolunteerPermissions, 
  Program, 
  EventItem, 
  GrievanceRecord,
  VolunteerProgramAssignment,
  VolunteerEventAssignment,
  VolunteerTaskItem,
  VolunteerActivityReport
} from '../../types';
import { Modal } from '../Modal';
import { useApp } from '../../context/AppContext';

interface AdminVolunteerAssignmentsTabProps {
  volunteers: UserAccount[];
  volunteerPermissions: Record<string, VolunteerPermissions>;
  programs: Program[];
  events: EventItem[];
  complaints: GrievanceRecord[];
  onUpdatePermissions: (volunteerId: string, perms: Partial<VolunteerPermissions>) => Promise<void>;
  onAssignGrievance: (complaintId: string, volunteerId: string, volunteerName: string, department?: string) => Promise<void>;
  onLogHours: (volunteerId: string, hours: number) => Promise<void>;
  initialSubTab?: AdminVolunteerSubTab;
}

type AdminVolunteerSubTab = 'roster' | 'programs' | 'events' | 'tasks' | 'reports';

export const AdminVolunteerAssignmentsTab: React.FC<AdminVolunteerAssignmentsTabProps> = ({
  volunteers,
  volunteerPermissions,
  programs,
  events,
  complaints,
  onUpdatePermissions,
  onAssignGrievance,
  onLogHours,
  initialSubTab
}) => {
  const {
    volunteerPrograms,
    volunteerEvents,
    volunteerTasks,
    volunteerActivityReports,
    assignProgramToVolunteer,
    assignEventToVolunteer,
    assignTaskToVolunteer,
    reviewVolunteerActivityReport
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<AdminVolunteerSubTab>(initialSubTab || 'roster');

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const pendingReportsCount = volunteerActivityReports.filter(r => r.status === 'Submitted').length;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState<UserAccount | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Modals state
  const [showAssignCaseModal, setShowAssignCaseModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showLogHoursModal, setShowLogHoursModal] = useState(false);
  const [showAssignProgModal, setShowAssignProgModal] = useState(false);
  const [showAssignEvtModal, setShowAssignEvtModal] = useState(false);
  const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);
  const [selectedReportForReview, setSelectedReportForReview] = useState<VolunteerActivityReport | null>(null);
  const [adminFeedbackInput, setAdminFeedbackInput] = useState('');
  const [viewingPhoto, setViewingPhoto] = useState<{
    url: string;
    title: string;
    volunteer: string;
    date: string;
  } | null>(null);
  const [reportFilter, setReportFilter] = useState<'All' | 'Submitted' | 'Reviewed by Admin'>('All');
  const [reportSearch, setReportSearch] = useState('');

  // 1. Grievance Assignment Modal Form
  const [targetVolunteerId, setTargetVolunteerId] = useState('');
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [assignmentDept, setAssignmentDept] = useState('Ombudsman Youth Field Taskforce');

  // 2. Permission Modal Form
  const [canGrievances, setCanGrievances] = useState(true);
  const [canEvents, setCanEvents] = useState(true);
  const [canPrograms, setCanPrograms] = useState(false);
  const [canMembers, setCanMembers] = useState(false);
  const [assignedChapter, setAssignedChapter] = useState('Srinagar Central');

  // 3. Hours Modal Form
  const [hoursToAward, setHoursToAward] = useState(5);
  const [hoursReason, setHoursReason] = useState('Field Verification & Outreach');

  // 4. Assign Program Form
  const [progForm, setProgForm] = useState({
    volunteerId: '',
    programId: '',
    assignedRole: 'Field Coordinator',
    location: 'North Kashmir Hub'
  });

  // 5. Assign Event Form
  const [evtForm, setEvtForm] = useState({
    volunteerId: '',
    eventId: '',
    assignedRole: 'Logistics Lead'
  });

  // 6. Assign Task Form
  const [taskForm, setTaskForm] = useState({
    volunteerId: '',
    title: '',
    description: '',
    priority: 'High' as 'Low' | 'Medium' | 'High' | 'Urgent',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    relatedType: 'General' as 'Program' | 'Event' | 'Grievance' | 'General',
    relatedTitle: ''
  });

  const activeVolunteers = volunteers.filter(v => v.isActive);
  const pendingCases = complaints.filter(c => c.currentStatus !== 'Resolved' && c.currentStatus !== 'Closed');

  const filteredVolunteers = volunteers.filter(v => 
    v.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.chapter && v.chapter.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const showToast = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  // Open Permission Modal
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

  // Save Permissions
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
    showToast(`Permissions updated for ${selectedVolunteer.fullName}.`);
  };

  // Open Grievance Assignment Modal
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

  // Save Grievance Assignment
  const handleSaveAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseId || !targetVolunteerId) return;

    const vol = volunteers.find(v => v.id === targetVolunteerId);
    if (!vol) return;

    await onAssignGrievance(selectedCaseId, vol.id, vol.fullName, assignmentDept);
    setShowAssignCaseModal(false);
    showToast(`Grievance #${selectedCaseId.slice(0, 8)} assigned to ${vol.fullName}.`);
  };

  // Save Hours
  const handleSaveHours = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVolunteer) return;

    await onLogHours(selectedVolunteer.id, hoursToAward);
    setShowLogHoursModal(false);
    showToast(`Logged ${hoursToAward} service hours for ${selectedVolunteer.fullName}.`);
  };

  // Save Program Assignment
  const handleSaveProgramAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    const volId = progForm.volunteerId || (activeVolunteers[0]?.id);
    const progId = progForm.programId || (programs[0]?.id);
    if (!volId || !progId) return;

    const selectedProg = programs.find(p => p.id === progId);
    if (!selectedProg) return;

    await assignProgramToVolunteer(
      selectedProg.id,
      volId,
      progForm.assignedRole,
      progForm.location || selectedProg.location || 'Central District'
    );

    setShowAssignProgModal(false);
    showToast(`Program "${selectedProg.title}" assigned to volunteer.`);
  };

  // Save Event Assignment
  const handleSaveEventAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    const volId = evtForm.volunteerId || (activeVolunteers[0]?.id);
    const evtId = evtForm.eventId || (events[0]?.id);
    if (!volId || !evtId) return;

    const selectedEvt = events.find(ev => ev.id === evtId);
    if (!selectedEvt) return;

    await assignEventToVolunteer(
      selectedEvt.id,
      volId,
      evtForm.assignedRole
    );

    setShowAssignEvtModal(false);
    showToast(`Event "${selectedEvt.title}" assigned to volunteer.`);
  };

  // Save Task Assignment
  const handleSaveTaskAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    const volId = taskForm.volunteerId || (activeVolunteers[0]?.id);
    if (!volId || !taskForm.title) return;

    const vol = volunteers.find(v => v.id === volId);

    await assignTaskToVolunteer({
      volunteerId: volId,
      volunteerName: vol?.fullName || 'Volunteer',
      title: taskForm.title,
      description: taskForm.description,
      priority: taskForm.priority,
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: taskForm.dueDate,
      relatedType: taskForm.relatedType,
      relatedTitle: taskForm.relatedTitle || taskForm.title
    });

    setShowAssignTaskModal(false);
    setTaskForm({
      volunteerId: '',
      title: '',
      description: '',
      priority: 'High',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      relatedType: 'General',
      relatedTitle: ''
    });
    showToast(`Task "${taskForm.title}" dispatched to volunteer.`);
  };

  // Review Report Handler
  const handleReviewReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReportForReview) return;

    await reviewVolunteerActivityReport(selectedReportForReview.id, adminFeedbackInput);
    setSelectedReportForReview(null);
    setAdminFeedbackInput('');
    showToast('Activity report marked as Reviewed with Admin feedback sent.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
            <KeyRound className="w-6 h-6 text-teal-800" />
            <span>Volunteer Work Management & Delegations</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Assign programs, events, tasks, and grievances to volunteers, monitor real-time progress, and review field activity reports.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setProgForm({
                volunteerId: activeVolunteers[0]?.id || '',
                programId: programs[0]?.id || '',
                assignedRole: 'Field Coordinator',
                location: 'North Kashmir Hub'
              });
              setShowAssignProgModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Assign Program</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEvtForm({
                volunteerId: activeVolunteers[0]?.id || '',
                eventId: events[0]?.id || '',
                assignedRole: 'Logistics Lead'
              });
              setShowAssignEvtModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Assign Event</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTaskForm({
                volunteerId: activeVolunteers[0]?.id || '',
                title: '',
                description: '',
                priority: 'High',
                dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
                relatedType: 'General',
                relatedTitle: ''
              });
              setShowAssignTaskModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Assign Task</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('roster')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'roster'
              ? 'bg-white text-teal-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Volunteers Roster ({volunteers.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('programs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'programs'
              ? 'bg-white text-teal-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Assigned Programs ({volunteerPrograms.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('events')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'events'
              ? 'bg-white text-teal-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Assigned Events ({volunteerEvents.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('tasks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'tasks'
              ? 'bg-white text-teal-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ListTodo className="w-4 h-4" />
          <span>Assigned Tasks ({volunteerTasks.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('reports')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'reports'
              ? 'bg-white text-teal-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Field Activity Reports ({volunteerActivityReports.length})</span>
          {pendingReportsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black animate-pulse">
              {pendingReportsCount} New
            </span>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: VOLUNTEERS ROSTER */}
      {/* ========================================================================= */}
      {activeSubTab === 'roster' && (
        <div className="space-y-6">
          {/* KPI Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Active Volunteers</span>
              <div className="text-2xl font-black text-slate-900 mt-2">{activeVolunteers.length}</div>
              <span className="text-[11px] text-teal-700 font-medium">Ready for deployment</span>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 shadow-2xs">
              <span className="text-[11px] font-extrabold text-indigo-800 uppercase tracking-wider">Assigned Grievances</span>
              <div className="text-2xl font-black text-indigo-950 mt-2">
                {complaints.filter(c => c.assignedToVolunteerId || c.assignedVolunteerId).length}
              </div>
              <span className="text-[11px] text-indigo-700 font-medium">Under field investigation</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 shadow-2xs">
              <span className="text-[11px] font-extrabold text-amber-800 uppercase tracking-wider">Unassigned Cases</span>
              <div className="text-2xl font-black text-amber-950 mt-2">
                {complaints.filter(c => !c.assignedToVolunteerId && !c.assignedVolunteerId && c.currentStatus !== 'Resolved').length}
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

          {/* Volunteers Roster Table */}
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
                      const assignedGrievances = complaints.filter(c => c.assignedToVolunteerId === vol.id || c.assignedVolunteerId === vol.id);
                      const perms = volunteerPermissions[vol.id] || {
                        canManageGrievances: true,
                        canManageEvents: true,
                        canManagePrograms: false,
                        canViewMembers: false,
                        assignedChapter: vol.chapter || 'Central'
                      };

                      return (
                        <tr key={vol.id} className="hover:bg-slate-50/60 transition-colors">
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

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 flex-wrap max-w-xs">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                perms.canManageGrievances ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400'
                              }`}>
                                Grievances
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                perms.canManageEvents ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400'
                              }`}>
                                Events
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                perms.canManagePrograms ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-slate-100 text-slate-400'
                              }`}>
                                Programs
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenAssignCase(vol)}
                                className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold"
                                title="Assign Grievance"
                              >
                                Assign Case
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenPermissions(vol)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                                title="Edit Permissions"
                              >
                                Edit Rights
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: ASSIGNED PROGRAMS */}
      {/* ========================================================================= */}
      {activeSubTab === 'programs' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800">Volunteer Program Allocations</h3>
            <button
              onClick={() => setShowAssignProgModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Assign New Program
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {volunteerPrograms.map(prog => (
              <div key={prog.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                      {prog.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{prog.programTitle}</h4>
                    <p className="text-xs text-slate-500">Volunteer Role: {prog.assignedRole} • {prog.location}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800">
                    {prog.progress ?? prog.progressPercentage ?? 0}% Done
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-600 rounded-full" style={{ width: `${prog.progress ?? prog.progressPercentage ?? 0}%` }} />
                </div>

                {prog.activityNotes && prog.activityNotes.length > 0 ? (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 italic">
                    Latest Volunteer Note: "{prog.activityNotes[prog.activityNotes.length - 1]?.note || ''}"
                  </div>
                ) : prog.fieldNotes && prog.fieldNotes.length > 0 ? (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 italic">
                    Latest Volunteer Note: "{typeof prog.fieldNotes[prog.fieldNotes.length - 1] === 'object' ? (prog.fieldNotes[prog.fieldNotes.length - 1] as any)?.note || '' : prog.fieldNotes[prog.fieldNotes.length - 1]}"
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: ASSIGNED EVENTS */}
      {/* ========================================================================= */}
      {activeSubTab === 'events' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800">Volunteer Event Deployments</h3>
            <button
              onClick={() => setShowAssignEvtModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Assign Event Duty
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {volunteerEvents.map(evt => (
              <div key={evt.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                      Duty: {evt.assignedRole}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{evt.eventTitle}</h4>
                    <p className="text-xs text-slate-500">{evt.date} • {evt.time} • {evt.location}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    evt.isCompleted ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {evt.status}
                  </span>
                </div>

                {evt.notes && evt.notes.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 italic">
                    Volunteer Log: "{typeof evt.notes[evt.notes.length - 1] === 'object' ? (evt.notes[evt.notes.length - 1] as any)?.note || '' : evt.notes[evt.notes.length - 1]}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: ASSIGNED TASKS */}
      {/* ========================================================================= */}
      {activeSubTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800">Action Items & Delegated Tasks</h3>
            <button
              onClick={() => setShowAssignTaskModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Delegate Task
            </button>
          </div>

          <div className="space-y-3">
            {volunteerTasks.map(task => (
              <div key={task.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      task.priority === 'Urgent' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      task.priority === 'High' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {task.priority} Priority
                    </span>
                    <span className="text-xs text-slate-400">Due: {task.dueDate}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      task.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{task.title}</h4>
                  <p className="text-xs text-slate-500">{task.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 5: FIELD ACTIVITY REPORTS */}
      {/* ========================================================================= */}
      {activeSubTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Volunteer Grassroots Activity Reports</h3>
              <p className="text-xs text-slate-500">Review on-ground inspections, photographic proofs submitted by volunteers, and provide official feedback.</p>
            </div>

            {/* Quick Filter Pill Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={reportSearch}
                  onChange={(e) => setReportSearch(e.target.value)}
                  placeholder="Search reports or photos..."
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-teal-700"
                />
              </div>
              <select
                value={reportFilter}
                onChange={(e) => setReportFilter(e.target.value as any)}
                className="px-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-teal-700 font-semibold"
              >
                <option value="All">All Reports ({volunteerActivityReports.length})</option>
                <option value="Submitted">Pending Review ({volunteerActivityReports.filter(r => r.status === 'Submitted').length})</option>
                <option value="Reviewed by Admin">Approved & Reviewed ({volunteerActivityReports.filter(r => r.status === 'Reviewed by Admin').length})</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {volunteerActivityReports
              .filter(r => {
                const matchFilter = reportFilter === 'All' || r.status === reportFilter;
                const matchSearch = !reportSearch ||
                  r.title.toLowerCase().includes(reportSearch.toLowerCase()) ||
                  r.volunteerName.toLowerCase().includes(reportSearch.toLowerCase()) ||
                  r.location.toLowerCase().includes(reportSearch.toLowerCase()) ||
                  r.summary.toLowerCase().includes(reportSearch.toLowerCase());
                return matchFilter && matchSearch;
              })
              .length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs font-bold">
                No activity reports matching the selected filter.
              </div>
            ) : (
              volunteerActivityReports
                .filter(r => {
                  const matchFilter = reportFilter === 'All' || r.status === reportFilter;
                  const matchSearch = !reportSearch ||
                    r.title.toLowerCase().includes(reportSearch.toLowerCase()) ||
                    r.volunteerName.toLowerCase().includes(reportSearch.toLowerCase()) ||
                    r.location.toLowerCase().includes(reportSearch.toLowerCase()) ||
                    r.summary.toLowerCase().includes(reportSearch.toLowerCase());
                  return matchFilter && matchSearch;
                })
                .map(report => (
                <div key={report.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                          {report.category}
                        </span>
                        <span className="text-xs font-bold text-slate-700">By: {report.volunteerName}</span>
                        <span className="text-xs text-slate-400">• {report.date} • {report.hoursSpent} hrs</span>
                        {((report.photos && report.photos.length > 0) || report.attachmentUrl) && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                            <Camera className="w-3 h-3" />
                            <span>{(report.photos?.length) || 1} Photo(s) Attached</span>
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{report.title}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        report.status === 'Reviewed by Admin' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {report.status}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedReportForReview(report);
                          setAdminFeedbackInput(report.adminFeedback || 'Verified and approved by Central Secretariat.');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold"
                      >
                        {report.status === 'Reviewed by Admin' ? 'Update Feedback' : 'Review & Approve'}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 text-slate-700">
                    <p><strong>Location:</strong> {report.location}</p>
                    <p><strong>Summary:</strong> {report.summary}</p>
                    <p className="text-teal-900"><strong>Key Accomplishments:</strong> {report.accomplishments}</p>
                    {report.challenges && (
                      <p className="text-amber-800"><strong>Reported Challenges:</strong> {report.challenges}</p>
                    )}
                  </div>

                  {/* Photo Evidence Gallery for Admin */}
                  {((report.photos && report.photos.length > 0) || report.attachmentUrl) && (
                    <div className="space-y-2 p-3.5 rounded-xl bg-teal-50/40 border border-teal-200/70">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-teal-800" />
                          <span>Submitted Field Photographic Proof</span>
                        </span>
                        <span className="text-[10px] font-bold text-teal-800 bg-white px-2 py-0.5 rounded border border-teal-200">
                          {(report.photos?.length) || 1} image(s) attached
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                        {(report.photos && report.photos.length > 0 ? report.photos : [report.attachmentUrl!]).map((photoUrl, pIdx) => (
                          <div
                            key={pIdx}
                            onClick={() => setViewingPhoto({
                              url: photoUrl,
                              title: `${report.title} - Photo #${pIdx + 1}`,
                              volunteer: report.volunteerName,
                              date: report.date
                            })}
                            className="relative group rounded-xl overflow-hidden border border-slate-200 bg-white aspect-video cursor-pointer hover:border-teal-700 hover:shadow-md transition-all"
                          >
                            <img
                              src={photoUrl}
                              alt={`Field Evidence ${pIdx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white">
                              <ZoomIn className="w-4 h-4" />
                              <span className="text-[11px] font-bold">Enlarge</span>
                            </div>
                            <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
                              #{pIdx + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {report.adminFeedback && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                      <strong>Admin Feedback:</strong> {report.adminFeedback}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* 1. Assign Grievance Modal */}
      {showAssignCaseModal && (
        <Modal
          isOpen={showAssignCaseModal}
          onClose={() => setShowAssignCaseModal(false)}
          title="Delegate Grievance Case to Volunteer"
          size="md"
        >
          <form onSubmit={handleSaveAssignment} className="space-y-4 text-xs font-bold text-slate-700">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-slate-500">Select Grievance Case</label>
              <select
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-teal-800"
                required
              >
                {pendingCases.map((c) => (
                  <option key={c.id} value={c.id}>
                    #{c.id.slice(0, 8)} - {c.subject} ({c.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-slate-500">Assign To Volunteer</label>
              <select
                value={targetVolunteerId}
                onChange={(e) => setTargetVolunteerId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-teal-800"
                required
              >
                {activeVolunteers.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.fullName} ({v.chapter || 'Central HQ'}) - {v.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-slate-500">Assigning Taskforce Department</label>
              <input
                type="text"
                value={assignmentDept}
                onChange={(e) => setAssignmentDept(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-teal-800"
                required
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowAssignCaseModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-extrabold shadow-sm"
              >
                Assign Case
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 2. Permission Modal */}
      {showPermissionsModal && selectedVolunteer && (
        <Modal
          isOpen={showPermissionsModal}
          onClose={() => setShowPermissionsModal(false)}
          title={`Configure Permissions: ${selectedVolunteer.fullName}`}
          size="md"
        >
          <form onSubmit={handleSavePermissions} className="space-y-4 text-xs font-bold text-slate-700">
            <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-950 text-xs">
              Configure role boundaries for this volunteer. Role safeguards ensure volunteers can only manage work assigned directly to them.
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-black text-slate-900 block">Manage Assigned Grievances</span>
                  <span className="text-[11px] text-slate-500 font-normal">Can verify and resolve assigned citizen cases</span>
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
                  <span className="text-[11px] text-slate-500 font-normal">Can verify event duties and report ground attendance</span>
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
                  <span className="text-xs font-black text-slate-900 block">Program Field Access</span>
                  <span className="text-[11px] text-slate-500 font-normal">Can update progress and notes on assigned programs</span>
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
                  <span className="text-[11px] text-slate-500 font-normal">Can view read-only member contact list for field coordination</span>
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
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-extrabold shadow-sm"
              >
                Save Permissions
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 3. Log Hours Modal */}
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
                className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-extrabold shadow-sm"
              >
                Award Hours
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 4. Assign Program Modal */}
      {showAssignProgModal && (
        <Modal
          isOpen={showAssignProgModal}
          onClose={() => setShowAssignProgModal(false)}
          title="Assign Community Program to Volunteer"
          size="md"
        >
          <form onSubmit={handleSaveProgramAssignment} className="space-y-4 text-xs font-bold text-slate-700">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-slate-500">Select Volunteer</label>
              <select
                value={progForm.volunteerId}
                onChange={(e) => setProgForm({ ...progForm, volunteerId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-teal-800"
                required
              >
                {activeVolunteers.map(v => (
                  <option key={v.id} value={v.id}>{v.fullName} ({v.chapter || 'Central HQ'})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-slate-500">Select Program</label>
              <select
                value={progForm.programId}
                onChange={(e) => setProgForm({ ...progForm, programId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-teal-800"
                required
              >
                {programs.map(p => (
                  <option key={p.id} value={p.id}>{p.title} ({p.category})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-slate-500">Assigned Role</label>
                <input
                  type="text"
                  value={progForm.assignedRole}
                  onChange={(e) => setProgForm({ ...progForm, assignedRole: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-teal-800"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-slate-500">Field Location / Chapter</label>
                <input
                  type="text"
                  value={progForm.location}
                  onChange={(e) => setProgForm({ ...progForm, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-teal-800"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowAssignProgModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-extrabold shadow-sm"
              >
                Confirm Program Assignment
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 5. Assign Event Modal */}
      {showAssignEvtModal && (
        <Modal
          isOpen={showAssignEvtModal}
          onClose={() => setShowAssignEvtModal(false)}
          title="Assign Event Logistics & Duties to Volunteer"
          size="md"
        >
          <form onSubmit={handleSaveEventAssignment} className="space-y-4 text-xs font-bold text-slate-700">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-slate-500">Select Volunteer</label>
              <select
                value={evtForm.volunteerId}
                onChange={(e) => setEvtForm({ ...evtForm, volunteerId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-teal-800"
                required
              >
                {activeVolunteers.map(v => (
                  <option key={v.id} value={v.id}>{v.fullName} ({v.chapter || 'Central HQ'})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-slate-500">Select Event</label>
              <select
                value={evtForm.eventId}
                onChange={(e) => setEvtForm({ ...evtForm, eventId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-teal-800"
                required
              >
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>{ev.title} ({ev.date} - {ev.location})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-slate-500">Designated Ground Role</label>
              <input
                type="text"
                value={evtForm.assignedRole}
                onChange={(e) => setEvtForm({ ...evtForm, assignedRole: e.target.value })}
                placeholder="e.g. Stage & Audio Logistics Lead, Helpdesk In-charge"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-teal-800"
                required
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowAssignEvtModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-extrabold shadow-sm"
              >
                Confirm Event Assignment
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 6. Assign Task Modal */}
      {showAssignTaskModal && (
        <Modal
          isOpen={showAssignTaskModal}
          onClose={() => setShowAssignTaskModal(false)}
          title="Delegate Action Item / Task to Volunteer"
          size="md"
        >
          <form onSubmit={handleSaveTaskAssignment} className="space-y-4 text-xs font-bold text-slate-700">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-slate-500">Select Volunteer</label>
              <select
                value={taskForm.volunteerId}
                onChange={(e) => setTaskForm({ ...taskForm, volunteerId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-teal-800"
                required
              >
                {activeVolunteers.map(v => (
                  <option key={v.id} value={v.id}>{v.fullName} ({v.chapter || 'Central HQ'})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-slate-500">Task Title</label>
              <input
                type="text"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                placeholder="e.g. Conduct Field Survey of Solar Streetlights in Pattan"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-teal-800"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-slate-500">Priority Level</label>
                <select
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-teal-800"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Urgent">Urgent Priority</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-slate-500">Due Date</label>
                <input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-teal-800"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-slate-500">Description & Deliverables</label>
              <textarea
                rows={3}
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                placeholder="Provide detailed instructions and expected outcomes..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-teal-800 resize-none"
                required
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowAssignTaskModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-extrabold shadow-sm"
              >
                Dispatch Task
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 7. Review Field Activity Report Modal */}
      {selectedReportForReview && (
        <Modal
          isOpen={!!selectedReportForReview}
          onClose={() => setSelectedReportForReview(null)}
          title={`Review Volunteer Activity Report: ${selectedReportForReview.title}`}
          size="md"
        >
          <form onSubmit={handleReviewReport} className="space-y-4 text-xs font-bold text-slate-700">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-slate-700">
              <p><strong>Submitted By:</strong> {selectedReportForReview.volunteerName}</p>
              <p><strong>Category:</strong> {selectedReportForReview.category} ({selectedReportForReview.hoursSpent} hrs)</p>
              <p><strong>Location:</strong> {selectedReportForReview.location}</p>
              <p className="pt-1 text-slate-600 font-normal"><strong>Summary:</strong> {selectedReportForReview.summary}</p>
              <p className="pt-1 text-teal-900 font-medium"><strong>Accomplishments:</strong> {selectedReportForReview.accomplishments}</p>
              {selectedReportForReview.challenges && (
                <p className="pt-1 text-amber-800 font-medium"><strong>Challenges:</strong> {selectedReportForReview.challenges}</p>
              )}
            </div>

            {/* Photos in Review Modal */}
            {((selectedReportForReview.photos && selectedReportForReview.photos.length > 0) || selectedReportForReview.attachmentUrl) && (
              <div className="space-y-2 p-3.5 rounded-xl bg-teal-50/60 border border-teal-200/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-teal-800" />
                    <span>Submitted Photographic Proof</span>
                  </span>
                  <span className="text-[10px] font-bold text-teal-800 bg-white px-2 py-0.5 rounded border border-teal-200">
                    {(selectedReportForReview.photos?.length) || 1} Attached
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(selectedReportForReview.photos && selectedReportForReview.photos.length > 0 
                    ? selectedReportForReview.photos 
                    : [selectedReportForReview.attachmentUrl!]
                  ).map((photoUrl, pIdx) => (
                    <div 
                      key={pIdx}
                      onClick={() => setViewingPhoto({
                        url: photoUrl,
                        title: `${selectedReportForReview.title} - Photo #${pIdx + 1}`,
                        volunteer: selectedReportForReview.volunteerName,
                        date: selectedReportForReview.date
                      })}
                      className="relative group rounded-lg overflow-hidden border border-slate-200 bg-white aspect-video cursor-pointer hover:border-teal-700 transition-all shadow-2xs"
                    >
                      <img 
                        src={photoUrl} 
                        alt={`Photo #${pIdx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-slate-500">Central Secretariat Official Feedback / Remarks</label>
              <textarea
                rows={3}
                value={adminFeedbackInput}
                onChange={(e) => setAdminFeedbackInput(e.target.value)}
                placeholder="Enter validation remarks, compliments, or directives for the volunteer..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-teal-800 resize-none"
                required
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedReportForReview(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-extrabold shadow-sm"
              >
                Save Review & Notify Volunteer
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Lightbox / High-Res Photo Inspection Modal */}
      {viewingPhoto && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-4 flex items-center justify-between border-b border-slate-800 text-white">
              <div className="flex items-center gap-2.5">
                <Camera className="w-4 h-4 text-teal-400" />
                <div>
                  <h4 className="text-sm font-bold truncate max-w-md">{viewingPhoto.title}</h4>
                  <p className="text-xs text-slate-400">Captured by {viewingPhoto.volunteer} • {viewingPhoto.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a 
                  href={viewingPhoto.url} 
                  download="field-photo.jpg" 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Full</span>
                </a>
                <button 
                  onClick={() => setViewingPhoto(null)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4 flex items-center justify-center bg-black/60 max-h-[75vh] overflow-auto">
              <img 
                src={viewingPhoto.url} 
                alt={viewingPhoto.title}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
