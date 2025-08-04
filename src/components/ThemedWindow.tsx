'use client';

import { useState, useEffect } from 'react';

interface ThemedWindowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
  onStartResize?: () => void;
  isMobile?: boolean;
  desktopStyle?: 'mac' | 'windows' | 'linux' | 'claude';
}

export default function ThemedWindow({ 
  title, 
  children, 
  className = '', 
  onClose, 
  onStartResize, 
  isMobile = false, 
  desktopStyle = 'mac' 
}: ThemedWindowProps) {
  const [isCloseHovered, setIsCloseHovered] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  // --- Mobile --- (Simplified for brevity, keeps Mac/Windows logic)
  if (isMobile) {
    if (desktopStyle === 'windows') {
      return (
        <div className={`bg-[#C0C0C0] border-[2.5px] border-[#000] rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full flex flex-col font-[MS_Sans_Serif] ${className}`}>
          {/* Windows Title Bar */}
          <div className="h-7 bg-[#000080] border-b-2 border-[#fff] flex items-center px-2 select-none">
            <div className="flex-1 text-left text-white text-xs font-bold tracking-wide">
              {title}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onClose?.(); }}
              className="ml-2 w-5 h-5 bg-[#C0C0C0] border-2 border-[#000] flex items-center justify-center text-[#000] text-lg font-bold leading-none hover:bg-[#ff0000] hover:text-white"
            >
              ×
            </button>
          </div>
          {/* Window Content */}
          <div className="flex-1 p-4 overflow-auto relative">
            {children}
          </div>
        </div>
      );
    }
    if (desktopStyle === 'claude') {
      return (
        <div className={`bg-black border border-gray-400 rounded-none shadow-none w-full flex flex-col font-mono ${className}`}>
          {/* Claude Title Bar */}
          <div className="h-7 bg-black flex items-center px-2 select-none">
            <div className="flex-1 text-left text-white text-sm font-bold">
              {title}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onClose?.(); }}
              className="ml-2 px-2 py-1 bg-black text-white text-xs rounded-none hover:bg-white hover:text-black"
            >
              close
            </button>
          </div>
          {/* Window Content */}
          <div className="flex-1 p-4 overflow-auto relative">
            {children}
          </div>
        </div>
      );
    }
    // Default to Mac style for mobile Linux/Mac
    return (
      <div className={`bg-white border border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full flex flex-col ${className}`}>
        {/* Mac Title Bar */}
        <div className="h-6 bg-[#000000] border-b border-black flex items-center px-2 rounded-t-lg select-none">
          <div className="flex-1 text-center text-white text-xs font-chicago">
            {title}
          </div>
        </div>
        {/* Window Content */}
        <div className="flex-1 p-4 overflow-auto relative">
          {children}
        </div>
      </div>
    );
  }

  // --- Desktop --- 
  let baseClasses = 'w-full h-full flex flex-col';
  let titleBarClasses = 'h-7 flex items-center px-2 select-none cursor-move';
  let contentClasses = 'flex-1 overflow-auto relative';
  let closeButtonClasses = 'ml-2 flex items-center justify-center leading-none';
  let titleTextClasses = 'flex-1 text-left font-bold tracking-wide';
  let resizeHandle = null;
  
  if (onStartResize) {
    resizeHandle = (
      <div 
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={(e) => {
          e.stopPropagation();
          onStartResize();
        }}
      >
        {/* Simple resize indicator for all themes */} 
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-50">
          <path d="M8 8H15V15H8V8Z" fill={desktopStyle === 'linux' ? 'white' : 'black'} fillOpacity="0.2" />
          <path d="M11 11H15V15H11V11Z" fill={desktopStyle === 'linux' ? 'white' : 'black'} fillOpacity="0.3" />
          <path d="M14 14H15V15H14V14Z" fill={desktopStyle === 'linux' ? 'white' : 'black'} fillOpacity="0.4" />
        </svg>
      </div>
    );
  }

  switch (desktopStyle) {
    case 'windows':
      baseClasses += ' bg-[#C0C0C0] border-[2.5px] border-[#000] rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-[MS_Sans_Serif]';
      titleBarClasses += ' bg-[#000080] border-b-2 border-[#fff]';
      titleTextClasses += ' text-white text-xs';
      closeButtonClasses += ' w-5 h-5 bg-[#C0C0C0] border-2 border-[#000] text-[#000] text-lg hover:bg-[#ff0000] hover:text-white';
      contentClasses += ' p-4';
      break;
    case 'linux':
      baseClasses += ' bg-[#DFDFDF] border border-[#6A6A6A] rounded shadow-md font-[Liberation_Sans]';
      titleBarClasses += ' bg-gradient-to-b from-[#7A7A7A] to-[#6A6A6A] border-b border-[#5A5A5A] rounded-t';
      titleTextClasses += ' text-white text-sm';
      closeButtonClasses += ' w-5 h-5 bg-gradient-to-b from-[#E07070] to-[#C05050] border border-[#A04040] text-white text-xs rounded hover:from-[#F08080] hover:to-[#D06060]';
      contentClasses += ' p-3';
      break;
    case 'claude':
      baseClasses += ' bg-black border border-gray-400 rounded-none shadow-none font-mono';
      titleBarClasses += ' bg-black';
      titleTextClasses += ' text-white text-sm font-bold';
      closeButtonClasses += ' px-2 py-1 bg-black text-white text-xs rounded-none hover:bg-white hover:text-black';
      contentClasses += ' p-4';
      break;
    default: // Mac
      baseClasses += ' bg-white border border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]';
      titleBarClasses = 'h-6 bg-[#000000] border-b border-black flex items-center px-2 rounded-t-lg cursor-move select-none'; // Override for Mac specific layout
      contentClasses += ' p-4';
      break;
  }

  return (
    <div className={`${baseClasses} ${className}`}>
      {/* Title Bar */} 
      {desktopStyle === 'mac' ? (
        // Mac Specific Title Bar Layout
        <div className={titleBarClasses}>
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => { e.stopPropagation(); onClose?.(); }}
              onMouseEnter={() => setIsCloseHovered(true)}
              onMouseLeave={() => setIsCloseHovered(false)}
              className={`w-3 h-3 rounded-full transition-colors relative ${isCloseHovered ? 'bg-[#ff1f1f]' : 'bg-[#ff5f57]'} border border-[#330000]`}
            >
              {isCloseHovered && (
                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-[#330000]">
                  ×
                </span>
              )}
            </button>
            <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#663c00]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840] border border-[#0d4013]" />
          </div>
          <div className="flex-1 text-center text-white text-xs font-chicago -ml-12">
            {title}
          </div>
        </div>
      ) : (
        // Windows & Linux Title Bar Layout
        <div className={titleBarClasses}>
          <div className={titleTextClasses}>{title}</div>
          <button
            onClick={(e) => { e.stopPropagation(); onClose?.(); }}
            className={closeButtonClasses}
          >
            {desktopStyle === 'claude' ? 'close' : '×'}
          </button>
        </div>
      )}

      {/* Window Content */} 
      <div className={contentClasses}>
        {children}
      </div>

      {/* Resize Handle */} 
      {resizeHandle}
    </div>
  );
} 