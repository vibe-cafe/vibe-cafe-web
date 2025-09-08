'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import BackButton from '@/components/BackButton';
import StructuredData from './StructuredData';

export default function HacksPage() {
  const { t, i18n } = useTranslation();

  return (
    <>
      <StructuredData />
      <main className="min-h-screen bg-black flex flex-col items-center relative">
      {/* Back Button - Fixed top left */}
      <BackButton />

      {/* Language Switcher - Fixed top right */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      {/* Vertical Image - Centered with appropriate width */}
      <div className="w-full h-full flex items-center justify-center">
        <div className="max-w-md w-full">
          <Image
            src={i18n.language === 'zh' ? '/images/vibe-hacks/zh.png' : '/images/vibe-hacks/en.png'}
            alt="Vibe Hacks"
            width={400}
            height={800}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </div>

      {/* Registration Buttons - Fixed to bottom of viewport */}
      <div className="fixed bottom-8 left-4 right-4 z-50 mx-auto max-w-md">
        <div className={`flex ${i18n.language.startsWith('zh') ? 'flex-row' : 'flex-col'} gap-3`}>
          <button
            onClick={() => window.open('https://cvji2p7f0zb.feishu.cn/share/base/form/shrcny72hVeWJTsOh6q5uKOSaJf', '_blank')}
            className="bg-black text-white border-2 border-white w-full px-6 py-3 text-base md:px-8 md:py-4 md:text-lg font-bold rounded-lg hover:bg-gray-800 hover:cursor-pointer transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            {t('hacks.participantApplyButton')}
          </button>
          <button
            onClick={() => window.open('https://cvji2p7f0zb.feishu.cn/share/base/form/shrcnYQ4PlKEQ2acj5XghOJ6z2c', '_blank')}
            className="bg-black text-white border-2 border-white w-full px-6 py-3 text-base md:px-8 md:py-4 md:text-lg font-bold rounded-lg hover:bg-gray-800 hover:cursor-pointer transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            {t('hacks.audienceApplyButton')}
          </button>
        </div>
      </div>

      {/* Bottom padding to prevent button overlap */}
      <div className="h-32 bg-black"></div>
    </main>
    </>
  );
}
