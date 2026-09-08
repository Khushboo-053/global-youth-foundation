import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import { 
  Search, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Sparkles, 
  Filter, 
  BookOpen, 
  Share2, 
  Check, 
  Image as ImageIcon 
} from 'lucide-react';
import { NewsItem } from '../types';
import { api } from '../services/api';
import { Modal } from '../components/Modal';
import { ArticleContentRenderer } from '../components/ArticleContentRenderer';
import { NEWS_ITEMS } from '../data/mockData';
import { useApp } from '../context/AppContext';

export const BlogsPage: React.FC = () => {
  const { blogs: appBlogs, user } = useApp();
  const [blogs, setBlogs] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams<{ id?: string }>();

  const targetArticleId = searchParams.get('id') || searchParams.get('article') || params.id;

  useEffect(() => {
    if (appBlogs && appBlogs.length > 0) {
      setBlogs(appBlogs);
      setIsLoading(false);
    } else {
      const fetchBlogs = async () => {
        try {
          setIsLoading(true);
          const data = await api.blogs.getAll();
          if (data && data.length > 0) {
            setBlogs(data);
          } else {
            setBlogs(NEWS_ITEMS.map(b => ({ ...b, isPublished: true })));
          }
        } catch (err) {
          setBlogs(NEWS_ITEMS.map(b => ({ ...b, isPublished: true })));
        } finally {
          setIsLoading(false);
        }
      };
      fetchBlogs();
    }
  }, [appBlogs]);

  // Automatically open article when targetId is provided in URL (e.g. from backend View Live)
  useEffect(() => {
    if (!targetArticleId || blogs.length === 0) return;
    const cleanTarget = decodeURIComponent(targetArticleId).trim();
    const found = blogs.find(
      b => String(b.id) === cleanTarget || 
           b.id.toLowerCase() === cleanTarget.toLowerCase() ||
           String(b.id).replace(/^blog-/, '') === cleanTarget.replace(/^blog-/, '') ||
           b.title.toLowerCase() === cleanTarget.toLowerCase()
    );
    if (found) {
      setSelectedArticle(found);
    }
  }, [targetArticleId, blogs]);

  const handleCloseArticle = () => {
    setSelectedArticle(null);
    if (searchParams.get('id') || searchParams.get('article')) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('id');
      nextParams.delete('article');
      setSearchParams(nextParams, { replace: true });
    }
  };

  const categories = ['All', ...Array.from(new Set(blogs.map(b => b.category).filter(Boolean)))];

  const visibleBlogs = blogs.filter(b => user?.role === 'admin' || b.isPublished !== false);

  const filteredBlogs = visibleBlogs.filter(b => {
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesSearch = 
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleShare = (article: NewsItem) => {
    const articleUrl = `${window.location.origin}/blogs?id=${encodeURIComponent(article.id)}`;
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.shortDescription,
        url: articleUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(articleUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Admin Live Preview Banner */}
      {user?.role === 'admin' && (
        <div className="bg-slate-900 border-b border-teal-500/30 text-white px-4 py-2.5 sm:px-6">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold text-teal-300">Admin Mode:</span>
              <span className="text-slate-300">Viewing Live Newsroom</span>
            </div>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Admin Dashboard</span>
            </Link>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-slate-900 via-teal-950 to-slate-900 text-white py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-5xl mx-auto relative z-10 space-y-4 text-center">
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-xs font-semibold backdrop-blur-xs transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Official Newsroom & Publications</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto">
            Field Dispatches, Press Releases & Stories of Change
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Read verified reports, project milestones, community testimonies, and youth leadership initiatives directly from Global Youth Foundation.
          </p>

          {/* Search & Filter Bar */}
          <div className="pt-6 max-w-xl mx-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search articles by title, topic, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-400 backdrop-blur-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-teal-800 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500">Loading publications...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/90 shadow-xs max-w-lg mx-auto space-y-3">
            <p className="text-sm font-bold text-slate-800">No articles found</p>
            <p className="text-xs text-slate-500">Try changing your search terms or category filter.</p>
            <button
              type="button"
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
              className="text-xs font-bold text-teal-800 hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((article) => (
              <article 
                key={article.id}
                className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Cover Photo */}
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold">
                      {article.category}
                    </span>

                    {/* Inside Photos Badge */}
                    {article.articleImages && article.articleImages.length > 0 && (
                      <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-xs text-teal-300 text-[10px] font-bold flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        <span>+{article.articleImages.length} photos inside</span>
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {article.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {article.readTime || '3 min read'}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-teal-800 transition-colors line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {article.shortDescription}
                    </p>

                    <div className="text-[11px] text-slate-400 font-medium">
                      By {article.author}
                    </div>
                  </div>
                </div>

                {/* Card Footer Action */}
                <div className="p-5 pt-0">
                  <button
                    type="button"
                    onClick={() => setSelectedArticle(article)}
                    className="w-full py-2.5 rounded-xl bg-teal-50 group-hover:bg-teal-800 text-teal-900 group-hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>Read Full Story</span>
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Full Article Reader Modal with Inside Photos & Captions */}
      <Modal
        isOpen={selectedArticle !== null}
        onClose={handleCloseArticle}
        title={selectedArticle?.title || 'Article Reader'}
        maxWidth="2xl"
      >
        {selectedArticle && (
          <div className="space-y-4">
            {/* Header Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-xs">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-64 sm:h-72 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Meta bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="font-extrabold text-teal-800 uppercase tracking-wider">
                  {selectedArticle.category}
                </span>
                <span>•</span>
                <span>{selectedArticle.date}</span>
                <span>•</span>
                <span>By {selectedArticle.author}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleShare(selectedArticle)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:text-teal-800 hover:bg-slate-50 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
                </button>
              </div>
            </div>

            {/* Formatted Content with Inside Photos and Lightbox */}
            <ArticleContentRenderer
              content={selectedArticle.content}
              articleImages={selectedArticle.articleImages}
            />

            {/* Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-[11px] text-slate-400">
                Published by Global Youth Foundation Editorial Desk
              </p>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl cursor-pointer transition-colors"
              >
                Close Article
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
