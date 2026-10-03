import React, { useState, useEffect, useRef } from 'react';
import { EventItem } from '../../types';
import { Modal } from '../Modal';
import { UploadCloud, X, ImageIcon, Loader2 } from 'lucide-react';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem | null;
  defaultCategory?: string;
  onSave: (data: any) => Promise<any>;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800';

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
    image: DEFAULT_IMAGE,
    galleryImages: [] as string[],
    documentPage: undefined as number | undefined
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Image upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        image: event.image || DEFAULT_IMAGE,
        galleryImages: event.galleryImages || [],
        documentPage: event.documentPage
      });
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
        image: DEFAULT_IMAGE,
        galleryImages: [],
        documentPage: undefined
      });
    }
    setErrorMsg('');
    setUploadError('');
  }, [event, isOpen, defaultCategory]);

  // Upload the file to /api/upload
  const handleFileUpload = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file (jpg, png, gif, webp).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image must be smaller than 10 MB.');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    try {
      const body = new FormData();
      body.append('image', file);
      const res = await fetch('/api/upload', { method: 'POST', body });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Upload failed.');
      setFormData(prev => ({ ...prev, image: data.url }));
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      if (file.size > 10 * 1024 * 1024) continue;

      try {
        const body = new FormData();
        body.append('image', file);
        const res = await fetch('/api/upload', { method: 'POST', body });
        const data = await res.json();
        if (res.ok && data.url) {
          setFormData(prev => ({
            ...prev,
            galleryImages: [...(prev.galleryImages || []), data.url]
          }));
        }
      } catch (err) {
        console.error('Gallery image upload failed', err);
      }
    }
    // reset input
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

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

  const isUploadedImage = formData.image && !formData.image.startsWith('http');

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
              <option value="Peace, Justice & Social Harmony">Peace, Justice &amp; Social Harmony</option>
              <option value="Disaster Relief & Healthcare Outreach">Disaster Relief &amp; Healthcare Outreach</option>
              <option value="Substance Abuse Prevention & De-Addiction">Substance Abuse Prevention &amp; De-Addiction</option>
              <option value="Women & Girl Child Empowerment">Women &amp; Girl Child Empowerment</option>
              <option value="Youth Leadership, Sports & Culture">Youth Leadership, Sports &amp; Culture</option>
              <option value="Environmental Stewardship & Climate Action">Environmental Stewardship &amp; Climate Action</option>
            </select>
          </div>
        </div>

        {/* ── Banner Image Upload ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Banner Image
            </label>

            {/* Upload zone */}
            <div
              onClick={() => !isUploading && fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-150 min-h-[110px] px-4 py-3
                ${dragOver ? 'border-teal-500 bg-teal-50' : 'border-slate-300 bg-slate-50 hover:border-teal-400 hover:bg-teal-50/40'}
                ${isUploading ? 'opacity-70 cursor-wait' : ''}`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-1.5 text-teal-700">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-[11px] font-semibold">Uploading image…</span>
                </div>
              ) : formData.image && formData.image !== DEFAULT_IMAGE ? (
                <div className="relative w-full">
                  <img
                    src={formData.image}
                    alt="Event banner preview"
                    className="w-full h-28 object-cover rounded-lg shadow-sm"
                    onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE; }}
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFormData(prev => ({ ...prev, image: DEFAULT_IMAGE })); }}
                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
                    title="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div className="absolute bottom-1.5 left-1.5 text-[10px] bg-black/50 text-white px-2 py-0.5 rounded-full font-medium">
                    Click to replace
                  </div>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-7 h-7 text-slate-400" />
                  <div className="text-center">
                    <p className="text-xs font-bold text-slate-600">Click to upload or drag & drop</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">JPG, PNG, GIF, WEBP — max 10 MB</p>
                  </div>
                </>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Upload error */}
            {uploadError && (
              <p className="mt-1 text-[11px] text-rose-600 font-medium flex items-center gap-1">
                <X className="w-3 h-3" /> {uploadError}
              </p>
            )}

            {/* Uploaded file indicator */}
            {isUploadedImage && !isUploading && (
              <p className="mt-1 text-[11px] text-teal-700 font-semibold flex items-center gap-1">
                <ImageIcon className="w-3 h-3" /> Uploaded: {formData.image.split('/').pop()}
              </p>
            )}
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

        {/* ── Additional Gallery Images ── */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
            <span>Event Gallery & Additional Photos</span>
            <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Optional</span>
          </label>
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex flex-wrap items-center gap-3">
              {(formData.galleryImages || []).map((imgUrl, idx) => (
                <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden group">
                  <img src={imgUrl} className="w-full h-full object-cover" alt="Gallery preview" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData(prev => ({
                        ...prev,
                        galleryImages: prev.galleryImages.filter((_, i) => i !== idx)
                      }));
                    }}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              ))}

              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleGalleryUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  title="Upload additional photos"
                />
                <button
                  type="button"
                  className="w-16 h-16 rounded-lg border-2 border-dashed border-teal-300 bg-teal-50 hover:bg-teal-100 text-teal-700 flex flex-col items-center justify-center transition-colors"
                >
                  <UploadCloud className="w-5 h-5" />
                  <span className="text-[9px] font-bold mt-1 tracking-wider">ADD</span>
                </button>
              </div>
            </div>
            {(formData.galleryImages || []).length === 0 && (
              <p className="text-[11px] text-slate-500 mt-2 font-medium">Add more context with extra photographs from the venue, speakers, or posters.</p>
            )}
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
            disabled={isSubmitting || isUploading}
            className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : event ? 'Save Changes' : 'Schedule Event'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
