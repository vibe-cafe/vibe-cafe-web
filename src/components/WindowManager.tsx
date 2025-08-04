import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import ThemedWindow from './ThemedWindow';
import { useWindowSize } from '../hooks/useWindowSize';

interface WindowPositionChangeEvent {
  id: string;
  position: { x: number; y: number };
}

declare global {
  interface WindowEventMap {
    'windowPositionChange': CustomEvent<WindowPositionChangeEvent>;
  }
}

export interface Window {
  id: string;
  title: string;
  isOpen: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size?: { width: number; height: number };
  lastPosition?: { x: number; y: number };
}

// Default window dimensions and spacing
const WINDOW_WIDTH = 400;
const WINDOW_HEIGHT = 240;
const MARGIN = 80;
const OFFSET = 80;

// Animation delays
const CLOSE_WINDOW_DELAY = 200;
const DELETE_ICON_DELAY = 100;

// Calculate initial window positions in a grid layout without overlap
export const calculateInitialPosition = (
  index: number,
  totalWindows: number,
  viewport = typeof window !== 'undefined'
    ? { width: window.innerWidth, height: window.innerHeight }
    : { width: 1024, height: 768 } // Default fallback for SSR
) => {
  const { width: viewportWidth, height: viewportHeight } = viewport;

  // Calculate grid dimensions
  const cols = Math.floor((viewportWidth - MARGIN * 2) / (WINDOW_WIDTH + OFFSET));
  
  // Fallback to at least 1 column if viewport is too small
  const gridCols = Math.max(1, cols);

  // Calculate grid position
  const col = index % gridCols;
  const row = Math.floor(index / gridCols);

  // Calculate position with no overlap
  let x = MARGIN + col * (WINDOW_WIDTH + OFFSET);
  let y = MARGIN + row * (WINDOW_HEIGHT + OFFSET);

  // Ensure windows don't go off-screen
  if (x + WINDOW_WIDTH > viewportWidth) x = MARGIN;
  if (y + WINDOW_HEIGHT > viewportHeight) y = MARGIN;

  return { x, y };
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

  size?: { width: number; height: number };
  className?: string;
  desktopStyle?: 'mac' | 'windows' | 'linux' | 'claude';
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
  const { width: viewportWidth, height: viewportHeight } = useWindowSize();

  const getMaxZIndex = useCallback(() => {
    return Math.max(...windows.map(w => w.zIndex), 0);
  }, [windows]);

  // Find a position for a new window that doesn't overlap with existing windows
  const findNonOverlappingPosition = (
    existingWindows: Window[],
    viewport: { width: number; height: number }
  ) => {
    // Start with default position
    let x = MARGIN;
    let y = MARGIN;
    const windowWidth = WINDOW_WIDTH;
    const windowHeight = WINDOW_HEIGHT;
    
    // If there are existing windows, position below the lowest one
    if (existingWindows.length > 0) {
      // Find the window with the highest Y position (lowest on screen)
      const lowestWindow = existingWindows.reduce((lowest, win) => {
        return win.position.y > lowest.position.y ? win : lowest;
      });
      
      // Position the new window below the lowest window
      x = lowestWindow.position.x;
      y = lowestWindow.position.y + (lowestWindow.size?.height || WINDOW_HEIGHT) + OFFSET;
      
      // If this would put the window below the viewport, start a new column
      if (y + windowHeight > viewport.height - MARGIN) {
        // Find the rightmost window
        const rightmostWindow = existingWindows.reduce((rightmost, win) => {
          return win.position.x > rightmost.position.x ? win : rightmost;
        });
        
        // Position the new window to the right of the rightmost window
        x = rightmostWindow.position.x + (rightmostWindow.size?.width || WINDOW_WIDTH) + OFFSET;
        y = MARGIN;
        
        // If this would put the window outside the viewport, start at the beginning
        if (x + windowWidth > viewport.width - MARGIN) {
          x = MARGIN;
          y = MARGIN;
        }
      }
    }
    
    return { x, y };
  };

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

      const isOpening = !windowToToggle.isOpen;

      return prev.map((w) => {
        if (w.id === id) {
          let newPosition;
          if (isOpening) {
            // For new windows, find a position that doesn't overlap with existing windows
            const existingOpenWindows = prev.filter(win => win.isOpen && win.id !== id);
            newPosition = findNonOverlappingPosition(
              existingOpenWindows, 
              { width: viewportWidth, height: viewportHeight }
            );
          } else {
            // For closing windows, keep last position
            newPosition = w.lastPosition || w.position;
          }

          return {
            ...w,
            isOpen: !w.isOpen,
            position: newPosition,
            zIndex: isOpening ? getMaxZIndex() + 1 : w.zIndex,
          };
        }
        return w;
      });
    });
  }, [viewportWidth, viewportHeight, getMaxZIndex]);

  const focusWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => {
      if (w.id === id) {
        return { ...w, zIndex: getMaxZIndex() + 1 };
      }
      return w;
    }));
  }, [getMaxZIndex]);

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



  return {
    windows,
    setWindows,
    toggleWindow,
    closeWindow,
    focusWindow,
    updateWindowPosition
  };
} 