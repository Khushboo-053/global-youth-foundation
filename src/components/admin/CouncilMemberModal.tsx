import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  Upload,
  Sparkles,
  Check,
  Image as ImageIcon,
  UserCheck,
  Loader2
} from 'lucide-react';
import { LeadershipMember } from '../../types';
import { DragDropImageUpload } from './DragDropImageUpload';

interface CouncilMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: LeadershipMember) => void;
  initialMember?: LeadershipMember | null;
}

const PRESET_AVATARS = [
  { label: 'Leader 1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  { label: 'Leader 2', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
  { label: 'Leader 3', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
  { label: 'Leader 4', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80' },
  { label: 'Leader 5', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  { label: 'Leader 6', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80' },
  { label: 'Leader 7', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80' },
  { label: 'Leader 8', url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80' },
];

const ROLE_PRESETS = [
  'Executive Director & Founder',
  'Head of Grievance Redressal & Legal Aid',
  'Director of Programs & Youth Partnerships',
  'Chief Advisor - Health & Community Upliftment',
  'Senior Legal Counsel & Human Rights Advocate',
  'Director of Youth Mobilization & Chapters',
  'Ombudsman Coordinator - Kashmir Central'
];

export const CouncilMemberModal: React.FC<CouncilMemberModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialMember
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialMember) {
      setName(initialMember.name || '');
      setRole(initialMember.role || '');
      setBio(initialMember.bio || '');
      setImage(initialMember.image || PRESET_AVATARS[0].url);
    } else {
      setName('');
      setRole('');
      setBio('');
      setImage(PRESET_AVATARS[0].url);
    }
    setErrors({});
  }, [initialMember, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('File size exceeds 3MB limit. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!role.trim()) newErrors.role = 'Role / Designation is required';
    if (!bio.trim()) newErrors.bio = 'Bio description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const member: LeadershipMember = {
      id: initialMember?.id || `lead-${Date.now()}`,
      name: name.trim(),
      role: role.trim(),
      bio: bio.trim(),
      image: image.trim() || PRESET_AVATARS[0].url
    };

    onSave(member);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-8">

        {/* Header */}
        <div className="bg-[#2C3292] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">
                {initialMember ? 'Edit Council Member' : 'Add New Council Member'}
              </h2>
              <p className="text-xs text-blue-200">
                Youth Leadership Council & Governance Team (About Page)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">

          {/* Card Preview */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">
              Live Card Preview (How it appears on About Page)
            </span>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border-2 border-teal-800/20 shadow-xs">
                <img
                  src={image || PRESET_AVATARS[0].url}
                  alt={name || 'Preview'}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = PRESET_AVATARS[0].url;
                  }}
                />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-base font-bold text-slate-900">
                  {name || 'Leader Full Name'}
                </h4>
                <p className="text-xs font-semibold text-teal-800 mt-0.5">
                  {role || 'Role / Designation'}
                </p>
                <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                  {bio || 'Short background biography and credentials will be showcased here.'}
                </p>
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Full Name <span className="text-red-500">*</span></span>
              {errors.name && <span className="text-[11px] text-red-500 font-semibold">{errors.name}</span>}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
              }}
              placeholder="e.g. Adil Farooq or Dr. Rabia Qadir"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-800"
            />
          </div>

          {/* Role / Designation */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Role / Designation <span className="text-red-500">*</span></span>
              {errors.role && <span className="text-[11px] text-red-500 font-semibold">{errors.role}</span>}
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                if (errors.role) setErrors(prev => ({ ...prev, role: '' }));
              }}
              placeholder="e.g. Executive Director & Founder"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-800"
            />

            {/* Role Quick Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {ROLE_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setRole(preset);
                    if (errors.role) setErrors(prev => ({ ...prev, role: '' }));
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-[11px] text-slate-600 font-medium transition-colors cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Bio / Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Bio & Experience Summary <span className="text-red-500">*</span></span>
              {errors.bio && <span className="text-[11px] text-red-500 font-semibold">{errors.bio}</span>}
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => {
                setBio(e.target.value);
                if (errors.bio) setErrors(prev => ({ ...prev, bio: '' }));
              }}
              placeholder="e.g. Grassroots human rights advocate with 8+ years experience in youth development and community mediation."
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-800"
            />
          </div>

          {/* Profile Photo Selection */}
          <div className="space-y-4">
            <DragDropImageUpload
              label="Profile Photo (Upload or drag and drop)"
              value={image}
              onChange={(url) => setImage(url)}
            />

            {/* Preset Avatars Selection */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Or Choose from Sample Avatars:
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {PRESET_AVATARS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImage(preset.url)}
                    className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${image === preset.url ? 'border-teal-800 ring-2 ring-teal-800/30 scale-105' : 'border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100'
                      }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {image === preset.url && (
                      <div className="absolute inset-0 bg-teal-900/40 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white font-black stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>{initialMember ? 'Save Changes' : 'Add to Council'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
