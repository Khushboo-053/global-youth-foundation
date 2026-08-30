import React, { useState, useEffect } from 'react';
import { Program } from '../../types';
import { Modal } from '../Modal';

interface ProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: Program | null;
  onSave: (data: any) => Promise<any>;
}

export const ProgramModal: React.FC<ProgramModalProps> = ({
  isOpen,
  onClose,
  program,
  onSave
}) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Education & Leadership',
    status: 'Active' as 'Active' | 'Completed' | 'Upcoming',
    description: '',
    impact: '1,000+ Youth Reached',
    beneficiaries: 'Students & Fellows',
    location: 'Srinagar & Valley Districts',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=800'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (program) {
      setFormData({
        title: program.title || '',
        category: program.category || 'Education & Leadership',
        status: program.status || 'Active',
        description: program.description || '',
        impact: program.impact || '1,000+ Youth Reached',
        beneficiaries: program.beneficiaries || 'Students & Fellows',
        location: program.location || 'Srinagar & Valley Districts',
        image: program.image || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=800'
      });
      setErrorMsg('');
    } else {
      setFormData({
        title: '',
        category: 'Education & Leadership',
        status: 'Active',
        description: '',
        impact: '500+ Community Members',
        beneficiaries: 'Youth & Students',
        location: 'All 10 Districts',
        image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=800'
      });
      setErrorMsg('');
    }
  }, [program, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setErrorMsg('Title and Description are required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      if (program) {
        await onSave({ ...formData, id: program.id });
      } else {
        await onSave(formData);
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to save program.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={program ? `Edit Program: ${program.title}` : 'Launch New Initiative / Program'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Program Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Kashmir Youth Environmental Stewardship Project"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Sector / Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
            >
              <option value="Education & Leadership">Education & Leadership</option>
              <option value="Environment & Climate">Environment & Climate</option>
              <option value="Legal Aid & Citizen Rights">Legal Aid & Citizen Rights</option>
              <option value="Civic Engagement">Civic Engagement</option>
              <option value="Skill Development">Skill Development</option>
              <option value="Healthcare & Wellness">Healthcare & Wellness</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Operational Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
            >
              <option value="Active">Active / Ongoing</option>
              <option value="Upcoming">Upcoming / In Planning</option>
              <option value="Completed">Completed Cohort</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Target Impact Metric
            </label>
            <input
              type="text"
              placeholder="e.g. 5,000+ Saplings Planted"
              value={formData.impact}
              onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Target Beneficiaries
            </label>
            <input
              type="text"
              placeholder="e.g. Underprivileged youth & students"
              value={formData.beneficiaries}
              onChange={(e) => setFormData({ ...formData, beneficiaries: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Geographic Coverage
          </label>
          <input
            type="text"
            placeholder="e.g. Srinagar, Ganderbal, Baramulla"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Banner Image URL
          </label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Program Description & Objectives *
          </label>
          <textarea
            rows={4}
            required
            placeholder="Describe the mission, activities, timeline, and deliverables of this initiative..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
            className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : program ? 'Save Changes' : 'Create Program'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
