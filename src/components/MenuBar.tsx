'use client';

import { useTranslation } from 'react-i18next';

export default function MenuBar() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-6 bg-white border-b border-black flex items-center px-2 z-50">
      <div className="flex items-center gap-4 text-xs font-chicago text-black">
        {/* Apple Menu */}
        <div className="flex items-center">
          <span className="text-lg leading-none">🍎</span>
        </div>

        {/* File Menu */}
        <button className="hover:bg-black hover:text-white px-2 py-0.5 text-black">
          File
        </button>

        {/* Edit Menu */}
        <button className="hover:bg-black hover:text-white px-2 py-0.5 text-black">
          Edit
        </button>

        {/* View Menu */}
        <button className="hover:bg-black hover:text-white px-2 py-0.5 text-black">
          View
        </button>

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