'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function ClientSEO() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Update document title
    document.title = t('hacks.seo.title');
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('hacks.seo.description'));
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = t('hacks.seo.description');
      document.head.appendChild(meta);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', t('hacks.seo.keywords'));
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = t('hacks.seo.keywords');
      document.head.appendChild(meta);
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', t('hacks.seo.title'));
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:title');
      meta.content = t('hacks.seo.title');
      document.head.appendChild(meta);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', t('hacks.seo.description'));
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:description');
      meta.content = t('hacks.seo.description');
      document.head.appendChild(meta);
    }

    // Update language attribute
    document.documentElement.lang = i18n.language;
  }, [t, i18n.language]);

  return null;
}