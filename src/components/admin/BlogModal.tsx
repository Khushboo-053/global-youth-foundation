import React, { useState, useEffect } from 'react';
import { NewsItem } from '../../types';
import { Modal } from '../Modal';
import { Image as ImageIcon, Sparkles } from 'lucide-react';

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog: NewsItem | null;
  onSave: (blogData: any) => Promise<any>;
}

export const BlogModal: React.FC<BlogModalProps> = ({
  isOpen,
  onClose,
  blog,
  onSave
}) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Community News',
    shortDescription: '',
    content: '',
    author: 'Editorial Desk, GYF',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    isPublished: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || '',
        category: blog.category || 'Community News',
        shortDescription: blog.shortDescription || '',
        content: blog.content || '',
        author: blog.author || 'Editorial Desk, GYF',
        readTime: blog.readTime || '4 min read',
        image: blog.image || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800',
        date: blog.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        isPublished: blog.isPublished ?? true
      });
      setErrorMsg('');
    } else {
      setFormData({
        title: '',
        category: 'Youth Empowerment',
        shortDescription: '',
        content: '',
        author: 'Editorial Desk, GYF',
        readTime: '4 min read',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        isPublished: true
      });
      setErrorMsg('');
    }
  }, [blog, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setErrorMsg('Article title and content are required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      if (blog) {
        await onSave({ ...formData, id: blog.id });
      } else {
        await onSave(formData);
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to save blog post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={blog ? `Edit News Article: ${blog.title}` : 'Publish New Blog / Press Release'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Article Headline / Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. 2026 Youth Fellowship Cohort Launched Across Kashmir Valley"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
            >
              <option value="Youth Empowerment">Youth Empowerment</option>
              <option value="Environmental Action">Environmental Action</option>
              <option value="Legal Aid & Rights">Legal Aid & Rights</option>
              <option value="Community News">Community News</option>
              <option value="Leadership & Policy">Leadership & Policy</option>
              <option value="Education & Fellowships">Education & Fellowships</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Author / Byline
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Read Time Estimate
            </label>
            <input
              type="text"
              placeholder="e.g. 3 min read"
              value={formData.readTime}
              onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Short Summary / Excerpt *
          </label>
          <textarea
            rows={2}
            required
            placeholder="A compelling 1-2 sentence overview for cards and meta previews..."
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Featured Image URL
          </label>
          <div className="flex items-center gap-3">
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
            />
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="w-12 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
              />
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Full Article Body (Markdown supported) *
          </label>
          <textarea
            rows={7}
            required
            placeholder="Write the full narrative of the article, report, or press release here..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden font-mono"
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="blog-publish-toggle"
            checked={formData.isPublished}
            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
            className="w-4 h-4 text-teal-800 rounded-sm border-slate-300 focus:ring-teal-700"
          />
          <label htmlFor="blog-publish-toggle" className="text-xs font-bold text-slate-800">
            Publish immediately on public website blogs page (/blogs)
          </label>
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
            {isSubmitting ? 'Saving...' : blog ? 'Save Changes' : 'Publish Article'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
