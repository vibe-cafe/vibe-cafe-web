'use client';

import { useState } from 'react';

export default function NoteWindow({ windowsStyle = false }: { windowsStyle?: boolean }) {
  const [content, setContent] = useState('');

  return (
    <div className="w-full h-full">
      <textarea
        className={`w-full h-full p-4 text-black resize-none focus:outline-none ${
          windowsStyle 
            ? 'bg-[#C0C0C0] font-[\'MS_Sans_Serif\'] text-sm' 
            : 'bg-white font-mono text-sm'
        }`}
        placeholder="What would you like to create today to keep the vibe going?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </div>
  );
} 