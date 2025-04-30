'use client';

import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export default function MenuBar({ desktopStyle, onChangeDesktopStyle }: { 
  desktopStyle: 'mac' | 'windows' | 'linux'; 
  onChangeDesktopStyle: (style: 'mac' | 'windows' | 'linux') => void 
}) {
  const { i18n } = useTranslation();
  const [viewDropdownOpen, setViewDropdownOpen] = useState(false);
  const [vibeCafeDropdownOpen, setVibeCafeDropdownOpen] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
  };

  const getMenuItemStyle = (isActive = false) => {
    let baseStyle = 'flex items-center w-full px-3 py-1 text-left';
    switch (desktopStyle) {
      case 'linux':
        baseStyle += ' text-white hover:bg-[#5A5A5A]';
        if (isActive) baseStyle += ' font-bold';
        break;
      default: // Mac & Windows
        baseStyle += ' text-black hover:bg-gray-200';
        if (isActive) baseStyle += ' font-bold';
        break;
    }
    return baseStyle;
  }

  const menuTextStyle = desktopStyle === 'linux' ? 'text-white' : 'text-black';
  const menuHoverStyle = desktopStyle === 'linux' ? 'hover:bg-[#5A5A5A] rounded' : 'hover:bg-black hover:text-white';
  const dropdownStyle = desktopStyle === 'linux' ? 'bg-[#3A3A3A] border border-[#2A2A2A]' : 'bg-white border border-black';

  return (
    <div className={`fixed top-0 left-0 right-0 h-6 flex items-center px-2 z-50 ${
      desktopStyle === 'linux' 
        ? 'bg-gradient-to-b from-[#4A4A4A] to-[#3A3A3A] border-b border-[#2A2A2A]'
        : 'bg-white border-b border-black'
    }`}>
      <div className={`flex items-center gap-4 text-xs relative ${desktopStyle === 'linux' ? 'font-[Liberation_Sans]' : 'font-chicago'}`}>
        {/* OS Menu Icon */}
        <div className="flex items-center">
          {desktopStyle === 'mac' ? (
            <span className="text-lg leading-none">🍎</span>
          ) : desktopStyle === 'windows' ? (
            <span className="w-5 h-5 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="6" width="12" height="8" fill="#00ADEF" stroke="#000" strokeWidth="1"/>
                <rect x="2" y="16" width="12" height="8" fill="#FFD900" stroke="#000" strokeWidth="1"/>
                <rect x="16" y="6" width="14" height="8" fill="#F1511B" stroke="#000" strokeWidth="1"/>
                <rect x="16" y="16" width="14" height="8" fill="#7CBB00" stroke="#000" strokeWidth="1"/>
              </svg>
            </span>
          ) : (
            <span className="text-lg leading-none">🐧</span>
          )}
        </div>

        {/* VibeCafé Menu with Dropdown */}
        <div className="relative">
          <button
            className={`px-2 py-0.5 ${menuTextStyle} ${menuHoverStyle}`}
            onClick={() => setVibeCafeDropdownOpen(v => !v)}
          >
            VibeCafé
          </button>
          {vibeCafeDropdownOpen && (
            <div className={`absolute left-0 mt-1 w-40 rounded shadow z-50 ${dropdownStyle}`}>
              <button
                className={getMenuItemStyle()}
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('openNewWindow'));
                  setVibeCafeDropdownOpen(false);
                }}
              >
                New
              </button>
              <button
                className={getMenuItemStyle()}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setVibeCafeDropdownOpen(false);
                }}
              >
                Copy link
              </button>
              <button
                className={getMenuItemStyle()}
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
            className={`px-2 py-0.5 ${menuTextStyle} ${menuHoverStyle}`}
            onClick={() => setViewDropdownOpen(v => !v)}
          >
            View
          </button>
          {viewDropdownOpen && (
            <div className={`absolute left-0 mt-1 w-32 rounded shadow z-50 ${dropdownStyle}`}>
              <button
                className={getMenuItemStyle(desktopStyle === 'mac')}
                onClick={() => { onChangeDesktopStyle('mac'); setViewDropdownOpen(false); }}
              >
                {desktopStyle === 'mac' && <span className="mr-2">✔</span>}
                Mac
              </button>
              <button
                className={getMenuItemStyle(desktopStyle === 'windows')}
                onClick={() => { onChangeDesktopStyle('windows'); setViewDropdownOpen(false); }}
              >
                {desktopStyle === 'windows' && <span className="mr-2">✔</span>}
                Windows
              </button>
              <button
                className={getMenuItemStyle(desktopStyle === 'linux')}
                onClick={() => { onChangeDesktopStyle('linux'); setViewDropdownOpen(false); }}
              >
                {desktopStyle === 'linux' && <span className="mr-2">✔</span>}
                Linux
              </button>
            </div>
          )}
        </div>

        {/* Language Switcher */}
        <button 
          onClick={toggleLanguage}
          className={`px-2 py-0.5 ${menuTextStyle} ${menuHoverStyle}`}
        >
          {i18n.language === 'zh' ? 'EN' : '中文'}
        </button>
      </div>

      {/* Time */}
      <div className={`ml-auto text-xs ${menuTextStyle}`}>
        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
} 