'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import MenuBar from '@/components/MenuBar';
import MacWindow from '@/components/MacWindow';

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-[#9C9C9C] font-chicago pt-6">
      <MenuBar />
      
      {/* Desktop */}
      <div className="container mx-auto px-4 pt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Profile Window */}
          <MacWindow title="About.txt" className="md:col-span-2 lg:col-span-3">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-black rounded-lg flex items-center justify-center">
                <span className="text-4xl">👾</span>
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
            </div>
          </MacWindow>

          {/* VibeFriends Window */}
          <MacWindow title="VibeFriends.app">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">👥</span>
                <div>
                  <h3 className="font-bold">{t('vibeFriends.coders.title')}</h3>
                  <p className="text-xs text-gray-600">{t('vibeFriends.coders.description')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h3 className="font-bold">{t('vibeFriends.products.title')}</h3>
                  <p className="text-xs text-gray-600">{t('vibeFriends.products.description')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎨</span>
                <div>
                  <h3 className="font-bold">{t('vibeFriends.creators.title')}</h3>
                  <p className="text-xs text-gray-600">{t('vibeFriends.creators.description')}</p>
                </div>
              </div>
            </div>
          </MacWindow>

          {/* VibeCafé Space Window */}
          <MacWindow title="VibeCafe.app">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏢</span>
                <h3 className="font-bold">{t('vibeCafe.title')}</h3>
              </div>
              <p className="text-sm text-gray-600">{t('vibeCafe.description')}</p>
              <p className="text-xs text-gray-500 italic">{t('vibeCafe.comingSoon')}</p>
            </div>
          </MacWindow>

          {/* Contact Window */}
          <MacWindow title="Contact.app">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📬</span>
                <h3 className="font-bold">{t('contact.title')}</h3>
              </div>
              <p className="text-sm text-gray-600">{t('contact.description')}</p>
              <a 
                href="mailto:contact@vibecafe.com"
                className="inline-block bg-black text-white text-sm px-4 py-1 rounded hover:bg-gray-800 transition-colors"
              >
                {t('contact.button')}
              </a>
            </div>
          </MacWindow>
        </div>

        {/* Desktop Icons */}
        <div className="fixed bottom-4 right-4 flex flex-col items-center gap-4 z-20">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-16 h-16 bg-white border border-black rounded flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
          >
            <span className="text-2xl">🗑️</span>
          </motion.button>
        </div>
      </div>
    </main>
  );
}
