'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import MenuBar from '@/components/MenuBar';
import MacWindow from '@/components/MacWindow';
import Image from 'next/image';

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-[#9C9C9C] font-chicago pt-6">
      <MenuBar />
      
      {/* Desktop */}
      <div className="container mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Profile Window */}
          <MacWindow title="About.txt" className="md:col-span-2 lg:col-span-3">
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
          </MacWindow>

          {/* Manifesto Window */}
          <MacWindow title="Manifesto.txt">
            <div className="space-y-3 text-sm">
              <p>{t('manifesto.text1')}</p>
              <p>{t('manifesto.text2')}</p>
              <p>{t('manifesto.text3')}</p>
            </div>
          </MacWindow>

          {/* VibeFriends Window */}
          <MacWindow title="VibeFriends.app">
            <div className="space-y-3">
              <h3 className="font-bold text-lg">{t('vibeFriends.title')}</h3>
              <p className="text-sm text-gray-600">{t('vibeFriends.description')}</p>
            </div>
          </MacWindow>

          {/* VibeCafé Space Window */}
          <MacWindow title="VibeCafe.app">
            <div className="space-y-3">
              <h3 className="font-bold text-lg">{t('vibeCafe.title')}</h3>
              <p className="text-sm text-gray-600">{t('vibeCafe.description')}</p>
              <p className="text-xs text-gray-500 italic">{t('vibeCafe.comingSoon')}</p>
            </div>
          </MacWindow>

          {/* Contact Window */}
          <MacWindow title="Contact.app">
            <div className="space-y-3">
              <h3 className="font-bold text-lg">{t('contact.title')}</h3>
              <button 
                className="inline-block bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800 transition-colors w-full text-center"
              >
                {t('contact.button')}
              </button>
            </div>
          </MacWindow>
        </div>

        {/* Desktop Icons */}
        <div className="fixed bottom-4 right-4 flex flex-col items-center gap-4 z-20">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-16 h-16 bg-white border border-black rounded flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
            aria-label="Trash"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 7H20M19 7L18.133 19.142C18.0971 19.6466 17.8713 20.1188 17.5011 20.4636C17.1309 20.8083 16.6439 21 16.138 21H7.862C7.35614 21 6.86907 20.8083 6.49889 20.4636C6.1287 20.1188 5.90292 19.6466 5.867 19.142L5 7H19ZM10 11V17M14 11V17M15 7V4C15 3.73478 14.8946 3.48043 14.7071 3.29289C14.5196 3.10536 14.2652 3 14 3H10C9.73478 3 9.48043 3.10536 9.29289 3.29289C9.10536 3.48043 9 3.73478 9 4V7H15Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        </div>
      </div>
    </main>
  );
}
