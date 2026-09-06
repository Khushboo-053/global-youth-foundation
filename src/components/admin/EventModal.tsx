import React, { useState, useEffect } from 'react';
import { EventItem } from '../../types';
import { Modal } from '../Modal';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem | null;
  defaultCategory?: string;
  onSave: (data: any) => Promise<any>;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  event,
  defaultCategory,
  onSave
}) => {
  const [formData, setFormData] = useState({
    title: '',
    subheading: '',
    date: 'Oct 24, 2026',
    time: '10:00 AM - 04:00 PM IST',
    location: 'SKICC Convention Centre, Srinagar',
    category: defaultCategory || 'Peace, Justice & Social Harmony',
    attendees: '400+ Delegates',
    status: 'Upcoming' as 'Upcoming' | 'Completed' | 'Ongoing',
    description: '',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
    documentPage: undefined as number | undefined
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        subheading: (event as any).subheading || '',
        date: event.date || 'Oct 24, 2026',
        time: event.time || '10:00 AM - 04:00 PM IST',
        location: event.location || 'SKICC Convention Centre, Srinagar',
        category: event.category || defaultCategory || 'Peace, Justice & Social Harmony',
        attendees: event.attendees || '400+ Delegates',
        status: (event.status as any) || 'Upcoming',
        description: event.description || '',
        image: event.image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
        documentPage: event.documentPage
      });
      setErrorMsg('');
    } else {
      setFormData({
        title: '',
        subheading: '',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: '10:00 AM - 04:00 PM IST',
        location: 'SKICC Auditorium, Srinagar',
        category: defaultCategory || 'Peace, Justice & Social Harmony',
        attendees: '250+ Registered',
        status: 'Upcoming',
        description: '',
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
        documentPage: undefined
      });
      setErrorMsg('');
    }
  }, [event, isOpen, defaultCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setErrorMsg('Event title and description are required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      if (event) {
        await onSave({ ...formData, id: event.id });
      } else {
        await onSave(formData);
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to save event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event ? `Edit Event: ${event.title}` : 'Schedule New Event / Summit'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Event Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Annual J&K Youth Conclave & Legal Rights Convention"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Event Subtitle / Initiative Theme (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Civic Harmony & Youth Leadership Outreach"
            value={formData.subheading}
            onChange={(e) => setFormData({ ...formData, subheading: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Date *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Nov 15, 2026"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Time
            </label>
            <input
              type="text"
              placeholder="e.g. 10:00 AM - 4:00 PM"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Venue / Location *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. SKICC Convention Hall, Boulevard Road, Srinagar"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Category / Pillar *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden bg-white"
            >
              <option value="Peace, Justice & Social Harmony">Peace, Justice & Social Harmony</option>
              <option value="Disaster Relief & Healthcare Outreach">Disaster Relief & Healthcare Outreach</option>
              <option value="Substance Abuse Prevention & De-Addiction">Substance Abuse Prevention & De-Addiction</option>
              <option value="Women & Girl Child Empowerment">Women & Girl Child Empowerment</option>
              <option value="Youth Leadership, Sports & Culture">Youth Leadership, Sports & Culture</option>
              <option value="Environmental Stewardship & Climate Action">Environmental Stewardship & Climate Action</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
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
              Archival Page # (Optional)
            </label>
            <input
              type="number"
              min={1}
              max={30}
              placeholder="e.g. 2"
              value={formData.documentPage !== undefined ? formData.documentPage : ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                documentPage: e.target.value ? parseInt(e.target.value, 10) : undefined 
              })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Event Description & Agenda *
          </label>
          <textarea
            rows={4}
            required
            placeholder="Outline speakers, panel themes, workshop breakouts, and registration guidelines..."
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
            {isSubmitting ? 'Saving...' : event ? 'Save Changes' : 'Schedule Event'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
