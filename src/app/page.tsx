'use client';

import { useTranslation } from 'react-i18next';
import MenuBar from '@/components/MenuBar';
import Image from 'next/image';
import FileIcon from '@/components/FileIcon';
import { ManagedWindow, useWindowManager, calculateInitialPosition, Window } from '@/components/WindowManager';
import { AnimatePresence } from 'framer-motion';
import MacWindow from '@/components/ThemedWindow';
import { useWindowSize } from '@/hooks/useWindowSize';
import { useState, useEffect, useCallback } from 'react';
import NoteWindow from '@/components/NoteWindow';

// Define constants matching WindowManager.tsx
const MARGIN = 80;
const OFFSET = 80;

const WINDOWS_CONFIG = [
  { 
    id: 'about',
    title: 'About.txt',
    isOpen: true,
    zIndex: 1,
    size: { width: 400, height: 300 }
  },
  { 
    id: 'manifesto',
    title: 'Manifesto.txt',
    isOpen: true,
    zIndex: 2,
    size: { width: 450, height: 380 }
  },
  { 
    id: 'vibeCafe',
    title: 'VibeCafe.app',
    isOpen: false,
    zIndex: 3,
  },
  { 
    id: 'contact',
    title: 'Contact.app',
    isOpen: true,
    zIndex: 4,
  },
  {
    id: 'code',
    title: 'code.mov',
    isOpen: false,
    zIndex: 5,
    size: { width: 400, height: 400 }
  },
  {
    id: 'design',
    title: 'design.figma',
    isOpen: false,
    zIndex: 6,
    size: { width: 600, height: 400 }
  }
];

// Default viewport size for SSR
const DEFAULT_VIEWPORT = { width: 1024, height: 768 };

const INITIAL_WINDOWS = WINDOWS_CONFIG.map((window, index) => ({
  ...window,
  position: calculateInitialPosition(index, WINDOWS_CONFIG.length, DEFAULT_VIEWPORT)
}));

