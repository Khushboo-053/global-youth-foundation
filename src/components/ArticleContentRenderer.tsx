import React, { useState } from 'react';
import { BlogArticleImage } from '../types';
import { Maximize2, X, Download, Camera, Image as ImageIcon } from 'lucide-react';

interface ArticleContentRendererProps {
  content: string;
  articleImages?: BlogArticleImage[];
  className?: string;
}

export const ArticleContentRenderer: React.FC<ArticleContentRendererProps> = ({
  content,
  articleImages = [],
  className = ''
}) => {
  const [activeLightboxImage, setActiveLightboxImage] = useState<{ url: string; caption?: string } | null>(null);

  // Helper to render inline formatting: bold, italic, links
  const renderInlineFormattedText = (text: string): React.ReactNode => {
    // Match bold **text**
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        return <strong key={index} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length >= 2 && !part.startsWith('**')) {
        return <em key={index} className="italic text-slate-800">{part.slice(1, -1)}</em>;
      }
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        return (
          <a
            key={index}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-700 hover:text-teal-900 underline font-medium"
          >
            {linkMatch[1]}
          </a>
        );
      }
      return part;
    });
  };

  // Parse lines/blocks
  const parseBlocks = () => {
    const rawBlocks = content.split(/\n\s*\n/);
    const elements: React.ReactNode[] = [];

    // Track which images from markdown are already rendered
    const renderedImageUrls = new Set<string>();

    rawBlocks.forEach((block, blockIdx) => {
      const trimmed = block.trim();
      if (!trimmed) return;

      // Check for Markdown Image: ![alt](url)
      // It may have caption italicized right after or standalone: ![alt](url)
      const imageRegex = /^!\[(.*?)\]\((.*?)\)$/;
      const imageMatch = trimmed.match(imageRegex);

      if (imageMatch) {
        const alt = imageMatch[1];
        const url = imageMatch[2];
        renderedImageUrls.add(url);

        elements.push(
          <figure key={`img-block-${blockIdx}`} className="my-6 space-y-2">
            <div 
              onClick={() => setActiveLightboxImage({ url, caption: alt })}
              className="relative group cursor-pointer overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-100 shadow-xs hover:shadow-md transition-all duration-300"
            >
              <img
                src={url}
                alt={alt || 'Article photo'}
                className="w-full max-h-[500px] object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5 backdrop-blur-[2px]">
                <Maximize2 className="w-4 h-4" />
                <span>Tap to Expand</span>
              </div>
            </div>
            {alt && (
              <figcaption className="px-2 text-center text-xs text-slate-500 font-medium italic flex items-center justify-center gap-1.5">
                <Camera className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{alt}</span>
              </figcaption>
            )}
          </figure>
        );
        return;
      }

      // Check if block contains an embedded image inside a paragraph
      // e.g. text ... ![alt](url) ... text
      if (trimmed.includes('![') && trimmed.includes('](')) {
        const parts = trimmed.split(/(!\[.*?\]\(.*?\))/g);
        elements.push(
          <div key={`mixed-block-${blockIdx}`} className="space-y-4 my-4">
            {parts.map((sub, subIdx) => {
              const subMatch = sub.match(/^!\[(.*?)\]\((.*?)\)$/);
              if (subMatch) {
                const alt = subMatch[1];
                const url = subMatch[2];
                renderedImageUrls.add(url);
                return (
                  <figure key={`sub-img-${subIdx}`} className="my-4 space-y-2">
                    <div 
                      onClick={() => setActiveLightboxImage({ url, caption: alt })}
                      className="relative group cursor-pointer overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-100 shadow-xs hover:shadow-md transition-all duration-300"
                    >
                      <img
                        src={url}
                        alt={alt || 'Article photo'}
                        className="w-full max-h-[460px] object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5 backdrop-blur-[2px]">
                        <Maximize2 className="w-4 h-4" />
                        <span>Tap to Expand</span>
                      </div>
                    </div>
                    {alt && (
                      <figcaption className="px-2 text-center text-xs text-slate-500 font-medium italic flex items-center justify-center gap-1.5">
                        <Camera className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{alt}</span>
                      </figcaption>
                    )}
                  </figure>
                );
              }
              if (!sub.trim()) return null;
              return (
                <p key={`sub-text-${subIdx}`} className="text-slate-700 text-sm sm:text-[15px] leading-relaxed">
                  {renderInlineFormattedText(sub)}
                </p>
              );
            })}
          </div>
        );
        return;
      }

      // Headings
      if (trimmed.startsWith('### ')) {
        elements.push(
          <h4 key={`h3-${blockIdx}`} className="text-base sm:text-lg font-bold text-slate-900 mt-6 mb-2">
            {renderInlineFormattedText(trimmed.replace(/^###\s+/, ''))}
          </h4>
        );
        return;
      }

      if (trimmed.startsWith('## ')) {
        elements.push(
          <h3 key={`h2-${blockIdx}`} className="text-lg sm:text-xl font-extrabold text-slate-900 mt-7 mb-3">
            {renderInlineFormattedText(trimmed.replace(/^##\s+/, ''))}
          </h3>
        );
        return;
      }

      if (trimmed.startsWith('# ')) {
        elements.push(
          <h2 key={`h1-${blockIdx}`} className="text-xl sm:text-2xl font-black text-slate-900 mt-8 mb-4">
            {renderInlineFormattedText(trimmed.replace(/^#\s+/, ''))}
          </h2>
        );
        return;
      }

      // Blockquote
      if (trimmed.startsWith('> ')) {
        elements.push(
          <blockquote 
            key={`quote-${blockIdx}`} 
            className="my-5 pl-4 border-l-4 border-teal-700 bg-teal-50/40 py-3 pr-4 rounded-r-xl italic text-slate-800 text-sm leading-relaxed"
          >
            {renderInlineFormattedText(trimmed.replace(/^>\s*/gm, ''))}
          </blockquote>
        );
        return;
      }

      // Bullet lists
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items = trimmed.split('\n').filter(l => l.trim().startsWith('- ') || l.trim().startsWith('* '));
        elements.push(
          <ul key={`ul-${blockIdx}`} className="list-disc pl-5 my-4 space-y-1.5 text-sm text-slate-700 leading-relaxed">
            {items.map((item, i) => (
              <li key={i}>{renderInlineFormattedText(item.replace(/^[-*]\s+/, ''))}</li>
            ))}
          </ul>
        );
        return;
      }

      // Numbered lists
      if (/^\d+\.\s+/.test(trimmed)) {
        const items = trimmed.split('\n').filter(l => /^\d+\.\s+/.test(l.trim()));
        elements.push(
          <ol key={`ol-${blockIdx}`} className="list-decimal pl-5 my-4 space-y-1.5 text-sm text-slate-700 leading-relaxed">
            {items.map((item, i) => (
              <li key={i}>{renderInlineFormattedText(item.replace(/^\d+\.\s+/, ''))}</li>
            ))}
          </ol>
        );
        return;
      }

      // Horizontal rule
      if (trimmed === '---' || trimmed === '***') {
        elements.push(<hr key={`hr-${blockIdx}`} className="my-6 border-slate-200" />);
        return;
      }

      // Standard Paragraph
      elements.push(
        <p key={`p-${blockIdx}`} className="text-slate-700 text-sm sm:text-[15px] leading-relaxed my-3 whitespace-pre-line">
          {renderInlineFormattedText(trimmed)}
        </p>
      );
    });

    // If there are attached articleImages that weren't embedded in markdown text, show them in a dedicated gallery section
    const unrenderedImages = (articleImages || []).filter(img => !renderedImageUrls.has(img.url));

    return { elements, unrenderedImages };
  };

  const { elements, unrenderedImages } = parseBlocks();

  const handleDownloadLightbox = () => {
    if (!activeLightboxImage) return;
    const a = document.createElement('a');
    a.href = activeLightboxImage.url;
    a.download = 'article-image.jpg';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Parsed Markdown and Embedded Images */}
      <div className="prose-slate max-w-none">
        {elements}
      </div>

      {/* Supplemental Article Photos Gallery (if any images uploaded to article but not placed in markdown) */}
      {unrenderedImages.length > 0 && (
        <div className="pt-6 mt-8 border-t border-slate-200/90 space-y-3">
          <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700 uppercase tracking-wider">
            <ImageIcon className="w-4 h-4 text-teal-800" />
            <span>Article Photo Gallery ({unrenderedImages.length} {unrenderedImages.length === 1 ? 'photo' : 'photos'})</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {unrenderedImages.map((img, idx) => (
              <figure key={img.id || idx} className="space-y-1.5">
                <div 
                  onClick={() => setActiveLightboxImage({ url: img.url, caption: img.caption })}
                  className="relative group cursor-pointer overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-100 shadow-xs hover:shadow-md transition-all"
                >
                  <img
                    src={img.url}
                    alt={img.caption || `Article photo ${idx + 1}`}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5 backdrop-blur-[2px]">
                    <Maximize2 className="w-4 h-4" />
                    <span>Expand</span>
                  </div>
                </div>
                {img.caption && (
                  <figcaption className="text-center text-xs text-slate-500 italic">
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal for Full Size Viewing */}
      {activeLightboxImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setActiveLightboxImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-200 flex flex-col items-center gap-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="w-full flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-teal-800" />
                <span>{activeLightboxImage.caption || 'Article Photograph'}</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadLightbox}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-teal-800 hover:bg-teal-50 transition-colors cursor-pointer"
                  title="Download photo"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLightboxImage(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* High Res Image */}
            <div className="w-full flex items-center justify-center overflow-auto max-h-[70vh] rounded-2xl bg-slate-900/5">
              <img
                src={activeLightboxImage.url}
                alt={activeLightboxImage.caption || 'Expanded article view'}
                className="max-h-[70vh] max-w-full object-contain rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Caption */}
            {activeLightboxImage.caption && (
              <p className="text-xs sm:text-sm text-slate-600 italic text-center max-w-xl">
                {activeLightboxImage.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
