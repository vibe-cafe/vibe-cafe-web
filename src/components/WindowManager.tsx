import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import MacWindow from './MacWindow';

interface Window {
  id: string;
  title: string;
  isOpen: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size?: { width: number; height: number };
  lastPosition?: { x: number; y: number };
  isDeleted?: boolean;
}

// Default window dimensions and spacing
const WINDOW_WIDTH = 400;
const WINDOW_HEIGHT = 240;
const MARGIN = 20;
const DEFAULT_VIEWPORT = { width: 1200, height: 800 };

// Animation delays
const CLOSE_WINDOW_DELAY = 200;
const DELETE_ICON_DELAY = 100;

// Calculate initial window positions in a grid layout
const calculateInitialPosition = (
  index: number, 
  totalWindows: number,
  viewport = DEFAULT_VIEWPORT
) => {
  const { width: viewportWidth, height: viewportHeight } = viewport;
  
  // Calculate maximum windows that can fit in a row
  const availableWidth = viewportWidth - MARGIN * 2;
  const maxWindowsPerRow = Math.floor(availableWidth / (WINDOW_WIDTH + MARGIN));
  const windowsPerRow = Math.max(1, maxWindowsPerRow);
  
  // Calculate row and column
  const row = Math.floor(index / windowsPerRow);
  const col = index % windowsPerRow;
  
  // Calculate the total width of windows in this row
  const totalWindowsInThisRow = Math.min(windowsPerRow, totalWindows - (row * windowsPerRow));
  const rowWidth = totalWindowsInThisRow * WINDOW_WIDTH + (totalWindowsInThisRow - 1) * MARGIN;
  
  // Center the row horizontally
  const startX = (viewportWidth - rowWidth) / 2;
  
  // Calculate final position
  const x = startX + col * (WINDOW_WIDTH + MARGIN);
  const y = MARGIN + row * (WINDOW_HEIGHT + MARGIN);
  
  return {
    x: Math.min(x, viewportWidth - WINDOW_WIDTH - MARGIN),
    y: Math.min(y, viewportHeight - WINDOW_HEIGHT - MARGIN)
  };
};

interface WindowManagerProps {
  children: React.ReactNode;
  title: string;
  id: string;
  isOpen: boolean;
  onClose: () => void;
  onFocus: () => void;
  zIndex: number;
  position: { x: number; y: number };
  isDeleted?: boolean;
}

export function ManagedWindow({ children, title, id, isOpen, onClose, onFocus, zIndex, position, isDeleted }: WindowManagerProps) {
  const [size, setSize] = useState({ width: WINDOW_WIDTH, height: WINDOW_HEIGHT });
  const [isResizing, setIsResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const windowRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(position.x);
  const y = useMotionValue(position.y);

  useEffect(() => {
    x.set(position.x);
    y.set(position.y);
  }, [position.x, position.y]);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!windowRef.current) return;

      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;

      setSize({
        width: Math.max(300, startSize.width + dx),
        height: Math.max(200, startSize.height + dy)
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, startPos, startSize]);

  const handleStartResize = () => {
    if (!windowRef.current) return;

    const rect = windowRef.current.getBoundingClientRect();
    setStartPos({ x: rect.right, y: rect.bottom });
    setStartSize({ width: rect.width, height: rect.height });
    setIsResizing(true);
  };

  const handleDragEnd = (event: any, info: any) => {
    const newPosition = { x: x.get(), y: y.get() };
    if (typeof window !== 'undefined') {
      const windowEvent = new CustomEvent('windowPositionChange', {
        detail: { id, position: newPosition }
      });
      window.dispatchEvent(windowEvent);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      ref={windowRef}
      drag={!isResizing}
      dragMomentum={false}
      style={{ 
        x,
        y,
        zIndex,
        width: size.width,
        height: size.height,
        position: 'absolute',
      }}
      onMouseDown={() => !isResizing && onFocus()}
      onDragEnd={handleDragEnd}
      className="touch-none"
    >
      <MacWindow 
        title={title} 
        onClose={onClose}
        onStartResize={handleStartResize}
      >
        {children}
      </MacWindow>
    </motion.div>
  );
}

export function useWindowManager(initialWindows: Window[]) {
  const [windows, setWindows] = useState(() => {
    return initialWindows.map((w, index) => {
      const initialPos = calculateInitialPosition(index, initialWindows.length);
      return {
        ...w,
        position: w.lastPosition || initialPos,
        lastPosition: w.lastPosition || initialPos,
        isDeleted: false
      };
    });
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    setWindows(prev => prev.map((w, index) => {
      if (w.lastPosition) return w;
      const newPos = calculateInitialPosition(index, prev.length, viewport);
      return {
        ...w,
        position: newPos,
        lastPosition: newPos
      };
    }));
  }, []);

  useEffect(() => {
    const handlePositionChange = (event: any) => {
      const { id, position } = event.detail;
      setWindows(prev => prev.map(w => 
        w.id === id ? { 
          ...w, 
          position,
          lastPosition: position 
        } : w
      ));
    };

    window.addEventListener('windowPositionChange', handlePositionChange);
    return () => window.removeEventListener('windowPositionChange', handlePositionChange);
  }, []);

  const getMaxZIndex = () => {
    return Math.max(...windows.map(w => w.zIndex), 0);
  };

  const toggleWindow = (id: string) => {
    setWindows(prev => prev.map(w => {
      if (w.id === id) {
        const newPosition = !w.isOpen ? (w.lastPosition || w.position) : w.position;
        return {
          ...w,
          isOpen: !w.isOpen,
          zIndex: !w.isOpen ? getMaxZIndex() + 1 : w.zIndex,
          position: newPosition,
          lastPosition: newPosition
        };
      }
      return w;
    }));
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isOpen: false } : w
    ));
  };

  const focusWindow = (id: string) => {
    setWindows(prev => prev.map(w => {
      if (w.id === id) {
        return { ...w, zIndex: getMaxZIndex() + 1 };
      }
      return w;
    }));
  };

  const emptyTrash = async () => {
    // First close all windows sequentially
    for (let i = 0; i < windows.length; i++) {
      setWindows(prev => prev.map(w => 
        w.id === windows[i].id ? { ...w, isOpen: false } : w
      ));
      await new Promise(resolve => setTimeout(resolve, CLOSE_WINDOW_DELAY));
    }

    // Then delete icons one by one
    for (let i = 0; i < windows.length; i++) {
      setWindows(prev => prev.map(w => 
        w.id === windows[i].id ? { ...w, isDeleted: true } : w
      ));
      await new Promise(resolve => setTimeout(resolve, DELETE_ICON_DELAY));
    }
  };

  return {
    windows,
    toggleWindow,
    closeWindow,
    focusWindow,
    emptyTrash
  };
} 