'use client';

import { useTranslation } from 'react-i18next';
import Script from 'next/script';

export default function StructuredData() {
  const { i18n } = useTranslation();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: i18n.language === 'zh' ? 'Vibe Hacks #01 - 24小时 AI 编程黑客松' : 'Vibe Hacks #01 - 24-Hour AI Coding Hackathon',
    description: i18n.language === 'zh' 
      ? 'VibeFriends 和 SegmentFault 联合主办的 24 小时 Vibe Coding 黑客松。33 组参赛者，真实用户投票，数万元奖金等你来拿！主题：用 Vibe Coding 优化 Vibe Coding。'
      : 'Join the 24-hour Vibe Coding hackathon co-hosted by VibeFriends and SegmentFault. 33 teams compete for real user votes and prizes worth tens of thousands. Theme: Optimize Vibe Coding with Vibe Coding.',
    startDate: '2025-09-13T09:00:00+08:00',
    endDate: '2025-09-14T09:00:00+08:00',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: i18n.language === 'zh' ? '北京中关村科学城·东升科技园' : 'Beijing Zhongguancun Science City · Dongsheng Science and Technology Park',
      address: {
        '@type': 'PostalAddress',
        addressLocality: i18n.language === 'zh' ? '北京' : 'Beijing',
        addressCountry: i18n.language === 'zh' ? '中国' : 'China'
      }
    },
    organizer: [
      {
        '@type': 'Organization',
        name: 'VibeFriends',
        url: 'https://vibecafe.app'
      },
      {
        '@type': 'Organization',
        name: 'SegmentFault'
      }
    ],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CNY',
      availability: 'https://schema.org/InStock',
      validFrom: '2025-08-01T00:00:00+08:00'
    },
    audience: {
      '@type': 'Audience',
      audienceType: i18n.language === 'zh' ? 'AI开发者，程序员，创作者' : 'AI developers, programmers, creators'
    },
    inLanguage: i18n.language === 'zh' ? 'zh-CN' : 'en-US',
    keywords: i18n.language === 'zh' 
      ? 'Vibe Hacks, 黑客松, AI编程, Vibe Coding, VibeFriends, SegmentFault, 编程比赛, 北京, 24小时, AI开发'
      : 'Vibe Hacks, hackathon, AI coding, Vibe Coding, VibeFriends, SegmentFault, coding competition, Beijing, 24-hour, AI development',
    award: [
      {
        '@type': 'MonetaryGrant',
        name: i18n.language === 'zh' ? '真的会用奖第一名' : 'First Place - Real Usage Award',
        amount: {
          '@type': 'MonetaryAmount',
          value: '10000',
          currency: 'CNY'
        }
      },
      {
        '@type': 'MonetaryGrant',
        name: i18n.language === 'zh' ? '真的会用奖第二名' : 'Second Place - Real Usage Award',
        amount: {
          '@type': 'MonetaryAmount',
          value: '5000',
          currency: 'CNY'
        }
      },
      {
        '@type': 'MonetaryGrant',
        name: i18n.language === 'zh' ? '真的会用奖第三名' : 'Third Place - Real Usage Award',
        amount: {
          '@type': 'MonetaryAmount',
          value: '3000',
          currency: 'CNY'
        }
      }
    ]
  };

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}