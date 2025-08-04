'use client';

import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

export default function MenuBar({ desktopStyle, onChangeDesktopStyle }: { 
  desktopStyle: 'mac' | 'windows' | 'linux' | 'claude'; 
  onChangeDesktopStyle: (style: 'mac' | 'windows' | 'linux' | 'claude') => void 
}) {
  const { i18n } = useTranslation();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
  };

  const handleMenuClick = (menuName: string) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.menu-item')) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const getMenuItemStyle = (isActive = false) => {
    let baseStyle = 'flex items-center w-full px-3 py-1 text-left';
    switch (desktopStyle) {
      case 'linux':
        baseStyle += ' text-white hover:bg-[#5A5A5A]';
        if (isActive) baseStyle += ' font-bold';
        break;
      case 'claude':
        baseStyle += ' text-black hover:bg-[#C05A3F]';
        if (isActive) baseStyle += ' font-bold';
        break;
      default: // Mac & Windows
        baseStyle += ' text-black hover:bg-gray-200';
        if (isActive) baseStyle += ' font-bold';
        break;
    }
    return baseStyle;
  }

  const menuTextStyle = desktopStyle === 'linux' ? 'text-white' : desktopStyle === 'claude' ? 'text-black' : 'text-black';
  const menuHoverStyle = desktopStyle === 'linux' ? 'hover:bg-[#5A5A5A] rounded' : desktopStyle === 'claude' ? 'hover:bg-[#C05A3F] rounded' : 'hover:bg-black hover:text-white';
  const dropdownStyle = desktopStyle === 'linux' ? 'bg-[#3A3A3A] border border-[#2A2A2A]' : desktopStyle === 'claude' ? 'bg-black border border-[#DE7356]' : 'bg-white border border-black';

  const currentStyle = String(desktopStyle);

  function renderCheckmark(current: string, target: string) {
    return current === target ? <span className="mr-2">✔</span> : null;
  }

  if (desktopStyle === 'windows') {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-10 flex items-center px-2 z-50 bg-[#C0C0C0] border-t border-black shadow-lg">
        {/* Start Button */}
        <button className="flex items-center gap-2 px-3 py-1 bg-[#008080] text-white font-bold rounded mr-2 hover:bg-[#00a2e8]">
          <span className="w-5 h-5 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="6" width="12" height="8" fill="#00ADEF" stroke="#000" strokeWidth="1"/>
              <rect x="2" y="16" width="12" height="8" fill="#FFD900" stroke="#000" strokeWidth="1"/>
              <rect x="16" y="6" width="14" height="8" fill="#F1511B" stroke="#000" strokeWidth="1"/>
              <rect x="16" y="16" width="14" height="8" fill="#7CBB00" stroke="#000" strokeWidth="1"/>
            </svg>
          </span>
          Start
        </button>
        {/* Menus */}
        <div className="flex items-center gap-4 text-xs font-[MS_Sans_Serif]">
          {/* VibeCafé Menu with Dropdown */}
          <div className="relative menu-item">
            <button
              className={`px-2 py-0.5 text-black hover:bg-gray-200`}
              onClick={(e) => {
                e.stopPropagation();
                handleMenuClick('vibeCafe');
              }}
            >
              VibeCafé
            </button>
            {activeMenu === 'vibeCafe' && (
              <div className={`absolute left-0 bottom-8 w-40 rounded shadow z-50 bg-white border border-black`}>
                <button
                  className={getMenuItemStyle()}
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('openNewWindow'));
                    setActiveMenu(null);
                  }}
                >
                  New
                </button>
                <button
                  className={getMenuItemStyle()}
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setActiveMenu(null);
                  }}
                >
                  Copy link
                </button>
                <button
                  className={getMenuItemStyle()}
                  onClick={() => {
                    const url = encodeURIComponent(window.location.href);
                    window.open(`https://twitter.com/intent/tweet?url=${url}`, '_blank');
                    setActiveMenu(null);
                  }}
                >
                  Share to X
                </button>
              </div>
            )}
          </div>
          {/* View Menu with Dropdown */}
          <div className="relative menu-item">
            <button
              className={`px-2 py-0.5 text-black hover:bg-gray-200`}
              onClick={(e) => {
                e.stopPropagation();
                handleMenuClick('view');
              }}
            >
              View
            </button>
            {activeMenu === 'view' && (
              <div className={`absolute left-0 bottom-8 w-32 rounded shadow z-50 bg-white border border-black`}>
                <button
                  className={getMenuItemStyle()}
                  onClick={() => { onChangeDesktopStyle('mac'); setActiveMenu(null); }}
                >
                  {renderCheckmark(currentStyle, 'mac')}
                  Mac
                </button>
                <button
                  className={getMenuItemStyle()}
                  onClick={() => { onChangeDesktopStyle('windows'); setActiveMenu(null); }}
                >
                  {renderCheckmark(currentStyle, 'windows')}
                  Windows
                </button>
                <button
                  className={getMenuItemStyle()}
                  onClick={() => { onChangeDesktopStyle('linux'); setActiveMenu(null); }}
                >
                  {renderCheckmark(currentStyle, 'linux')}
                  Linux
                </button>
                <button
                  className={getMenuItemStyle()}
                  onClick={() => { onChangeDesktopStyle('claude'); setActiveMenu(null); }}
                >
                  {renderCheckmark(currentStyle, 'claude')}
                  Claude Code
                </button>
              </div>
            )}
          </div>
          {/* Language Switcher */}
          <button 
            onClick={toggleLanguage}
            className={`px-2 py-0.5 text-black hover:bg-gray-200`}
          >
            {i18n.language === 'zh' ? 'EN' : '中文'}
          </button>
        </div>
        {/* Time */}
        <div className="ml-auto text-xs text-black font-[MS_Sans_Serif]">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    );
  }

  // Mac & Linux: keep top bar
  return (
    <div className={`fixed top-0 left-0 right-0 h-6 flex items-center px-2 z-50 ${
      desktopStyle === 'linux' 
        ? 'bg-gradient-to-b from-[#4A4A4A] to-[#3A3A3A] border-b border-[#2A2A2A]'
        : desktopStyle === 'claude'
        ? 'bg-[#DE7356] border-b border-[#DE7356]'
        : 'bg-white border-b border-black'
    }`}>
      <div className={`flex items-center gap-4 text-xs relative ${
        desktopStyle === 'linux' ? 'font-[Liberation_Sans]' : 
        desktopStyle === 'claude' ? 'font-mono' : 
        'font-chicago'
      }`}>
        {/* OS Menu Icon */}
        <div className="flex items-center">
          {desktopStyle === 'mac' ? (
            <span className="text-lg leading-none">🍎</span>
          ) : desktopStyle === 'claude' ? (
            <span className="text-lg leading-none">🤖</span>
          ) : (
            <span className="text-lg leading-none">🐧</span>
          )}
        </div>

        {/* VibeCafé Menu with Dropdown */}
        <div className="relative menu-item">
          <button
            className={`px-2 py-0.5 ${menuTextStyle} ${menuHoverStyle}`}
            onClick={(e) => {
              e.stopPropagation();
              handleMenuClick('vibeCafe');
            }}
          >
            VibeCafé
          </button>
          {activeMenu === 'vibeCafe' && (
            <div className={`absolute left-0 mt-1 w-40 rounded shadow z-50 ${dropdownStyle}`}>
              <button
                className={getMenuItemStyle()}
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('openNewWindow'));
                  setActiveMenu(null);
                }}
              >
                New
              </button>
              <button
                className={getMenuItemStyle()}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setActiveMenu(null);
                }}
              >
                Copy link
              </button>
              <button
                className={getMenuItemStyle()}
                onClick={() => {
                  const url = encodeURIComponent(window.location.href);
                  window.open(`https://twitter.com/intent/tweet?url=${url}`, '_blank');
                  setActiveMenu(null);
                }}
              >
                Share to X
              </button>
            </div>
          )}
        </div>

        {/* View Menu with Dropdown */}
        <div className="relative menu-item">
          <button
            className={`px-2 py-0.5 ${menuTextStyle} ${menuHoverStyle}`}
            onClick={(e) => {
              e.stopPropagation();
              handleMenuClick('view');
            }}
          >
            View
          </button>
          {activeMenu === 'view' && (
            <div className={`absolute left-0 mt-1 w-32 rounded shadow z-50 ${dropdownStyle}`}>
              <button
                className={getMenuItemStyle()}
                onClick={() => { onChangeDesktopStyle('mac'); setActiveMenu(null); }}
              >
                {renderCheckmark(currentStyle, 'mac')}
                Mac
              </button>
              <button
                className={getMenuItemStyle()}
                onClick={() => { onChangeDesktopStyle('windows'); setActiveMenu(null); }}
              >
                {renderCheckmark(currentStyle, 'windows')}
                Windows
              </button>
              <button
                className={getMenuItemStyle()}
                onClick={() => { onChangeDesktopStyle('linux'); setActiveMenu(null); }}
              >
                {renderCheckmark(currentStyle, 'linux')}
                Linux
              </button>
              <button
                className={getMenuItemStyle()}
                onClick={() => { onChangeDesktopStyle('claude'); setActiveMenu(null); }}
              >
                {renderCheckmark(currentStyle, 'claude')}
                Claude Code
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