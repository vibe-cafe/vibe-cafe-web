'use client';

import { useState, useRef, useEffect } from 'react';

export default function PlacesActions() {
  const [showShareDropdown, setShowShareDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowShareDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-3">
      {/* Share Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowShareDropdown(!showShareDropdown)}
          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded transition-colors flex items-center gap-1 cursor-pointer"
        >
          分享
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {showShareDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-zinc-800 rounded-lg shadow-lg z-10 border border-zinc-700">
            <div className="py-1">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setShowShareDropdown(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                复制链接
              </button>
              <button
                onClick={() => {
                  const url = encodeURIComponent(window.location.href);
                  window.open(`https://twitter.com/intent/tweet?url=${url}`, '_blank');
                  setShowShareDropdown(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                𝕏
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contribute Button */}
      <button
        onClick={() => {
          window.open('https://github.com/vibe-cafe/vibe-places-data/issues/new?template=new-place.yml', '_blank');
        }}
        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded transition-colors cursor-pointer"
      >
        贡献
      </button>
    </div>
  );
}