export default function Home() {
  const [hydrated, setHydrated] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  const { windows, setWindows, toggleWindow, closeWindow, focusWindow, updateWindowPosition } = useWindowManager(INITIAL_WINDOWS);
  const { isMobile, width: viewportWidth, height: viewportHeight } = useWindowSize();
  const [desktopStyle, setDesktopStyle] = useState<'mac' | 'windows' | 'linux' | 'claude'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('desktopStyle') as 'mac' | 'windows' | 'linux' | 'claude') || 'mac';
    }
    return 'mac';
  });

  // Update window positions when viewport changes
  useEffect(() => {
    if (!hydrated) return;

    const openWindows = windows.filter(w => w.isOpen);
    openWindows.forEach((window, index) => {
      const newPosition = calculateInitialPosition(
        index,
        openWindows.length,
        { width: viewportWidth, height: viewportHeight }
      );
      updateWindowPosition(window.id, newPosition.x, newPosition.y);
    });
  }, [viewportWidth, viewportHeight, hydrated, updateWindowPosition]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.menu-item')) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleNewWindow = useCallback(() => {
    const id = `note-${Date.now()}`;
    
    // Find a position that doesn't overlap with existing windows
    const existingOpenWindows = windows.filter(w => w.isOpen);
    let position = { x: MARGIN, y: MARGIN };
    
    if (existingOpenWindows.length > 0) {
      // Find the window with the highest Y position (lowest on screen)
      const lowestWindow = existingOpenWindows.reduce((lowest, win) => {
        return win.position.y > lowest.position.y ? win : lowest;
      });
      
      // Position the new window below the lowest window
      position = {
        x: lowestWindow.position.x,
        y: lowestWindow.position.y + (lowestWindow.size?.height || 240) + OFFSET
      };
      
      // Check if this would put the window below the viewport
      if (position.y + 300 > viewportHeight - MARGIN) {
        // Find the rightmost window
        const rightmostWindow = existingOpenWindows.reduce((rightmost, win) => {
          return win.position.x > rightmost.position.x ? win : rightmost;
        });
        
        // Position the new window to the right of the rightmost window
        position = {
          x: rightmostWindow.position.x + (rightmostWindow.size?.width || 400) + OFFSET,
          y: MARGIN
        };
        
        // If this would put the window outside the viewport, start at the beginning
        if (position.x + 400 > viewportWidth - MARGIN) {
          position = { x: MARGIN, y: MARGIN };
        }
      }
    }
    
    // Add the new note window to the windows array
    const newWindow = {
      id,
      title: 'Untitled.txt',
      isOpen: true,
      zIndex: windows.length + 1,
      position,
      size: { width: 400, height: 300 }
    };
    
    setWindows((prev: Window[]) => [...prev, newWindow]);
  }, [windows, viewportWidth, viewportHeight, setWindows]);

  useEffect(() => {
    window.addEventListener('openNewWindow', handleNewWindow);
    return () => window.removeEventListener('openNewWindow', handleNewWindow);
  }, [handleNewWindow]);

  // Language persistence
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language');
      if (savedLang && savedLang !== i18n.language) {
        i18n.changeLanguage(savedLang);
      }
    }
  }, [i18n]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('desktopStyle', desktopStyle);
    }
  }, [desktopStyle]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', i18n.language);
    }
  }, [i18n.language]);

  if (!hydrated) return null;

  const fileIcons = [
    {
      id: 'about',
      name: 'About.txt',
      type: 'txt' as const,
    },
    {
      id: 'manifesto',
      name: 'Manifesto.txt',
      type: 'txt' as const,
    },
    {
      id: 'vibeCafe',
      name: 'VibeCafe.app',
      type: 'app' as const,
      icon: '☕️',
    },
    {
      id: 'contact',
      name: 'Contact.app',
      type: 'app' as const,
      icon: '📧',
    },
    {
      id: 'code',
      name: 'code.mov',
      type: 'app' as const,
      icon: '🎬',
    },
    {
      id: 'design',
      name: 'design.figma',
      type: 'app' as const,
      icon: '🧑‍🎨',
    },
  ];

  const getMainStyle = () => {
    switch (desktopStyle) {
      case 'windows':
        return 'font-[\'MS_Sans_Serif\']';
      case 'linux':
        return 'font-[\'Liberation_Sans\']';
      case 'claude':
        return 'font-mono';
      default: // mac
        return 'font-chicago';
    }
  };
  
  const getBackgroundImage = () => {
    switch (desktopStyle) {
      case 'windows':
        return 'url("/wallpapers/windows.webp")';
      case 'linux':
        return 'url("/wallpapers/linxus.jpg")';
      case 'claude':
        return 'none'; // Black background for Claude Code theme
      default: // mac
        return 'url("/wallpapers/mac.jpg")';
    }
  };

  const getWindowStyle = (style: 'mac' | 'windows' | 'linux' | 'claude') => {
    switch (style) {
      case 'windows':
        return 'border-[2.5px] border-[#000] rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-[#C0C0C0] font-[\'MS_Sans_Serif\']';
      case 'linux':
        return 'border border-[#6A6A6A] rounded shadow-md bg-[#DFDFDF] font-[\'Liberation_Sans\']';
      case 'claude':
        return 'border border-white rounded-none shadow-none bg-black font-mono';
      default: // mac
        return 'bg-white border border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'; // Default Mac style for ManagedWindow
    }
  };

  const renderWindowContent = (windowId: string) => {
    switch (windowId) {
      case 'about':
        return (
                      <div className={`flex flex-col items-center gap-6 p-4 ${desktopStyle === 'claude' ? 'text-white' : 'text-black'}`}>
            <div className="w-24 h-24 bg-black rounded-lg flex items-center justify-center p-3 aspect-square">
              <Image
                src="/images/vibe-logo.jpeg"
                alt="Vibe Cafe Logo"
                width={72}
                height={72}
                className="w-full h-full object-cover rounded"
                priority
              />
            </div>
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                <h1 className={`text-2xl font-bold ${desktopStyle === 'claude' ? 'text-white' : 'text-black'}`}>{t('hero.title')}</h1>
                <span className={`text-sm ${desktopStyle === 'claude' ? 'text-white' : 'text-gray-800'}`}>|</span>
                <p className={`text-sm italic ${desktopStyle === 'claude' ? 'text-white' : 'text-gray-800'}`}>{t('hero.subtitle')}</p>
              </div>
              <p className={`text-sm leading-relaxed ${desktopStyle === 'claude' ? 'text-white' : 'text-gray-600'}`}>{t('hero.description')}</p>
            </div>
          </div>
        );
      case 'manifesto':
        return (
                      <div className={`space-y-5 text-sm p-5 ${desktopStyle === 'claude' ? 'text-white' : 'text-black'}`}>
            <div className="space-y-3">
                              <h3 className={`font-bold text-sm leading-tight ${desktopStyle === 'claude' ? 'text-white' : 'text-black'}`}>{t('manifesto.vision')}</h3>
                <h3 className={`font-bold text-sm leading-tight ${desktopStyle === 'claude' ? 'text-white' : 'text-black'}`}>{t('manifesto.mission')}</h3>
            </div>
                          <div className={`space-y-4 pt-3 border-t ${desktopStyle === 'claude' ? 'border-white' : 'border-gray-200'}`}>
                <div className="space-y-1">
                  <p className={`leading-relaxed text-sm ${desktopStyle === 'claude' ? 'text-white' : 'text-gray-800'}`}>{t('manifesto.text1')}</p>
                </div>
                <div className="space-y-1">
                  <p className={`leading-relaxed text-sm ${desktopStyle === 'claude' ? 'text-white' : 'text-gray-800'}`}>{t('manifesto.text2')}</p>
                </div>
                <div className="space-y-1">
                  <p className={`leading-relaxed text-sm ${desktopStyle === 'claude' ? 'text-white' : 'text-gray-800'}`}>{t('manifesto.text3')}</p>
                </div>
              </div>
          </div>
        );
      case 'vibeCafe':
        return (
                      <div className={`space-y-2 md:space-y-3 ${desktopStyle === 'claude' ? 'text-white' : 'text-black'}`}>
                          <h3 className={`font-bold text-base md:text-lg ${desktopStyle === 'claude' ? 'text-white' : 'text-black'}`}>{t('vibeCafe.title')}</h3>
              <p className={`text-xs italic ${desktopStyle === 'claude' ? 'text-white' : 'text-gray-700'}`}>{t('vibeCafe.comingSoon')}</p>
          </div>
        );
      case 'contact':
        return (
                      <div className={`space-y-4 ${desktopStyle === 'claude' ? 'text-white' : 'text-black'}`}>
                          <h3 className={`font-bold text-base ${desktopStyle === 'claude' ? 'text-white' : 'text-black'}`}>{t('contact.title')}</h3>
            <div className="flex flex-col items-center gap-4">
                              <div className={`p-2 rounded-lg shadow-sm ${desktopStyle === 'claude' ? 'bg-black border border-white' : 'bg-white'}`}>
                <Image 
                  src="/images/vibe-friends-qr.jpg" 
                  alt="Vibe Friends QR Code" 
                  width={120} 
                  height={120}
                  className="rounded"
                  priority
                />
              </div>
            </div>
          </div>
        );
      case 'code':
        return (
          <div className="w-full h-full absolute inset-0 aspect-square">
            <video
              className="w-full h-full object-cover"
              src="/videos/vibe-cafe.mov"
              autoPlay
              loop
              playsInline
            />
          </div>
        );
      case 'design':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <iframe
              className="w-full h-[500px] rounded border"
              src="https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/design/wvQLFXP3FkVe4LtOOoNnD6/VibeCaf%C3%A9?node-id=0-1"
              allowFullScreen
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className={`min-h-screen ${getMainStyle()} ${isMobile ? 'pt-8' : 'pt-6'}`} style={{ 
      backgroundImage: getBackgroundImage(),
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: desktopStyle === 'claude' ? '#000000' : 'transparent'
    }}>
      {desktopStyle !== 'claude' && (
        <MenuBar desktopStyle={desktopStyle} onChangeDesktopStyle={setDesktopStyle} />
      )}
      
      {/* Desktop Icons - Hide on Mobile */}
      {!isMobile && (
        <>
          {/* Apple Dock */}
          {desktopStyle === 'mac' && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-row gap-4 bg-white/80 border border-black rounded-2xl px-6 py-2 shadow-lg backdrop-blur z-40">
              {fileIcons.map(icon => {
                const window = windows.find(w => w.id === icon.id);
                return (
                  <FileIcon
                    key={icon.id}
                    name={icon.name}
                    type={icon.type}
                    icon={icon.icon}
                    onClick={() => toggleWindow(icon.id)}
                    isOpen={window?.isOpen || false}
                    desktopStyle={desktopStyle}
                  />
                );
              })}
            </div>
          )}

          {/* Windows & Linux Vertical Stack */}
          {(desktopStyle === 'windows' || desktopStyle === 'linux') && (
            <div className="fixed left-4 top-20 flex flex-col gap-4 z-40">
              <AnimatePresence mode="popLayout">
                {fileIcons.map(icon => {
                  const window = windows.find(w => w.id === icon.id);
                  return (
                    <FileIcon
                      key={icon.id}
                      name={icon.name}
                      type={icon.type}
                      icon={icon.icon}
                      onClick={() => toggleWindow(icon.id)}
                      isOpen={window?.isOpen || false}
                      desktopStyle={desktopStyle}
                    />
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* Claude Terminal-style Top Menu - Only for Claude theme */}
          {desktopStyle === 'claude' && (
            <div className="fixed top-4 left-4 bg-black border border-[#DE7356] px-6 py-2 z-40 min-w-[400px]">
              <div className="flex items-center gap-4 text-[#DE7356] font-mono text-sm">
                <span>🤖</span>
                
                {/* VibeCafé Menu with Dropdown */}
                <div className="relative menu-item">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(activeMenu === 'vibeCafe' ? null : 'vibeCafe');
                    }}
                    className="px-2 py-1 hover:bg-[#DE7356] hover:text-black"
                  >
                    VibeCafé
                  </button>
                  {activeMenu === 'vibeCafe' && (
                    <div className="absolute left-0 mt-1 bg-black border border-[#DE7356] px-2 py-1 z-50 min-w-[140px]">
                      <button
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('openNewWindow'));
                          setActiveMenu(null);
                        }}
                        className="block w-full text-left px-2 py-1 hover:bg-[#DE7356] hover:text-black"
                      >
                        New
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          setActiveMenu(null);
                        }}
                        className="block w-full text-left px-2 py-1 hover:bg-[#DE7356] hover:text-black"
                      >
                        Copy link
                      </button>
                      <button
                        onClick={() => {
                          const url = encodeURIComponent(window.location.href);
                          window.open(`https://twitter.com/intent/tweet?url=${url}`, '_blank');
                          setActiveMenu(null);
                        }}
                        className="block w-full text-left px-2 py-1 hover:bg-[#DE7356] hover:text-black"
                      >
                        Share to X
                      </button>
                    </div>
                  )}
                </div>

                {/* View Menu with Dropdown */}
                <div className="relative menu-item">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(activeMenu === 'view' ? null : 'view');
                    }}
                    className="px-2 py-1 hover:bg-[#DE7356] hover:text-black"
                  >
                    View
                  </button>
                  {activeMenu === 'view' && (
                    <div className="absolute left-0 mt-1 bg-black border border-[#DE7356] px-2 py-1 z-50 min-w-[160px]">
                      <button
                        onClick={() => { setDesktopStyle('mac'); setActiveMenu(null); }}
                        className="block w-full text-left px-2 py-1 hover:bg-[#DE7356] hover:text-black"
                      >
                        {desktopStyle === 'mac' ? '✔ ' : ''}Mac
                      </button>
                      <button
                        onClick={() => { setDesktopStyle('windows'); setActiveMenu(null); }}
                        className="block w-full text-left px-2 py-1 hover:bg-[#DE7356] hover:text-black"
                      >
                        {desktopStyle === 'windows' ? '✔ ' : ''}Windows
                      </button>
                      <button
                        onClick={() => { setDesktopStyle('linux'); setActiveMenu(null); }}
                        className="block w-full text-left px-2 py-1 hover:bg-[#DE7356] hover:text-black"
                      >
                        {desktopStyle === 'linux' ? '✔ ' : ''}Linux
                      </button>
                      <button
                        onClick={() => { setDesktopStyle('claude'); setActiveMenu(null); }}
                        className="block w-full text-left px-2 py-1 hover:bg-[#DE7356] hover:text-black"
                      >
                        {desktopStyle === 'claude' ? '✔ ' : ''}Claude Code
                      </button>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => {
                    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
                    i18n.changeLanguage(newLang);
                  }}
                  className="px-2 py-1 hover:bg-[#DE7356] hover:text-black"
                >
                  {i18n.language === 'zh' ? 'EN' : '中文'}
                </button>


                <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          )}

          {/* Claude Terminal-style Bottom App Icons */}
          {desktopStyle === 'claude' && (
            <div className="fixed bottom-4 left-4 bg-black border border-white px-4 py-2 z-40">
              <div className="flex items-center gap-4 text-white font-mono text-sm">
                {fileIcons.map(icon => {
                  const window = windows.find(w => w.id === icon.id);
                  return (
                    <button
                      key={icon.id}
                      onClick={() => toggleWindow(icon.id)}
                      className={`px-2 py-1 ${window?.isOpen ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}
                    >
                      {icon.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}


        </>
      )}

      {/* Windows */}
      <div className={`relative ${isMobile ? 'px-2 space-y-3 pb-4' : 'container mx-auto px-4 pt-8'}`}>
        {isMobile ? (
          // Mobile: Stack windows vertically (simplified, only Mac/Win)
          windows.map((window) => {
            if (!window.isOpen) return null;
            return (
              <MacWindow
                key={window.id}
                title={window.title}
                onClose={() => closeWindow(window.id)}
                className={desktopStyle === 'windows' ? 'border-[2.5px] border-[#000] rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-[#C0C0C0] font-[\'MS_Sans_Serif\']' : 'bg-white border border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}
                isMobile={isMobile}
                desktopStyle={desktopStyle === 'windows' ? 'windows' : 'mac'} // Mobile defaults to Mac if not Windows
              >
                {window.id.startsWith('note-') ? (
                  <NoteWindow desktopStyle={desktopStyle} />
                ) : (
                  renderWindowContent(window.id)
                )}
              </MacWindow>
            );
          })
        ) : (
          // Desktop: Draggable windows
          <>
            <AnimatePresence mode="popLayout">
              {windows.map((window) => {
                if (!window.isOpen) return null;
                return (
                  <ManagedWindow
                    key={window.id}
                    id={window.id}
                    title={window.title}
                    isOpen={window.isOpen}
                    onClose={() => closeWindow(window.id)}
                    onFocus={() => focusWindow(window.id)}
                    zIndex={window.zIndex}
                    position={window.position}

                    size={window.size}
                    className={getWindowStyle(desktopStyle)} // Apply theme class
                    desktopStyle={desktopStyle} // Pass theme to ManagedWindow/ThemedWindow
                  >
                    {window.id.startsWith('note-') ? (
                      <NoteWindow desktopStyle={desktopStyle} />
                    ) : (
                      renderWindowContent(window.id)
                    )}
                  </ManagedWindow>
                );
              })}
            </AnimatePresence>
          </>
        )}
      </div>
    </main>
  );
}
