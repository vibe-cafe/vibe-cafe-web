'use client';

import { useState, useEffect } from 'react';

interface MacWindowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
  onStartResize?: () => void;
  isMobile?: boolean;
  windowsStyle?: boolean;
}

export default function MacWindow({ title, children, className = '', onClose, onStartResize, isMobile = false, windowsStyle = false }: MacWindowProps) {
  const [isCloseHovered, setIsCloseHovered] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  if (isMobile) {
    if (windowsStyle) {
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
    return (
      <div className={`bg-white border border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full flex flex-col ${className}`}>
        {/* Window Title Bar */}
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

  if (windowsStyle) {
    return (
      <div className={`bg-[#C0C0C0] border-[2.5px] border-[#000] rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full h-full flex flex-col font-[MS_Sans_Serif] ${className}`}>
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
        {/* Resize Handle */}
        {onStartResize && (
          <div 
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
            onMouseDown={(e) => {
              e.stopPropagation();
              onStartResize();
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="opacity-50"
            >
              <path d="M8 8H15V15H8V8Z" fill="black" fillOpacity="0.2" />
              <path d="M11 11H15V15H11V11Z" fill="black" fillOpacity="0.3" />
              <path d="M14 14H15V15H14V14Z" fill="black" fillOpacity="0.4" />
            </svg>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white border border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full h-full flex flex-col ${className}`}>
      {/* Window Title Bar */}
      <div 
        className="h-6 bg-[#000000] border-b border-black flex items-center px-2 rounded-t-lg cursor-move select-none"
      >
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
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
      {/* Window Content */}
      <div className="flex-1 p-4 overflow-auto relative">
        {children}
      </div>
      {/* Resize Handle */}
      {onStartResize && (
        <div 
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={(e) => {
            e.stopPropagation();
            onStartResize();
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-50"
          >
            <path d="M8 8H15V15H8V8Z" fill="black" fillOpacity="0.2" />
            <path d="M11 11H15V15H11V11Z" fill="black" fillOpacity="0.3" />
            <path d="M14 14H15V15H14V14Z" fill="black" fillOpacity="0.4" />
          </svg>
        </div>
      )}
    </div>
  );
} 