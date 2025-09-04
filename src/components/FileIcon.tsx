'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface FileIconProps {
  name: string;
  type: 'txt' | 'app';
  icon?: string;
  onClick: () => void;
  isOpen: boolean;
  desktopStyle?: 'mac' | 'windows' | 'linux' | 'claude';
}

export default function FileIcon({ 
  name, 
  type, 
  icon, 
  onClick, 
  isOpen, 
  desktopStyle = 'mac' 
}: FileIconProps) {

  const getIconBoxStyle = () => {
    switch (desktopStyle) {
      case 'windows':
        return 'w-16 h-16 bg-[#C0C0C0] border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#808080] border-b-[#808080] flex items-center justify-center group-hover:shadow-[1px_1px_0px_0px_#FFFFFF,_-1px_-1px_0px_0px_#808080]';
      case 'linux':
        return 'w-16 h-16 bg-[#EFEFEF] border border-[#B5B5B5] rounded flex items-center justify-center group-hover:border-[#6A6A6A]';
      case 'claude':
        return 'w-16 h-16 bg-black border border-gray-400 rounded-none flex items-center justify-center group-hover:border-gray-300';
      default: // mac
        return 'w-16 h-16 bg-white border border-black rounded flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow';
    }
  };

  const getLabelStyle = () => {
    let baseStyle = 'text-xs text-center px-1 py-0.5 rounded';
    if (isOpen) {
      switch (desktopStyle) {
        case 'windows':
          baseStyle += ' bg-[#000080] text-white';
          break;
        case 'linux':
          baseStyle += ' bg-[#3A7AC3] text-white'; // Example Linux selection color
          break;
        case 'claude':
          baseStyle += ' bg-white text-black';
          break;
        default: // mac
          baseStyle += ' bg-black text-white';
          break;
      }
    } else {
      baseStyle += desktopStyle === 'linux' ? ' text-black' : desktopStyle === 'claude' ? ' text-white' : ' text-black'; // Default text color if needed
    }

    switch (desktopStyle) {
      case 'windows':
        baseStyle += ' font-[\'MS Sans Serif\', \'Segoe UI\', sans-serif]';
        break;
      case 'linux':
        baseStyle += ' font-[\'Liberation Sans\', \'DejaVu Sans\', sans-serif]';
        break;
      case 'claude':
        baseStyle += ' font-mono';
        break;
      default: // mac
        baseStyle += ' font-chicago';
        break;
    }
    return baseStyle;
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex flex-col items-center gap-2 group cursor-pointer"
    >
      {desktopStyle === 'claude' ? (
        // Claude theme: only text, no icons
        <span className={getLabelStyle()}>
          {name}
        </span>
      ) : (
        // Other themes: icons + text
        <>
          <div className={getIconBoxStyle()}>
            {type === 'txt' ? (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4C4 3.44772 4.44772 3 5 3H19C19.5523 3 20 3.44772 20 4V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V4Z" stroke="black" strokeWidth="2"/>
                <path d="M8 7H16M8 12H16M8 17H13" stroke="black" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : icon ? (
              icon.startsWith('/') ? (
                <div className="w-8 h-8 relative">
                  <Image src={icon} alt={name + ' icon'} fill className="object-contain" />
                </div>
              ) : (
                <span className="text-2xl">{icon}</span>
              )
            ) : (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4" width="16" height="16" rx="2" stroke="black" strokeWidth="2"/>
                <path d="M8 8H16M8 12H16M8 16H12" stroke="black" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </div>
          <span className={getLabelStyle()}>
            {name}
          </span>
        </>
      )}
    </motion.button>
  );
} 