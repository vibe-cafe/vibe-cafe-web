'use client';

import { useTranslation } from 'react-i18next';
import MenuBar from '@/components/MenuBar';
import Image from 'next/image';
import FileIcon from '@/components/FileIcon';
import { ManagedWindow, useWindowManager, calculateInitialPosition } from '@/components/WindowManager';
import { AnimatePresence } from 'framer-motion';
import MacWindow from '@/components/MacWindow';
import { useWindowSize } from '@/hooks/useWindowSize';
import { useState } from 'react';

const WINDOWS_CONFIG = [
  { 
    id: 'about',
    title: 'About.txt',
    isOpen: true,
    zIndex: 1,
  },
  { 
    id: 'manifesto',
    title: 'Manifesto.txt',
    isOpen: true,
    zIndex: 2,
  },
  { 
    id: 'vibeFriends',
    title: 'VibeFriends.app',
    isOpen: true,
    zIndex: 3,
  },
  { 
    id: 'vibeCafe',
    title: 'VibeCafe.app',
    isOpen: true,
    zIndex: 4,
  },
  { 
    id: 'contact',
    title: 'Contact.app',
    isOpen: true,
    zIndex: 5,
  },
  {
    id: 'code',
    title: 'code.mov',
    isOpen: false,
    zIndex: 6,
    size: { width: 400, height: 400 }
  },
];

const INITIAL_WINDOWS = WINDOWS_CONFIG.map((window, index) => ({
  ...window,
  position: calculateInitialPosition(index, WINDOWS_CONFIG.length)
}));

export default function Home() {
  const { t } = useTranslation();
  const { windows, toggleWindow, closeWindow, focusWindow, emptyTrash } = useWindowManager(INITIAL_WINDOWS);
  const { isMobile } = useWindowSize();
  const [desktopStyle, setDesktopStyle] = useState<'mac' | 'windows'>('mac');

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
      id: 'vibeFriends',
      name: 'VibeFriends.app',
      type: 'app' as const,
      icon: '🧑‍🤝‍🧑',
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
  ];

  const renderWindowContent = (windowId: string) => {
    switch (windowId) {
      case 'about':
        return (
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-black">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-black rounded-lg flex items-center justify-center p-2 md:p-3">
              <Image
                src="/images/vibe-logo.jpeg"
                alt="Vibe Cafe Logo"
                width={72}
                height={72}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-xl md:text-2xl font-bold mb-2 text-black">{t('hero.title')}</h1>
              <p className="text-sm text-gray-800">{t('hero.subtitle')}</p>
            </div>
          </div>
        );
      case 'manifesto':
        return (
          <div className="space-y-3 text-sm text-black">
            <p className="text-gray-800">{t('manifesto.text1')}</p>
            <p className="text-gray-800">{t('manifesto.text2')}</p>
            <p className="text-gray-800">{t('manifesto.text3')}</p>
          </div>
        );
      case 'vibeFriends':
        return (
          <div className="space-y-2 md:space-y-3 text-black">
            <h3 className="font-bold text-base md:text-lg text-black">{t('vibeFriends.title')}</h3>
            <p className="text-sm text-gray-800">{t('vibeFriends.description')}</p>
          </div>
        );
      case 'vibeCafe':
        return (
          <div className="space-y-2 md:space-y-3 text-black">
            <h3 className="font-bold text-base md:text-lg text-black">{t('vibeCafe.title')}</h3>
            <p className="text-xs text-gray-700 italic">{t('vibeCafe.comingSoon')}</p>
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-2 text-black">
            <h3 className="font-bold text-base text-black">{t('contact.title')}</h3>
            <button 
              className="inline-block bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800 transition-colors w-full text-center"
            >
              {t('contact.button')}
            </button>
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
      default:
        return null;
    }
  };

  return (
    <main className={`min-h-screen ${desktopStyle === 'mac' ? 'bg-[#9C9C9C] font-chicago' : 'bg-[#008080] font-[\'MS_Sans_Serif\']'} ${isMobile ? 'pt-8' : 'pt-6'}`}>
      <MenuBar desktopStyle={desktopStyle} onChangeDesktopStyle={setDesktopStyle} />
      
      {/* Desktop Icons - Hide on Mobile */}
      {!isMobile && (
        <>
          <div className="fixed left-4 top-20 flex flex-col gap-4">
            <AnimatePresence mode="popLayout">
              {fileIcons.map(icon => {
                const window = windows.find(w => w.id === icon.id);
                if (window?.isDeleted) return null;
                
                return (
                  <FileIcon
                    key={icon.id}
                    name={icon.name}
                    type={icon.type}
                    icon={icon.icon}
                    onClick={() => toggleWindow(icon.id)}
                    isOpen={window?.isOpen || false}
                  />
                );
              })}
            </AnimatePresence>
          </div>

          {/* Trash Icon */}
          <div className="fixed bottom-4 right-4">
            <FileIcon
              key="trash"
              name="Trash"
              type="app"
              icon="🗑️"
              onClick={emptyTrash}
              isOpen={false}
            />
          </div>
        </>
      )}

      {/* Windows */}
      <div className={`relative ${isMobile ? 'px-2 space-y-3 pb-4' : 'container mx-auto px-4 pt-8'}`}>
        {isMobile ? (
          // Mobile: Stack windows vertically
          windows.map((window) => {
            if (!window.isOpen || window.isDeleted) return null;
            return (
              <MacWindow
                key={window.id}
                title={window.title}
                onClose={() => closeWindow(window.id)}
                className={desktopStyle === 'windows' ? 'border-[2.5px] border-[#000] rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-[#C0C0C0] font-[\'MS_Sans_Serif\']' : ''}
                isMobile={isMobile}
                windowsStyle={desktopStyle === 'windows'}
              >
                {renderWindowContent(window.id)}
              </MacWindow>
            );
          })
        ) : (
          // Desktop: Draggable windows
          <AnimatePresence mode="popLayout">
            {windows.map((window) => {
              if (!window.isOpen || window.isDeleted) return null;
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
                  isDeleted={window.isDeleted}
                  size={window.size}
                  className={desktopStyle === 'windows' ? 'border-[2.5px] border-[#000] rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-[#C0C0C0] font-[\'MS_Sans_Serif\']' : ''}
                  windowsStyle={desktopStyle === 'windows'}
                >
                  {renderWindowContent(window.id)}
                </ManagedWindow>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </main>
  );
}
