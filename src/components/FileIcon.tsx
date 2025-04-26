import { motion } from 'framer-motion';

interface FileIconProps {
  name: string;
  type: 'txt' | 'app';
  icon?: string;
  onClick: () => void;
  isOpen: boolean;
}

export default function FileIcon({ name, type, icon, onClick, isOpen }: FileIconProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex flex-col items-center gap-2 group cursor-pointer"
    >
      <div className="w-16 h-16 bg-white border border-black rounded flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow">
        {type === 'txt' ? (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4C4 3.44772 4.44772 3 5 3H19C19.5523 3 20 3.44772 20 4V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V4Z" stroke="black" strokeWidth="2"/>
            <path d="M8 7H16M8 12H16M8 17H13" stroke="black" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : icon ? (
          <span className="text-2xl">{icon}</span>
        ) : (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="black" strokeWidth="2"/>
            <path d="M8 8H16M8 12H16M8 16H12" stroke="black" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
      </div>
      <span className={`text-xs text-center px-1 py-0.5 rounded ${isOpen ? 'bg-black text-white' : ''}`}>
        {name}
      </span>
    </motion.button>
  );
} 