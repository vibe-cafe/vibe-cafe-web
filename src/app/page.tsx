'use client';

import { useTranslation } from 'react-i18next';
import MenuBar from '@/components/MenuBar';
import Image from 'next/image';
import FileIcon from '@/components/FileIcon';
import { ManagedWindow, useWindowManager } from '@/components/WindowManager';
import { AnimatePresence } from 'framer-motion';
import MacWindow from '@/components/MacWindow';
import { useWindowSize } from '@/hooks/useWindowSize';

const INITIAL_WINDOWS = [
  { 
    id: 'about',
    title: 'About.txt',
    isOpen: true,
    zIndex: 1,
    position: { x: 80, y: 40 }
  },
  { 
    id: 'manifesto',
    title: 'Manifesto.txt',
    isOpen: true,
    zIndex: 2,
    position: { x: 160, y: 120 }
  },
  { 
    id: 'vibeFriends',
    title: 'VibeFriends.app',
    isOpen: true,
    zIndex: 3,
    position: { x: 240, y: 200 }
  },
  { 
    id: 'vibeCafe',
    title: 'VibeCafe.app',
    isOpen: true,
    zIndex: 4,
    position: { x: 320, y: 280 }
  },
  { 
    id: 'contact',
    title: 'Contact.app',
    isOpen: true,
    zIndex: 5,
    position: { x: 400, y: 360 }
  },
];

export default function Home() {
  const { t } = useTranslation();
  const { windows, toggleWindow, closeWindow, focusWindow, emptyTrash } = useWindowManager(INITIAL_WINDOWS);
  const { isMobile } = useWindowSize();

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
  ];

  return (
    <main className={`min-h-screen bg-[#9C9C9C] font-chicago ${isMobile ? 'pt-2' : 'pt-6'}`}>
      <MenuBar />
      
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
          windows.map((window, index) => {
            if (!window.isOpen) return null;
            const content = (() => {
              switch (window.id) {
                case 'about':
                  return (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-black rounded-lg flex items-center justify-center p-2">
                        <Image
                          src="/images/vibe-logo.jpeg"
                          alt="Vibe Cafe Logo"
                          width={64}
                          height={64}
                          className="w-full h-full object-contain"
                          priority
                        />
                      </div>
                      <div className="text-center">
                        <h1 className="text-xl font-bold mb-2">{t('hero.title')}</h1>
                        <p className="text-sm text-gray-600">{t('hero.subtitle')}</p>
                      </div>
                    </div>
                  );
                case 'manifesto':
                  return (
                    <div className="space-y-3 text-sm">
                      <p>{t('manifesto.text1')}</p>
                      <p>{t('manifesto.text2')}</p>
                      <p>{t('manifesto.text3')}</p>
                    </div>
                  );
                case 'vibeFriends':
                  return (
                    <div className="space-y-2">
                      <h3 className="font-bold text-base">{t('vibeFriends.title')}</h3>
                      <p className="text-sm text-gray-600">{t('vibeFriends.description')}</p>
                    </div>
                  );
                case 'vibeCafe':
                  return (
                    <div className="space-y-2">
                      <h3 className="font-bold text-base">{t('vibeCafe.title')}</h3>
                      <p className="text-sm text-gray-600">{t('vibeCafe.description')}</p>
                      <p className="text-xs text-gray-500 italic">{t('vibeCafe.comingSoon')}</p>
                    </div>
                  );
                case 'contact':
                  return (
                    <div className="space-y-2">
                      <h3 className="font-bold text-base">{t('contact.title')}</h3>
                      <button 
                        className="inline-block bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800 transition-colors w-full text-center"
                      >
                        {t('contact.button')}
                      </button>
                    </div>
                  );
                default:
                  return null;
              }
            })();

            return (
              <div key={window.id} className={`w-full ${index === 0 ? 'mt-14' : ''}`}>
                <MacWindow
                  title={window.title}
                  isMobile={true}
                >
                  {content}
                </MacWindow>
              </div>
            );
          })
        ) : (
          // Desktop: Keep existing draggable windows
          <AnimatePresence>
            {windows.map(window => {
              const content = (() => {
                switch (window.id) {
                  case 'about':
                    return (
                      <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-black rounded-lg flex items-center justify-center p-3">
                          <Image
                            src="/images/vibe-logo.jpeg"
                            alt="Vibe Cafe Logo"
                            width={72}
                            height={72}
                            className="w-full h-full object-contain"
                            priority
                          />
                        </div>
                        <div>
                          <h1 className="text-2xl font-bold mb-2">{t('hero.title')}</h1>
                          <p className="text-sm text-gray-600">{t('hero.subtitle')}</p>
                        </div>
                      </div>
                    );
                  case 'manifesto':
                    return (
                      <div className="space-y-3 text-sm">
                        <p>{t('manifesto.text1')}</p>
                        <p>{t('manifesto.text2')}</p>
                        <p>{t('manifesto.text3')}</p>
                      </div>
                    );
                  case 'vibeFriends':
                    return (
                      <div className="space-y-3">
                        <h3 className="font-bold text-lg">{t('vibeFriends.title')}</h3>
                        <p className="text-sm text-gray-600">{t('vibeFriends.description')}</p>
                      </div>
                    );
                  case 'vibeCafe':
                    return (
                      <div className="space-y-3">
                        <h3 className="font-bold text-lg">{t('vibeCafe.title')}</h3>
                        <p className="text-sm text-gray-600">{t('vibeCafe.description')}</p>
                        <p className="text-xs text-gray-500 italic">{t('vibeCafe.comingSoon')}</p>
                      </div>
                    );
                  case 'contact':
                    return (
                      <div className="space-y-3">
                        <h3 className="font-bold text-lg">{t('contact.title')}</h3>
                        <button 
                          className="inline-block bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800 transition-colors w-full text-center"
                        >
                          {t('contact.button')}
                        </button>
                      </div>
                    );
                  default:
                    return null;
                }
              })();

              return (
                <ManagedWindow
                  key={window.id}
                  {...window}
                  onClose={() => closeWindow(window.id)}
                  onFocus={() => focusWindow(window.id)}
                >
                  {content}
                </ManagedWindow>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </main>
  );
}
