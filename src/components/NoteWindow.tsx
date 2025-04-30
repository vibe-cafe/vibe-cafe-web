'use client';

import { useState } from 'react';

export default function NoteWindow({ windowsStyle = false }: { windowsStyle?: boolean }) {
  const [content, setContent] = useState('');

  const handleCopyText = () => {
    navigator.clipboard.writeText(content);
  };

  const handleShareToX = () => {
    const text = `I would love to create ${content} to keep the vibe going, #VibeCafe, ${window.location.href}`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
  };

  return (
    <div className="w-full h-full flex flex-col">
      <textarea
        className={`flex-1 w-full p-4 text-black resize-none focus:outline-none ${
          windowsStyle 
            ? 'bg-[#C0C0C0] font-[\'MS_Sans_Serif\'] text-sm' 
            : 'bg-white font-mono text-sm'
        }`}
        placeholder="What would you like to create today to keep the vibe going?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      
      {content.trim() !== '' && (
        <div className={`flex gap-2 p-2 ${windowsStyle ? 'bg-[#C0C0C0]' : 'bg-white'}`}>
          <button
            onClick={handleCopyText}
            className={
              windowsStyle
                ? 'px-4 py-1 border-2 border-[#808080] bg-[#C0C0C0] active:border-[#404040] text-sm font-[\'MS_Sans_Serif\'] shadow-[1px_1px_0px_0px_#FFFFFF,_-1px_-1px_0px_0px_#808080] cursor-pointer'
                : 'px-3 py-0.5 bg-[#E8E8E8] text-black rounded text-xs font-chicago hover:bg-[#D0D0D0] cursor-pointer'
            }
          >
            Copy text
          </button>
          <button
            onClick={handleShareToX}
            className={
              windowsStyle
                ? 'px-4 py-1 border-2 border-[#808080] bg-[#C0C0C0] active:border-[#404040] text-sm font-[\'MS_Sans_Serif\'] shadow-[1px_1px_0px_0px_#FFFFFF,_-1px_-1px_0px_0px_#808080] cursor-pointer'
                : 'px-3 py-0.5 bg-[#E8E8E8] text-black rounded text-xs font-chicago hover:bg-[#D0D0D0] cursor-pointer'
            }
          >
            Share to X
          </button>
        </div>
      )}
    </div>
  );
} 