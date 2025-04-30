'use client';

import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export default function MenuBar({ desktopStyle, onChangeDesktopStyle }: { desktopStyle: 'mac' | 'windows'; onChangeDesktopStyle: (style: 'mac' | 'windows') => void }) {
  const { i18n } = useTranslation();
  const [viewDropdownOpen, setViewDropdownOpen] = useState(false);
  const [vibeCafeDropdownOpen, setVibeCafeDropdownOpen] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-6 bg-white border-b border-black flex items-center px-2 z-50">
      <div className="flex items-center gap-4 text-xs font-chicago text-black relative">
        {/* Apple/Windows Menu */}
        <div className="flex items-center">
          {desktopStyle === 'mac' ? (
            <span className="text-lg leading-none">🍎</span>
          ) : (
            // Classic Windows logo SVG
            <span className="w-5 h-5 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="6" width="12" height="8" fill="#00ADEF" stroke="#000" strokeWidth="1"/>
                <rect x="2" y="16" width="12" height="8" fill="#FFD900" stroke="#000" strokeWidth="1"/>
                <rect x="16" y="6" width="14" height="8" fill="#F1511B" stroke="#000" strokeWidth="1"/>
                <rect x="16" y="16" width="14" height="8" fill="#7CBB00" stroke="#000" strokeWidth="1"/>
              </svg>
            </span>
          )}
        </div>

        {/* VibeCafé Menu with Dropdown */}
        <div className="relative">
          <button
            className="hover:bg-black hover:text-white px-2 py-0.5 text-black"
            onClick={() => setVibeCafeDropdownOpen(v => !v)}
          >
            VibeCafé
          </button>
          {vibeCafeDropdownOpen && (
            <div className="absolute left-0 mt-1 w-40 bg-white border border-black rounded shadow z-50">
              <button
                className="flex items-center w-full px-3 py-1 text-left hover:bg-gray-200"
                onClick={() => {
                  // Dispatch custom event to open new window
                  window.dispatchEvent(new CustomEvent('openNewWindow'));
                  setVibeCafeDropdownOpen(false);
                }}
              >
                New
              </button>
              <button
                className="flex items-center w-full px-3 py-1 text-left hover:bg-gray-200"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setVibeCafeDropdownOpen(false);
                }}
              >
                Copy link
              </button>
              <button
                className="flex items-center w-full px-3 py-1 text-left hover:bg-gray-200"
                onClick={() => {
                  const url = encodeURIComponent(window.location.href);
                  window.open(`https://twitter.com/intent/tweet?url=${url}`, '_blank');
                  setVibeCafeDropdownOpen(false);
                }}
              >
                Share to X
              </button>
            </div>
          )}
        </div>

        {/* View Menu with Dropdown */}
        <div className="relative">
          <button
            className="hover:bg-black hover:text-white px-2 py-0.5 text-black"
            onClick={() => setViewDropdownOpen(v => !v)}
          >
            View
          </button>
          {viewDropdownOpen && (
            <div className="absolute left-0 mt-1 w-32 bg-white border border-black rounded shadow z-50">
              <button
                className={`flex items-center w-full px-3 py-1 text-left hover:bg-gray-200 ${desktopStyle === 'mac' ? 'font-bold' : ''}`}
                onClick={() => { onChangeDesktopStyle('mac'); setViewDropdownOpen(false); }}
              >
                {desktopStyle === 'mac' && <span className="mr-2">✔</span>}
                Mac
              </button>
              <button
                className={`flex items-center w-full px-3 py-1 text-left hover:bg-gray-200 ${desktopStyle === 'windows' ? 'font-bold' : ''}`}
                onClick={() => { onChangeDesktopStyle('windows'); setViewDropdownOpen(false); }}
              >
                {desktopStyle === 'windows' && <span className="mr-2">✔</span>}
                Windows
              </button>
            </div>
          )}
        </div>

        {/* Language Switcher */}
        <button 
          onClick={toggleLanguage}
          className="hover:bg-black hover:text-white px-2 py-0.5 text-black"
        >
          {i18n.language === 'zh' ? 'EN' : '中文'}
        </button>
      </div>

      {/* Time */}
      <div className="ml-auto text-xs font-chicago text-black">
        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
} 