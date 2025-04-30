import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import ThemedWindow from './ThemedWindow';

interface WindowPositionChangeEvent {
  id: string;
  position: { x: number; y: number };
}

declare global {
  interface WindowEventMap {
    'windowPositionChange': CustomEvent<WindowPositionChangeEvent>;
  }
}

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
export const calculateInitialPosition = (
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
  size?: { width: number; height: number };
  className?: string;
  desktopStyle?: 'mac' | 'windows' | 'linux';
}

export function ManagedWindow({ 
  children, 
  title, 
  id, 
  isOpen, 
  onClose, 
  onFocus, 
  zIndex, 
  position, 
  size: initialSize, 
  className = '', 
  desktopStyle = 'mac' // Default to mac
}: WindowManagerProps) {
  const [size, setSize] = useState(() => initialSize || { width: WINDOW_WIDTH, height: WINDOW_HEIGHT });
  const [isResizing, setIsResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const windowRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(position.x);
  const y = useMotionValue(position.y);

  useEffect(() => {
    x.set(position.x);
    y.set(position.y);
  }, [position.x, position.y, x, y]);

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

  const handleDragEnd = () => {
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
      <ThemedWindow 
        title={title} 
        onClose={onClose}
        onStartResize={handleStartResize}
        className={className}
        desktopStyle={desktopStyle}
      >
        {children}
      </ThemedWindow>
    </motion.div>
  );
}

export const useWindowManager = (initialWindows: Window[]) => {
  const [windows, setWindows] = useState<Window[]>(initialWindows);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const windowToClose = prev.find((w) => w.id === id);
      if (!windowToClose) return prev;

      // Store the current position before closing
      const updatedWindows = prev.map((w) => {
        if (w.id === id) {
          return {
            ...w,
            isOpen: false,
            lastPosition: { x: w.position.x, y: w.position.y },
          };
        }
        return w;
      });
      return updatedWindows;
    });
  }, []);

  const toggleWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const windowToToggle = prev.find((w) => w.id === id);
      if (!windowToToggle) return prev;

      return prev.map((w) => {
        if (w.id === id) {
          return {
            ...w,
            isOpen: !w.isOpen,
            // Restore last position when reopening
            ...((!w.isOpen && w.lastPosition) ? {
              position: w.lastPosition
            } : {})
          };
        }
        return w;
      });
    });
  }, []);

  const updateWindowPosition = useCallback((id: string, newX: number, newY: number) => {
    setWindows((prev) => 
      prev.map((w) => 
        w.id === id ? {
          ...w,
          position: { x: newX, y: newY },
          lastPosition: { x: newX, y: newY }
        } : w
      )
    );
  }, []);

  useEffect(() => {
    const handleWindowPositionChange = (event: CustomEvent<{ id: string; position: { x: number; y: number } }>) => {
      const { id, position } = event.detail;
      updateWindowPosition(id, position.x, position.y);
    };

    window.addEventListener('windowPositionChange', handleWindowPositionChange as EventListener);
    return () => {
      window.removeEventListener('windowPositionChange', handleWindowPositionChange as EventListener);
    };
  }, [updateWindowPosition]);

  const getMaxZIndex = () => {
    return Math.max(...windows.map(w => w.zIndex), 0);
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
    emptyTrash,
    updateWindowPosition
  };
} 