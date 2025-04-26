'use client';

import { motion } from 'framer-motion';

interface MacWindowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function MacWindow({ title, children, className = '' }: MacWindowProps) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`bg-white border border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${className}`}
    >
      {/* Window Title Bar */}
      <div className="h-6 bg-[#000000] border-b border-black flex items-center px-2 rounded-t-lg">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-white border border-black" />
          <div className="w-2.5 h-2.5 rounded-full bg-white border border-black" />
          <div className="w-2.5 h-2.5 rounded-full bg-white border border-black" />
        </div>
        <div className="flex-1 text-center text-white text-xs font-chicago -ml-12">
          {title}
        </div>
      </div>
      
      {/* Window Content */}
      <div className="p-4">
        {children}
      </div>
    </motion.div>
  );
} 