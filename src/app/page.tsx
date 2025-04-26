'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import HeroBackground from '@/components/HeroBackground';

export default function Home() {
  const { t } = useTranslation();

  const sectionTitleClass = "text-4xl font-mono font-bold mb-12 text-center text-gray-200 relative before:content-['//'] before:absolute before:left-0 before:opacity-50 before:text-teal-400";
  const cardClass = "p-6 bg-gray-900/50 border border-gray-700/50 rounded-lg hover:border-teal-400/50 transition-colors duration-300";
  const cardTitleClass = "text-xl font-mono font-bold mb-4 text-teal-300";
  const cardTextClass = "text-gray-400 font-sans";

  return (
    <main className="min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0f18]/90 to-[#0a0f18] z-0" />
        <div className="absolute inset-0 z-10">
          <HeroBackground />
        </div>
        <div className="absolute inset-0 bg-black/20 z-20" /> {/* Lighter overlay */}
        
        {/* Content */}
        <div className="container mx-auto px-4 text-center relative z-30">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-[120px] md:text-[180px] font-mono font-bold mb-2 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white/90 to-white/40"
            >
              {t('hero.title')}
            </motion.h1>
            <motion.p 
              className="text-2xl md:text-3xl text-white/60 tracking-wide font-sans"
            >
              {t('hero.subtitle')}
            </motion.p>
          </motion.div>
        </div>

        {/* Language Switcher */}
        <div className="absolute top-0 right-0 z-40">
          <LanguageSwitcher />
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className={sectionTitleClass}>{t('manifesto.title')}</h2>
          <div className="max-w-3xl mx-auto space-y-6 text-gray-300 font-sans text-lg">
            <p>{t('manifesto.text1')}</p>
            <p>{t('manifesto.text2')}</p>
          </div>
        </div>
      </section>

      {/* VibeFriends Section */}
      <section className="py-20 bg-[#0a0f18]">
        <div className="container mx-auto px-4">
          <h2 className={sectionTitleClass}>{t('vibeFriends.title')}</h2>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-gray-400 mb-12 font-sans">{t('vibeFriends.description')}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className={cardClass}>
                <h3 className={cardTitleClass}>{t('vibeFriends.coders.title')}</h3>
                <p className={cardTextClass}>{t('vibeFriends.coders.description')}</p>
              </div>
              <div className={cardClass}>
                <h3 className={cardTitleClass}>{t('vibeFriends.products.title')}</h3>
                <p className={cardTextClass}>{t('vibeFriends.products.description')}</p>
              </div>
              <div className={cardClass}>
                <h3 className={cardTitleClass}>{t('vibeFriends.creators.title')}</h3>
                <p className={cardTextClass}>{t('vibeFriends.creators.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VibeCafé Physical Space Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className={sectionTitleClass}>{t('vibeCafe.title')}</h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-gray-400 mb-8 font-sans">{t('vibeCafe.description')}</p>
            <div className={`${cardClass} max-w-md mx-auto`}>
              <p className={cardTextClass}>
                {t('vibeCafe.details')}
                <br />
                {t('vibeCafe.comingSoon')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-[#0a0f18]">
        <div className="container mx-auto px-4">
          <h2 className={sectionTitleClass}>{t('contact.title')}</h2>
          <div className="max-w-xl mx-auto text-center">
            <p className="text-lg text-gray-400 mb-8 font-sans">{t('contact.description')}</p>
            <a 
              href="mailto:contact@vibecafe.com" 
              className="inline-block px-8 py-3 bg-teal-400/80 text-black rounded-md font-bold font-sans hover:bg-teal-300 transition-colors duration-300 shadow-lg shadow-teal-500/20 hover:shadow-teal-400/30"
            >
              {t('contact.button')}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
