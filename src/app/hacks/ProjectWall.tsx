'use client';

import { useEffect, useMemo, useState } from 'react';

type Project = {
  id: string;
  title: string;
  descriptionHtml: string;
  teamName: string;
  imageDataUrls: string[];
  githubUrl?: string;
  xhsUrl?: string;
};

export default function ProjectWall({ projects }: { projects: Project[] }) {
  const [items, setItems] = useState<Project[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [enlargedSrc, setEnlargedSrc] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const onCardClick = (index: number) => setActiveIndex(index);
  const onClose = () => setActiveIndex(null);

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    
    const query = searchQuery.toLowerCase().trim();
    return items.filter((project) => {
      const title = project.title.toLowerCase();
      const description = project.descriptionHtml.replace(/<[^>]*>/g, '').toLowerCase(); // Strip HTML tags
      return title.includes(query) || description.includes(query);
    });
  }, [items, searchQuery]);

  const bodyScrollLock = useMemo(() => {
    if (typeof document === 'undefined') return { lock: () => {}, unlock: () => {} };
    return {
      lock: () => {
        document.body.style.overflow = 'hidden';
      },
      unlock: () => {
        document.body.style.overflow = '';
      },
    };
  }, []);

  // Randomize order per visit on mount
  useEffect(() => {
    const arr = [...projects];
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    setItems(arr);
  }, [projects]);

  // Handle ESC key to close project window (only when lightbox is not open)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeIndex !== null && enlargedSrc === null) {
        bodyScrollLock.unlock();
        onClose();
      }
    };

    if (activeIndex !== null) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [activeIndex, enlargedSrc, bodyScrollLock, onClose]);

  return (
    <>
      {/* Search input - positioned next to project count */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-zinc-400">
          {searchQuery ? `找到 ${filteredItems.length} 个项目` : `共 ${items.length} 个项目（随机排序）`}
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="搜索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 px-3 py-1.5 text-sm bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-sm"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((p, i) => (
          <button
            key={p.id}
            onClick={() => {
              bodyScrollLock.lock();
              onCardClick(i);
            }}
            className="text-left bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden hover:border-zinc-600 transition-colors cursor-pointer"
          >
            {p.imageDataUrls?.[0] && (
              <div className="w-full">
                <img
                  src={p.imageDataUrls[0]}
                  alt={p.title}
                  className="w-full h-48 md:h-56 object-cover"
                />
              </div>
            )}
            <div className="p-5">
              <h2 className="text-xl font-semibold mb-1 truncate">{p.title}</h2>
              {p.teamName && (
                <p className="text-sm text-gray-400 truncate">团队：{p.teamName}</p>
              )}
            </div>
          </button>
        ))}
      </div>

      {activeIndex !== null && filteredItems[activeIndex] && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => {
            bodyScrollLock.unlock();
            onClose();
          }}
        >
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div
              className="relative max-w-4xl w-full bg-zinc-950 text-white border border-zinc-800 rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-end p-3">
                <button
                  onClick={() => {
                    bodyScrollLock.unlock();
                    onClose();
                  }}
                  aria-label="Close"
                  className="p-2 rounded hover:bg-zinc-900 border border-transparent hover:border-zinc-700 cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <div className="px-5 pb-5 overflow-y-auto max-h-[75vh]">
                {filteredItems[activeIndex].imageDataUrls?.length > 0 && (
                  <div className="mb-5 -mx-5 px-5">
                    <div className="flex gap-3 overflow-x-auto no-scrollbar">
                      {filteredItems[activeIndex].imageDataUrls.map((src, idx) => (
                        <img
                          key={idx}
                          src={src}
                          alt={filteredItems[activeIndex].title}
                          className="h-32 w-auto object-cover rounded border border-zinc-800 cursor-pointer"
                          onClick={() => setEnlargedSrc(src)}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <h3 className="text-2xl font-semibold mb-1">{filteredItems[activeIndex].title}</h3>
                {filteredItems[activeIndex].teamName && (
                  <p className="text-sm text-gray-400 mb-4">团队：{filteredItems[activeIndex].teamName}</p>
                )}
                <div
                  className="md-content md-content-invert max-w-none text-base leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: filteredItems[activeIndex].descriptionHtml }}
                />
              </div>
              {(filteredItems[activeIndex].githubUrl || filteredItems[activeIndex].xhsUrl) && (
                <div className="flex items-center gap-4 p-5 border-t border-zinc-800">
                  {filteredItems[activeIndex].githubUrl && (
                    <a
                      href={filteredItems[activeIndex].githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:underline"
                    >
                      GitHub
                    </a>
                  )}
                  {filteredItems[activeIndex].xhsUrl && (
                    <a
                      href={filteredItems[activeIndex].xhsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-pink-300 hover:underline"
                    >
                      小红书
                    </a>
                  )}
                </div>
              )}
            </div>
            {/* Navigation arrows */}
            <button
              aria-label="Previous project"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-[51] w-10 h-10 rounded-full bg-zinc-900/70 border border-zinc-700 hover:bg-zinc-900 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                if (activeIndex === null) return;
                setActiveIndex((activeIndex - 1 + filteredItems.length) % filteredItems.length);
              }}
            >
              <span className="text-xl">‹</span>
            </button>
            <button
              aria-label="Next project"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-[51] w-10 h-10 rounded-full bg-zinc-900/70 border border-zinc-700 hover:bg-zinc-900 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                if (activeIndex === null) return;
                setActiveIndex((activeIndex + 1) % filteredItems.length);
              }}
            >
              <span className="text-xl">›</span>
            </button>
          </div>
        </div>
      )}

      {enlargedSrc && (
        <Lightbox src={enlargedSrc} onClose={() => setEnlargedSrc(null)} />)
      }
      {/* Local markdown styles to keep /hacks HTML readable regardless of global resets */}
      <style jsx global>{`
        .md-content { line-height: 1.7; }
        .md-content h1, .md-content h2, .md-content h3 { font-weight: 700; margin: 0.75rem 0 0.5rem; }
        .md-content h1 { font-size: 1.375rem; }
        .md-content h2 { font-size: 1.2rem; }
        .md-content h3 { font-size: 1.05rem; }
        .md-content p { margin: 0 0 0.75rem; }
        .md-content ul, .md-content ol { margin: 0.5rem 0 0.75rem; padding-left: 1.25rem; }
        .md-content ul { list-style: disc; }
        .md-content ol { list-style: decimal; }
        .md-content li { margin: 0.25rem 0; }
        .md-content a { color: #93c5fd; text-decoration: underline; }
        .md-content code { background: rgba(255,255,255,0.06); padding: 0.1rem 0.3rem; border-radius: 4px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
        .md-content-invert { color: inherit; }
      `}</style>
    </>
  );
}

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/80" />
      <div
        className="absolute inset-0 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <button
          aria-label="Close image"
          onClick={onClose}
          className="absolute top-4 right-4 z-[61] p-2 rounded bg-zinc-900/70 border border-zinc-700 hover:bg-zinc-900 cursor-pointer"
        >
          ✕
        </button>
        <img
          src={src}
          alt="preview"
          onClick={onClose}
          className="max-w-[90vw] max-h-[90vh] object-contain rounded shadow-2xl border border-zinc-800 cursor-zoom-out"
        />
      </div>
    </div>
  );
}


