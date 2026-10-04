import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Calendar, 
  User, 
  Clock, 
  ExternalLink,
  Tag,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { NewsItem } from '../../types';
import { BlogModal } from './BlogModal';
import { Modal } from '../Modal';
import { ArticleContentRenderer } from '../ArticleContentRenderer';
import { Link } from 'react-router-dom';
import { Image as ImageIcon } from 'lucide-react';

interface AdminBlogsTabProps {
  blogs: NewsItem[];
  onCreateBlog: (blog: Omit<NewsItem, 'id'>) => Promise<NewsItem>;
  onUpdateBlog: (id: string, updates: Partial<NewsItem>) => Promise<void>;
  onDeleteBlog: (id: string) => Promise<void>;
  onTogglePublish: (id: string) => Promise<void>;
}

export const AdminBlogsTab: React.FC<AdminBlogsTabProps> = ({
  blogs,
  onCreateBlog,
  onUpdateBlog,
  onDeleteBlog,
  onTogglePublish
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<NewsItem | null>(null);
  const [blogToDelete, setBlogToDelete] = useState<NewsItem | null>(null);
  const [blogToPreview, setBlogToPreview] = useState<NewsItem | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const categories = Array.from(new Set(blogs.map(b => b.category).filter(Boolean)));

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || blog.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setEditingBlog(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (blog: NewsItem) => {
    setEditingBlog(blog);
    setIsModalOpen(true);
  };

  const handleSave = async (blogData: any) => {
    if (editingBlog) {
      await onUpdateBlog(editingBlog.id, blogData);
      setActionSuccess('Article updated successfully.');
    } else {
      await onCreateBlog(blogData);
      setActionSuccess('New article published successfully.');
    }
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;
    await onDeleteBlog(blogToDelete.id);
    setActionSuccess(`Article "${blogToDelete.title}" deleted.`);
    setTimeout(() => setActionSuccess(null), 4000);
    setBlogToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-teal-800" />
            News & Editorial Desk Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Publish youth impact stories, policy updates, and press dispatches.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/blogs"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 bg-white text-xs font-bold transition-colors shadow-2xs"
            title="Open Live Public Blogs Page"
          >
            <ExternalLink className="w-3.5 h-3.5 text-teal-800" />
            <span>Live Blog Page</span>
          </Link>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Article</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button 
            onClick={() => setActionSuccess(null)}
            className="text-emerald-600 hover:text-emerald-900 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search & Category Filter */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search articles by title, author, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-slate-500">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700 max-w-[200px]"
          >
            <option value="all">All Categories ({blogs.length})</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 text-xs">
            No articles found matching current filters.
          </div>
        ) : (
          filteredBlogs.map((blog) => {
            const isPub = blog.isPublished ?? true;

            return (
              <div 
                key={blog.id}
                className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Article Image */}
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img
                      src={blog.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80'}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80';
                      }}
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold">
                      {blog.category}
                    </span>

                    {/* Publish Status Badge */}
                    <button
                      type="button"
                      onClick={() => onTogglePublish(blog.id)}
                      className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-xs transition-colors flex items-center gap-1 ${
                        isPub 
                          ? 'bg-emerald-600/90 hover:bg-emerald-700 text-white' 
                          : 'bg-amber-600/90 hover:bg-amber-700 text-white'
                      }`}
                      title="Click to toggle publish status"
                    >
                      {isPub ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{isPub ? 'Published' : 'Draft'}</span>
                    </button>
                  </div>

                  {/* Article Meta */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {blog.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {blog.readTime}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                      {blog.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {blog.shortDescription}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                      <span>By {blog.author}</span>
                      {blog.articleImages && blog.articleImages.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 font-bold text-[10px] border border-teal-200">
                          <ImageIcon className="w-3 h-3 text-teal-700" />
                          <span>{blog.articleImages.length} inside photo{blog.articleImages.length > 1 ? 's' : ''}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions Bar */}
                <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/blogs?id=${encodeURIComponent(blog.id)}`}
                    target="_blank"
                    id={`blog-view-live-${blog.id}`}
                    className="text-xs font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 transition-colors cursor-pointer"
                    title={`Open "${blog.title}" live in newsroom in a new window`}
                  >
                    <span>View Live</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center gap-1.5">
                    {/* Preview Article Button */}
                    <button
                      type="button"
                      onClick={() => setBlogToPreview(blog)}
                      className="p-2 rounded-xl text-slate-600 hover:text-teal-800 hover:bg-teal-50 transition-colors cursor-pointer"
                      title="Preview formatted article with inside photos"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(blog)}
                      className="p-2 rounded-xl text-slate-600 hover:text-sky-800 hover:bg-sky-50 transition-colors cursor-pointer"
                      title="Edit Article"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setBlogToDelete(blog)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Blog Create / Edit Modal */}
      <BlogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        blog={editingBlog}
        onSave={handleSave}
      />

      {/* Article Live Preview Modal */}
      <Modal
        isOpen={blogToPreview !== null}
        onClose={() => setBlogToPreview(null)}
        title={blogToPreview?.title || 'Article Reader Preview'}
        maxWidth="2xl"
      >
        {blogToPreview && (
          <div className="space-y-4">
            <img
              src={blogToPreview.image}
              alt={blogToPreview.title}
              className="w-full h-64 object-cover rounded-2xl shadow-xs"
              referrerPolicy="no-referrer"
            />
            <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
              <span className="font-extrabold text-teal-800 uppercase tracking-wider">{blogToPreview.category}</span>
              <span>{blogToPreview.date} • By {blogToPreview.author} • {blogToPreview.readTime}</span>
            </div>
            
            <ArticleContentRenderer 
              content={blogToPreview.content}
              articleImages={blogToPreview.articleImages}
            />

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                to={`/blogs?id=${encodeURIComponent(blogToPreview.id)}`}
                id="preview-modal-view-live-btn"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-teal-800 hover:text-teal-950 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors cursor-pointer"
              >
                <span>View Live on Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => setBlogToPreview(null)}
                className="px-5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      {blogToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Delete News Article
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to delete <strong>"{blogToDelete.title}"</strong>? This will remove it from the public news feed immediately.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setBlogToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Delete Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
