import React, { useState } from 'react';
import { UserAccount, Program, EventItem, GrievanceRecord } from '../../types';
import { Modal } from '../Modal';
import { ShieldCheck, HeartHandshake, Calendar, Layers, CheckCircle2 } from 'lucide-react';

interface VolunteerAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  volunteer: UserAccount | null;
  programs: Program[];
  events: EventItem[];
  complaints: GrievanceRecord[];
  onAssignGrievance: (complaintId: string, volunteerId: string, volunteerName: string, department?: string) => Promise<void>;
  onUpdateVolunteerPermissions?: (volunteerId: string, perms: any) => Promise<void>;
  onLogHours?: (volunteerId: string, hours: number) => Promise<void>;
}

export const VolunteerAssignModal: React.FC<VolunteerAssignModalProps> = ({
  isOpen,
  onClose,
  volunteer,
  programs,
  events,
  complaints,
  onAssignGrievance,
  onUpdateVolunteerPermissions,
  onLogHours
}) => {
  const [activeTab, setActiveTab] = useState<'grievance' | 'chapter' | 'hours'>('grievance');
  const [selectedGrievanceId, setSelectedGrievanceId] = useState('');
  const [assignedDepartment, setAssignedDepartment] = useState('Ombudsman Youth Field Wing');
  const [assignedChapter, setAssignedChapter] = useState(volunteer?.chapter || 'Central Kashmir Hub (Srinagar & Bemina)');
  const [hoursToAdd, setHoursToAdd] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!volunteer) return null;

  const unassignedGrievances = complaints.filter(c => 
    c.currentStatus !== 'Resolved' && c.currentStatus !== 'Closed'
  );

  const handleAssignGrievanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrievanceId) return;

    setIsSubmitting(true);
    try {
      await onAssignGrievance(selectedGrievanceId, volunteer.id, volunteer.fullName, assignedDepartment);
      setSuccessMessage(`Grievance successfully assigned to ${volunteer.fullName}.`);
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePermissionsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateVolunteerPermissions) return;

    setIsSubmitting(true);
    try {
      await onUpdateVolunteerPermissions(volunteer.id, {
        assignedChapter
      });
      setSuccessMessage(`Assigned chapter updated for ${volunteer.fullName}.`);
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHoursSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onLogHours || hoursToAdd <= 0) return;

    setIsSubmitting(true);
    try {
      await onLogHours(volunteer.id, hoursToAdd);
      setSuccessMessage(`Logged ${hoursToAdd} volunteer service hours.`);
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Volunteer Action & Task Delegation: ${volunteer.fullName}`}>
      <div className="space-y-5">
        {/* Navigation Tabs inside modal */}
        <div className="flex border-b border-slate-200 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('grievance')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'grievance'
                ? 'border-teal-800 text-teal-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Assign Grievance Docket</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('chapter')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'chapter'
                ? 'border-teal-800 text-teal-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Assign Chapter & Role</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hours')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'hours'
                ? 'border-teal-800 text-teal-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Log Service Hours</span>
          </button>
        </div>

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Tab 1: Grievance Docket Assignment */}
        {activeTab === 'grievance' && (
          <form onSubmit={handleAssignGrievanceSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Active Grievance Docket to Assign *
              </label>
              <select
                required
                value={selectedGrievanceId}
                onChange={(e) => setSelectedGrievanceId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
              >
                <option value="">-- Choose a citizen grievance docket --</option>
                {unassignedGrievances.map((g) => (
                  <option key={g.id} value={g.id}>
                    [{g.id}] {g.subject} ({g.location}) - Priority: {g.priority}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Assigned Unit / Department
              </label>
              <input
                type="text"
                value={assignedDepartment}
                onChange={(e) => setAssignedDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !selectedGrievanceId}
                className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Assigning...' : 'Confirm Grievance Assignment'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Chapter & Permissions */}
        {activeTab === 'chapter' && (
          <form onSubmit={handlePermissionsSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Assigned District / Regional Chapter
              </label>
              <select
                value={assignedChapter}
                onChange={(e) => setAssignedChapter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
              >
                <option value="Central Kashmir Hub (Srinagar & Bemina)">Central Kashmir Hub (Srinagar & Bemina)</option>
                <option value="North Kashmir District (Baramulla & Sopore)">North Kashmir District (Baramulla & Sopore)</option>
                <option value="South Kashmir District (Anantnag & Pulwama)">South Kashmir District (Anantnag & Pulwama)</option>
                <option value="Ganderbal & Kangan Mountain Desk">Ganderbal & Kangan Mountain Desk</option>
                <option value="Jammu Regional Coordination Cell">Jammu Regional Coordination Cell</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Update Chapter Assignment'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Log Hours */}
        {activeTab === 'hours' && (
          <form onSubmit={handleHoursSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Additional Hours Completed *
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={hoursToAdd}
                onChange={(e) => setHoursToAdd(Number(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Current logged hours: <strong>{volunteer.volunteerHours || 0} hours</strong>. New total will be {(volunteer.volunteerHours || 0) + hoursToAdd} hours.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Logging...' : 'Add Hours to Record'}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
