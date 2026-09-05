import React, { useState, useEffect, useRef } from 'react';
import { NewsItem, BlogArticleImage } from '../../types';
import { Modal } from '../Modal';
import { 
  Image as ImageIcon, 
  Upload, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Eye, 
  Edit3, 
  Sparkles, 
  Copy, 
  X,
  Camera,
  Link as LinkIcon
} from 'lucide-react';
import { ArticleContentRenderer } from '../ArticleContentRenderer';

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
    isPublished: true,
    articleImages: [] as BlogArticleImage[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  // Featured image upload
  const featuredFileInputRef = useRef<HTMLInputElement | null>(null);
  const [featuredUploadError, setFeaturedUploadError] = useState<string | null>(null);

  // Inside article image upload state
  const [showInsideImageDrawer, setShowInsideImageDrawer] = useState(false);
  const [insideImageMode, setInsideImageMode] = useState<'upload' | 'url'>('upload');
  const [tempInsideImage, setTempInsideImage] = useState<{ url: string; caption: string }>({
    url: '',
    caption: ''
  });
  const [insideImageError, setInsideImageError] = useState<string | null>(null);
  const [isDraggingOverTextarea, setIsDraggingOverTextarea] = useState(false);
  const [copiedTagId, setCopiedTagId] = useState<string | null>(null);

  const insideFileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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
        isPublished: blog.isPublished ?? true,
        articleImages: Array.isArray(blog.articleImages) ? blog.articleImages : []
      });
      setErrorMsg('');
      setActiveTab('write');
      setShowInsideImageDrawer(false);
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
        isPublished: true,
        articleImages: []
      });
      setErrorMsg('');
      setActiveTab('write');
      setShowInsideImageDrawer(false);
    }
  }, [blog, isOpen]);

  // Handle Featured Photo File Upload
  const handleFeaturedPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFeaturedUploadError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFeaturedUploadError('Image size must be less than 5MB.');
      return;
    }

    setFeaturedUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Process File for Inside Article Image
  const processInsideImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setInsideImageError('Please choose a valid image file (PNG, JPG, WEBP, or SVG).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setInsideImageError('Image size must be less than 5MB.');
      return;
    }

    setInsideImageError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setTempInsideImage(prev => ({
          ...prev,
          url: reader.result as string,
          caption: prev.caption || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInsideFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processInsideImageFile(file);
    }
  };

  // Drag and drop onto article textarea
  const handleTextareaDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setIsDraggingOverTextarea(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const caption = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          insertImageMarkdown(reader.result, caption);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper to insert markdown image tag at cursor position
  const insertImageMarkdown = (url: string, captionText?: string) => {
    const textarea = textareaRef.current;
    const cleanCaption = captionText?.trim() || 'Article Photograph';
    const tag = `\n\n![${cleanCaption}](${url})\n\n`;

    let newContent = '';
    if (textarea) {
      const start = textarea.selectionStart || 0;
      const end = textarea.selectionEnd || 0;
      const currentVal = formData.content;
      newContent = currentVal.substring(0, start) + tag + currentVal.substring(end);
    } else {
      newContent = formData.content + tag;
    }

    // Also record image in articleImages list
    const newImageItem: BlogArticleImage = {
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      url,
      caption: cleanCaption,
      insertedAt: new Date().toISOString()
    };

    setFormData(prev => ({
      ...prev,
      content: newContent,
      articleImages: [...(prev.articleImages || []), newImageItem]
    }));

    // Reset drawer
    setTempInsideImage({ url: '', caption: '' });
    setShowInsideImageDrawer(false);
    setInsideImageError(null);
  };

  // Insert from drawer
  const handleConfirmInsertInsideImage = () => {
    if (!tempInsideImage.url.trim()) {
      setInsideImageError('Please upload an image file or provide an image URL first.');
      return;
    }
    insertImageMarkdown(tempInsideImage.url, tempInsideImage.caption);
  };

  // Remove an attached image from the article
  const handleRemoveArticleImage = (imageId: string, imageUrl: string) => {
    setFormData(prev => {
      // Remove from articleImages list
      const updatedImages = (prev.articleImages || []).filter(img => img.id !== imageId);
      
      // Optionally clean out any matching markdown image tag from content
      // Escape URL for regex
      const escapedUrl = imageUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`!\\[.*?\\]\\(${escapedUrl}\\)`, 'g');
      const updatedContent = prev.content.replace(regex, '').replace(/\n\s*\n\s*\n/g, '\n\n');

      return {
        ...prev,
        content: updatedContent,
        articleImages: updatedImages
      };
    });
  };

  // Re-insert existing attached image into text at cursor
  const handleReinsertImage = (img: BlogArticleImage) => {
    insertImageMarkdown(img.url, img.caption);
  };

  // Copy markdown tag
  const handleCopyTag = (img: BlogArticleImage) => {
    const tag = `![${img.caption || 'Article Photograph'}](${img.url})`;
    navigator.clipboard.writeText(tag);
    setCopiedTagId(img.id);
    setTimeout(() => setCopiedTagId(null), 2000);
  };

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
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Article Headline */}
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

        {/* Metadata Grid */}
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

        {/* Short Summary */}
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

        {/* Featured Image (with URL + Upload Photo options) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-700">
              Featured Banner Image (Cover Photo)
            </label>
            <button
              type="button"
              id="upload-featured-image-btn"
              onClick={() => featuredFileInputRef.current?.click()}
              className="text-[11px] font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1 cursor-pointer"
            >
              <Upload className="w-3 h-3" />
              <span>Upload Cover Photo</span>
            </button>
          </div>

          <input
            type="file"
            ref={featuredFileInputRef}
            onChange={handleFeaturedPhotoUpload}
            accept="image/*"
            className="hidden"
            id="featured-image-file-input"
          />

          {featuredUploadError && (
            <p className="text-[11px] text-rose-600 font-medium mb-1">{featuredUploadError}</p>
          )}

          <div className="flex items-center gap-3">
            <input
              type="url"
              placeholder="Paste URL (e.g. https://images.unsplash.com/...) or click 'Upload Cover Photo'"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
            />
            {formData.image && (
              <div className="relative group shrink-0">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-14 h-10 rounded-lg object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>
        </div>

        {/* ================================================================= */}
        {/* FULL ARTICLE BODY & OPTION TO UPLOAD IMAGE INSIDE ARTICLE */}
        {/* ================================================================= */}
        <div className="pt-2 border-t border-slate-200/80 space-y-2.5">
          {/* Header Bar with Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <label className="block text-xs font-extrabold text-slate-900">
                Full Article Body (Markdown supported) *
              </label>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                Images, Headings, Quotes
              </span>
            </div>

            {/* Action Buttons: Upload Image inside Article + Toggle Preview */}
            <div className="flex items-center gap-2">
              {/* Option to Upload Image Inside Article */}
              <button
                type="button"
                id="open-upload-inside-image-btn"
                onClick={() => {
                  setShowInsideImageDrawer(prev => !prev);
                  setInsideImageMode('upload');
                  setInsideImageError(null);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                  showInsideImageDrawer 
                    ? 'bg-teal-900 text-white' 
                    : 'bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200'
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-teal-700" />
                <span>Upload Image Inside Article</span>
              </button>

              {/* Toggle Write / Live Preview */}
              <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                    activeTab === 'write' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Edit3 className="w-3 h-3 inline mr-1" />
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                    activeTab === 'preview' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Eye className="w-3 h-3 inline mr-1" />
                  Preview
                </button>
              </div>
            </div>
          </div>

          {/* INSIDE ARTICLE IMAGE UPLOADER DRAWER / PANEL */}
          {showInsideImageDrawer && (
            <div 
              id="inside-image-upload-drawer"
              className="p-4 rounded-2xl bg-gradient-to-r from-teal-50/70 via-slate-50 to-sky-50/40 border border-teal-200/90 shadow-sm space-y-3 animate-in fade-in zoom-in-98 duration-150"
            >
              <div className="flex items-center justify-between pb-2 border-b border-teal-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-800 text-white flex items-center justify-center">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">
                      Insert Photograph Inside Article Narrative
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Upload from device or paste image URL to place directly inside the story
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white rounded-lg border border-slate-200 p-0.5 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setInsideImageMode('upload')}
                      className={`px-2 py-0.5 rounded-md ${insideImageMode === 'upload' ? 'bg-teal-800 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setInsideImageMode('url')}
                      className={`px-2 py-0.5 rounded-md ${insideImageMode === 'url' ? 'bg-teal-800 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      Image URL
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowInsideImageDrawer(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {insideImageError && (
                <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {insideImageError}
                </div>
              )}

              <input
                type="file"
                ref={insideFileInputRef}
                onChange={handleInsideFileSelect}
                accept="image/*"
                className="hidden"
                id="inside-article-file-input"
              />

              {/* Mode 1: Upload File from Computer */}
              {insideImageMode === 'upload' ? (
                <div>
                  {tempInsideImage.url ? (
                    <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-white rounded-xl border border-slate-200">
                      <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                        <img 
                          src={tempInsideImage.url} 
                          alt="Uploaded Preview" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 space-y-2 w-full">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                            Image Caption / Alt Text (Shown under image)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Participants at the 2026 Youth Rights Convention"
                            value={tempInsideImage.caption}
                            onChange={(e) => setTempInsideImage(prev => ({ ...prev, caption: e.target.value }))}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => insideFileInputRef.current?.click()}
                            className="text-[11px] font-bold text-teal-800 hover:text-teal-950 underline"
                          >
                            Choose Different Photo
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => insideFileInputRef.current?.click()}
                      className="border-2 border-dashed border-teal-300 hover:border-teal-500 bg-white/70 hover:bg-teal-50/50 rounded-xl p-4 text-center cursor-pointer transition-all group"
                    >
                      <Upload className="w-6 h-6 text-teal-700 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                      <p className="text-xs font-bold text-slate-800">
                        Click to select photo from device, or drag & drop here
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Supports PNG, JPG, WEBP, or SVG up to 5MB
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Mode 2: Insert by Web URL */
                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Web Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={tempInsideImage.url}
                      onChange={(e) => setTempInsideImage(prev => ({ ...prev, url: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Caption / Description
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Field volunteers distributing relief kits"
                      value={tempInsideImage.caption}
                      onChange={(e) => setTempInsideImage(prev => ({ ...prev, caption: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Action: Insert into Article */}
              {tempInsideImage.url && (
                <div className="pt-2 flex items-center justify-end gap-2 border-t border-teal-100">
                  <button
                    type="button"
                    onClick={() => {
                      setTempInsideImage({ url: '', caption: '' });
                      setShowInsideImageDrawer(false);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    id="confirm-insert-inside-image-btn"
                    onClick={handleConfirmInsertInsideImage}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Insert Image into Article</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Editor Body or Live Preview */}
          {activeTab === 'write' ? (
            <div className="relative">
              <textarea
                ref={textareaRef}
                rows={9}
                required
                placeholder="Write the full narrative of the article here... You can use the 'Upload Image Inside Article' button above to place photos at any position, or drag & drop image files directly into this box!"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingOverTextarea(true);
                }}
                onDragLeave={() => setIsDraggingOverTextarea(false)}
                onDrop={handleTextareaDrop}
                className={`w-full px-3.5 py-3 rounded-2xl border text-xs leading-relaxed focus:ring-2 focus:ring-teal-700 focus:outline-hidden font-mono transition-all ${
                  isDraggingOverTextarea 
                    ? 'border-teal-500 bg-teal-50/50 ring-2 ring-teal-500' 
                    : 'border-slate-200 bg-white'
                }`}
              />
              {isDraggingOverTextarea && (
                <div className="absolute inset-0 rounded-2xl bg-teal-900/10 backdrop-blur-[1px] border-2 border-dashed border-teal-600 flex items-center justify-center pointer-events-none">
                  <div className="p-3 bg-white rounded-xl shadow-lg flex items-center gap-2 text-teal-900 text-xs font-bold">
                    <Upload className="w-4 h-4 text-teal-800 animate-bounce" />
                    <span>Drop image file here to insert into article narrative</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Live Formatted Article Preview with Images */
            <div className="p-4 sm:p-6 rounded-2xl border border-slate-200 bg-slate-50/60 max-h-[380px] overflow-y-auto space-y-4">
              <div className="pb-3 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-teal-800 uppercase tracking-wider">Live Reader Preview</span>
                <span>{formData.category} • {formData.readTime}</span>
              </div>
              <h2 className="text-xl font-black text-slate-900">{formData.title || 'Untitled Article'}</h2>
              <ArticleContentRenderer 
                content={formData.content || '*No content written yet. Switch to Write mode to compose.*'} 
                articleImages={formData.articleImages}
              />
            </div>
          )}

          {/* ATTACHED INSIDE IMAGES THUMBNAIL STRIP */}
          {formData.articleImages && formData.articleImages.length > 0 && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-teal-800" />
                  <span>Images Inside This Article ({formData.articleImages.length})</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">
                  Click 'Re-insert' to place again at cursor position
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {formData.articleImages.map((img) => (
                  <div 
                    key={img.id}
                    className="p-2 rounded-lg bg-white border border-slate-200 flex items-center gap-2.5 shadow-2xs group"
                  >
                    <img 
                      src={img.url} 
                      alt={img.caption || 'Article photo'} 
                      className="w-12 h-12 rounded-md object-cover border border-slate-100 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-slate-800 truncate" title={img.caption}>
                        {img.caption || 'Untitled photo'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => handleReinsertImage(img)}
                          className="text-[10px] font-bold text-teal-700 hover:text-teal-900 underline cursor-pointer"
                        >
                          Insert Tag
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyTag(img)}
                          className="text-[10px] font-medium text-slate-500 hover:text-slate-700 cursor-pointer"
                        >
                          {copiedTagId === img.id ? 'Copied!' : 'Copy Tag'}
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveArticleImage(img.id, img.url)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove image from article"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Publish Immediately Checkbox */}
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

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? 'Saving...' : blog ? 'Save Changes' : 'Publish Article'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

