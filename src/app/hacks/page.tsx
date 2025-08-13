'use client';

import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Link from 'next/link';

export default function HacksPage() {
  const { t } = useTranslation();

  const handleApplyClick = () => {
    // Always redirect to the Feishu form
    window.open('https://cvji2p7f0zb.feishu.cn/share/base/form/shrcny72hVeWJTsOh6q5uKOSaJf', '_blank');
  };

  return (
    <main className="min-h-screen bg-black flex flex-col items-center relative">
      {/* Vertical Image - Centered with appropriate width */}
      <div className="w-full h-full flex items-center justify-center">
        <div className="max-w-md w-full">
          <Image
            src="/images/vibe-hacks-01.png"
            alt="Vibe Hacks"
            width={400}
            height={800}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </div>

      {/* Registration Button - Fixed to bottom of viewport */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <button
          onClick={handleApplyClick}
          className="bg-black text-white border-2 border-white px-8 py-4 text-lg font-bold rounded-lg hover:bg-gray-800 hover:cursor-pointer transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          立刻报名
        </button>
      </div>

      {/* Bottom padding to prevent button overlap */}
      <div className="h-32 bg-black"></div>
    </main>
  );
}
