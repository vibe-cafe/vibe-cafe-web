'use client';

import { useState } from 'react';

type NoteWindowProps = {
  desktopStyle?: 'mac' | 'windows' | 'linux' | 'claude';
};

export default function NoteWindow({ desktopStyle = 'mac' }: NoteWindowProps) {
  const [content, setContent] = useState('');

  const getTextareaStyle = () => {
    switch (desktopStyle) {
      case 'windows':
        return 'bg-[#C0C0C0] font-[\'MS_Sans_Serif\'] text-sm';
      case 'linux':
        return 'bg-[#FFFFFF] font-[\'Liberation_Sans\'] text-sm';
      case 'claude':
        return 'bg-black text-white font-mono text-sm';
      default:
        return 'bg-white font-mono text-sm';
    }
  };

  const getButtonContainerStyle = () => {
    switch (desktopStyle) {
      case 'windows':
        return 'bg-[#C0C0C0]';
      case 'linux':
        return 'bg-[#DFDFDF] border-t border-[#B5B5B5]';
      case 'claude':
        return 'bg-black border-t border-gray-400';
      default:
        return 'bg-white';
    }
  };

  const getButtonStyle = () => {
    switch (desktopStyle) {
      case 'windows':
        return 'px-4 py-1 border-2 border-[#808080] bg-[#C0C0C0] active:border-[#404040] text-sm font-[\'MS_Sans_Serif\'] shadow-[1px_1px_0px_0px_#FFFFFF,_-1px_-1px_0px_0px_#808080] cursor-pointer';
      case 'linux':
        return 'px-3 py-1 bg-gradient-to-b from-[#F0F0F0] to-[#E3E3E3] border border-[#B5B5B5] rounded text-sm font-[\'Liberation_Sans\'] hover:from-[#E3E3E3] hover:to-[#D6D6D6] active:from-[#D6D6D6] active:to-[#D6D6D6] cursor-pointer';
      case 'claude':
        return 'px-3 py-1 bg-black text-white border border-gray-400 rounded-none text-sm font-mono hover:bg-white hover:text-black cursor-pointer';
      default:
        return 'px-3 py-0.5 bg-[#E8E8E8] text-black rounded text-xs font-chicago hover:bg-[#D0D0D0] cursor-pointer';
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <textarea
        className={`flex-1 w-full p-4 text-black resize-none focus:outline-none ${getTextareaStyle()}`}
        placeholder="What would you like to create today to keep the vibe going?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      
      {content.trim() !== '' && (
        <div className={`flex gap-2 p-2 ${getButtonContainerStyle()}`}>
          <button
            onClick={() => navigator.clipboard.writeText(content)}
            className={getButtonStyle()}
          >
            Copy text
          </button>
          <button
            onClick={() => {
              const text = `I would love to create ${content} to keep the vibe going, #VibeCafe, ${window.location.href}`;
              const encodedText = encodeURIComponent(text);
              window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
            }}
            className={getButtonStyle()}
          >
            Share to X
          </button>
        </div>
      )}
    </div>
  );
} 