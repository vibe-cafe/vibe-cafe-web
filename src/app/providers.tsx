'use client';

import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/config';
import { useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  // Keep a language cookie in sync for SSR lang attribute
  useEffect(() => {
    const handleLangChange = (lng: string) => {
      try {
        document.cookie = `language=${lng}; path=/; max-age=${60 * 60 * 24 * 365}`;
      } catch {
        // noop
      }
    };
    i18n.on('languageChanged', handleLangChange);
    // initialize on mount
    handleLangChange(i18n.language);
    return () => {
      i18n.off('languageChanged', handleLangChange);
    };
  }, []);
  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
} 